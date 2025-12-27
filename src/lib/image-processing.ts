/**
 * Traitement des images côté client
 * - Conversion HEIC → JPEG
 * - Redimensionnement pour optimiser la bande passante
 * - Extraction des métadonnées EXIF (date de prise de vue, GPS)
 */

// Configuration
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;
const JPEG_QUALITY = 0.85;
const HEIC_QUALITY = 0.9; // Qualité pour conversion HEIC (comme indiqué dans CLAUDE.md)

/**
 * Métadonnées EXIF extraites
 */
export interface ExifMetadata {
  date: string | null;
  latitude: number | null;
  longitude: number | null;
}

/**
 * Parse une valeur rationnelle EXIF (numérateur/dénominateur)
 */
function parseRational(dataView: DataView, offset: number, littleEndian: boolean): number {
  const numerator = dataView.getUint32(offset, littleEndian);
  const denominator = dataView.getUint32(offset + 4, littleEndian);
  return denominator !== 0 ? numerator / denominator : 0;
}

/**
 * Convertit les coordonnées DMS (degrés, minutes, secondes) en décimal
 */
function dmsToDecimal(degrees: number, minutes: number, seconds: number, ref: string): number {
  let decimal = degrees + minutes / 60 + seconds / 3600;
  if (ref === 'S' || ref === 'W') {
    decimal = -decimal;
  }
  return decimal;
}

/**
 * Extrait les métadonnées EXIF d'une image (date et coordonnées GPS)
 */
export async function extractExifMetadata(file: File): Promise<ExifMetadata> {
  const result: ExifMetadata = {
    date: null,
    latitude: null,
    longitude: null,
  };

  try {
    const arrayBuffer = await file.arrayBuffer();
    const dataView = new DataView(arrayBuffer);

    // Vérifier si c'est un JPEG (commence par 0xFFD8)
    if (dataView.getUint16(0) !== 0xFFD8) {
      return result;
    }

    let offset = 2;
    const length = dataView.byteLength;

    while (offset < length) {
      if (dataView.getUint8(offset) !== 0xFF) {
        return result;
      }

      const marker = dataView.getUint8(offset + 1);

      // APP1 marker (EXIF)
      if (marker === 0xE1) {
        // Vérifier "Exif\0\0"
        const exifHeader = String.fromCharCode(
          dataView.getUint8(offset + 4),
          dataView.getUint8(offset + 5),
          dataView.getUint8(offset + 6),
          dataView.getUint8(offset + 7)
        );

        if (exifHeader === 'Exif') {
          const tiffOffset = offset + 10;

          // Lire l'ordre des bytes (II = little-endian, MM = big-endian)
          const littleEndian = dataView.getUint16(tiffOffset) === 0x4949;

          // Lire l'offset du premier IFD
          const ifd0Offset = dataView.getUint32(tiffOffset + 4, littleEndian);
          const ifdStart = tiffOffset + ifd0Offset;

          // Nombre d'entrées dans IFD0
          const numEntries = dataView.getUint16(ifdStart, littleEndian);

          let exifIfdOffset: number | null = null;
          let gpsIfdOffset: number | null = null;

          // Parcourir IFD0 pour trouver les pointeurs vers ExifIFD et GPSIFD
          for (let i = 0; i < numEntries; i++) {
            const entryOffset = ifdStart + 2 + i * 12;
            const tag = dataView.getUint16(entryOffset, littleEndian);

            if (tag === 0x8769) {
              // ExifIFDPointer
              exifIfdOffset = dataView.getUint32(entryOffset + 8, littleEndian);
            } else if (tag === 0x8825) {
              // GPSInfoIFDPointer
              gpsIfdOffset = dataView.getUint32(entryOffset + 8, littleEndian);
            }
          }

          // Extraire la date depuis ExifIFD
          if (exifIfdOffset !== null) {
            const exifIfdStart = tiffOffset + exifIfdOffset;
            const exifNumEntries = dataView.getUint16(exifIfdStart, littleEndian);

            for (let j = 0; j < exifNumEntries; j++) {
              const exifEntryOffset = exifIfdStart + 2 + j * 12;
              const exifTag = dataView.getUint16(exifEntryOffset, littleEndian);

              // DateTimeOriginal (0x9003) ou DateTimeDigitized (0x9004)
              if (exifTag === 0x9003 || exifTag === 0x9004) {
                const valueOffset = dataView.getUint32(exifEntryOffset + 8, littleEndian);
                const dateOffset = tiffOffset + valueOffset;

                // Lire la date (format: "YYYY:MM:DD HH:MM:SS")
                let dateStr = '';
                for (let k = 0; k < 19; k++) {
                  dateStr += String.fromCharCode(dataView.getUint8(dateOffset + k));
                }

                // Convertir en format YYYY-MM-DD
                const match = dateStr.match(/^(\d{4}):(\d{2}):(\d{2})/);
                if (match) {
                  result.date = `${match[1]}-${match[2]}-${match[3]}`;
                }
                break;
              }
            }
          }

          // Extraire les coordonnées GPS
          if (gpsIfdOffset !== null) {
            const gpsIfdStart = tiffOffset + gpsIfdOffset;
            const gpsNumEntries = dataView.getUint16(gpsIfdStart, littleEndian);

            let latRef = '';
            let lonRef = '';
            let lat: number[] = [];
            let lon: number[] = [];

            for (let j = 0; j < gpsNumEntries; j++) {
              const gpsEntryOffset = gpsIfdStart + 2 + j * 12;
              const gpsTag = dataView.getUint16(gpsEntryOffset, littleEndian);
              const valueOffset = dataView.getUint32(gpsEntryOffset + 8, littleEndian);

              switch (gpsTag) {
                case 0x0001: // GPSLatitudeRef (N/S)
                  latRef = String.fromCharCode(dataView.getUint8(gpsEntryOffset + 8));
                  break;
                case 0x0002: // GPSLatitude
                  {
                    const latOffset = tiffOffset + valueOffset;
                    lat = [
                      parseRational(dataView, latOffset, littleEndian),
                      parseRational(dataView, latOffset + 8, littleEndian),
                      parseRational(dataView, latOffset + 16, littleEndian),
                    ];
                  }
                  break;
                case 0x0003: // GPSLongitudeRef (E/W)
                  lonRef = String.fromCharCode(dataView.getUint8(gpsEntryOffset + 8));
                  break;
                case 0x0004: // GPSLongitude
                  {
                    const lonOffset = tiffOffset + valueOffset;
                    lon = [
                      parseRational(dataView, lonOffset, littleEndian),
                      parseRational(dataView, lonOffset + 8, littleEndian),
                      parseRational(dataView, lonOffset + 16, littleEndian),
                    ];
                  }
                  break;
              }
            }

            // Convertir en coordonnées décimales
            if (lat.length === 3 && latRef) {
              result.latitude = dmsToDecimal(lat[0], lat[1], lat[2], latRef);
            }
            if (lon.length === 3 && lonRef) {
              result.longitude = dmsToDecimal(lon[0], lon[1], lon[2], lonRef);
            }
          }
        }

        return result;
      }

      // Passer au segment suivant
      if (marker === 0xD9 || marker === 0xDA) {
        break;
      }

      const segmentLength = dataView.getUint16(offset + 2);
      offset += 2 + segmentLength;
    }

    return result;
  } catch {
    return result;
  }
}

/**
 * Géocodage inverse : convertit des coordonnées GPS en nom de lieu
 * Utilise l'API Nominatim (OpenStreetMap) - gratuite et sans clé API
 */
export async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&accept-language=fr`,
      {
        headers: {
          'User-Agent': 'Timothy-Montavon-Website/1.0',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Construire un nom de lieu lisible
    const address = data.address;
    if (!address) return null;

    // Priorité : ville > village > commune > county
    const city = address.city || address.town || address.village || address.municipality || address.county;
    const country = address.country;

    if (city && country) {
      return `${city}, ${country}`;
    } else if (city) {
      return city;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Extrait la date de prise de vue depuis les métadonnées EXIF d'une image
 * @deprecated Utiliser extractExifMetadata à la place
 */
export async function extractExifDate(file: File): Promise<string | null> {
  const metadata = await extractExifMetadata(file);
  return metadata.date;
}

/**
 * Vérifie si un fichier est au format HEIC/HEIF
 */
export function isHeicFile(file: File): boolean {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return (
    type === 'image/heic' ||
    type === 'image/heif' ||
    name.endsWith('.heic') ||
    name.endsWith('.heif')
  );
}

/**
 * Convertit un fichier HEIC en JPEG
 */
async function convertHeicToJpeg(file: File): Promise<Blob> {
  // Import dynamique pour éviter les erreurs SSR
  const heic2any = (await import('heic2any')).default;

  const result = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: HEIC_QUALITY,
  });

  // heic2any peut retourner un tableau ou un seul Blob
  if (Array.isArray(result)) {
    return result[0];
  }
  return result;
}

/**
 * Redimensionne une image si elle dépasse les dimensions max
 */
async function resizeImage(
  blob: Blob,
  maxWidth: number = MAX_WIDTH,
  maxHeight: number = MAX_HEIGHT,
  quality: number = JPEG_QUALITY
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Calculer les nouvelles dimensions si nécessaire
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      } else {
        // Pas besoin de redimensionner, mais on peut quand même
        // recompresser si c'est un JPEG pour optimiser
        if (blob.type === 'image/jpeg' && blob.size < 500 * 1024) {
          // Fichier déjà petit, on le garde tel quel
          resolve(blob);
          return;
        }
      }

      // Créer un canvas pour redimensionner
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Impossible de créer le contexte canvas'));
        return;
      }

      // Dessiner l'image redimensionnée
      ctx.drawImage(img, 0, 0, width, height);

      // Convertir en blob
      canvas.toBlob(
        (newBlob) => {
          if (newBlob) {
            resolve(newBlob);
          } else {
            reject(new Error('Erreur lors de la conversion canvas → blob'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Erreur lors du chargement de l\'image'));
    };

    img.src = url;
  });
}

/**
 * Résultat du traitement d'image
 */
export interface ProcessedImage {
  file: File;
  originalSize: number;
  processedSize: number;
  wasConverted: boolean;
  wasResized: boolean;
  exifDate: string | null;
  location: string | null;
}

/**
 * Traite une image : conversion HEIC et/ou redimensionnement
 * Retourne un nouveau File optimisé
 */
export async function processImage(
  file: File,
  onProgress?: (status: string) => void
): Promise<ProcessedImage> {
  const originalSize = file.size;
  let blob: Blob = file;
  let wasConverted = false;
  let wasResized = false;
  let filename = file.name;
  let exifDate: string | null = null;
  let location: string | null = null;

  // 0. Extraire les métadonnées EXIF avant toute transformation
  onProgress?.('Lecture des métadonnées...');
  const exifMetadata = await extractExifMetadata(file);
  exifDate = exifMetadata.date;

  // Géocodage inverse si coordonnées GPS disponibles
  if (exifMetadata.latitude !== null && exifMetadata.longitude !== null) {
    onProgress?.('Détection du lieu...');
    location = await reverseGeocode(exifMetadata.latitude, exifMetadata.longitude);
  }

  // 1. Conversion HEIC → JPEG si nécessaire
  if (isHeicFile(file)) {
    onProgress?.('Conversion HEIC → JPEG...');
    try {
      blob = await convertHeicToJpeg(file);
      wasConverted = true;
      // Changer l'extension du fichier
      filename = filename.replace(/\.(heic|heif)$/i, '.jpg');
    } catch (error) {
      console.error('Erreur conversion HEIC:', error);
      throw new Error('Impossible de convertir le fichier HEIC. Essayez de le convertir manuellement en JPEG.');
    }
  }

  // 2. Redimensionnement si nécessaire
  onProgress?.('Optimisation de l\'image...');
  const originalBlobSize = blob.size;

  try {
    blob = await resizeImage(blob);
    wasResized = blob.size !== originalBlobSize;
  } catch (error) {
    console.error('Erreur redimensionnement:', error);
    // En cas d'erreur, on garde l'image originale
  }

  // 3. Créer le nouveau File
  const processedFile = new File([blob], filename, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  });

  return {
    file: processedFile,
    originalSize,
    processedSize: processedFile.size,
    wasConverted,
    wasResized,
    exifDate,
    location,
  };
}

/**
 * Formate une taille en bytes en string lisible
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
