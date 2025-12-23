import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'content');

export interface ContentMeta {
  title?: string;
  subtitle?: string;
  heroImage?: string;
  seo?: {
    description?: string;
    keywords?: string[];
  };
  stats?: Array<{
    label: string;
    value: string;
  }>;
  year?: number;
  season?: string;
  highlight?: boolean;
  lastUpdated?: string;
  [key: string]: unknown;
}

export interface ContentData {
  meta: ContentMeta;
  content: string;
  htmlContent: string;
}

/**
 * Lit un fichier Markdown et retourne les métadonnées et le contenu HTML
 */
export async function getContent(slug: string, folder: string = 'pages'): Promise<ContentData> {
  const fullPath = path.join(contentDirectory, folder, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(content);
  const htmlContent = processedContent.toString();

  return {
    meta: data as ContentMeta,
    content,
    htmlContent,
  };
}

/**
 * Récupère le contenu de la page d'accueil
 */
export async function getHomeContent(): Promise<ContentData> {
  return getContent('accueil', 'pages');
}

/**
 * Récupère le contenu de la page À propos
 */
export async function getAboutContent(): Promise<ContentData> {
  return getContent('a-propos', 'pages');
}

/**
 * Récupère les records personnels
 */
export async function getRecordsContent(): Promise<ContentData> {
  return getContent('records', 'palmares');
}

/**
 * Récupère les résultats d'une année spécifique
 */
export async function getYearResults(year: string): Promise<ContentData> {
  return getContent(year, 'palmares');
}

/**
 * Liste tous les fichiers Markdown d'un dossier
 */
export function getContentSlugs(folder: string): string[] {
  const folderPath = path.join(contentDirectory, folder);

  if (!fs.existsSync(folderPath)) {
    return [];
  }

  const files = fs.readdirSync(folderPath);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace(/\.md$/, ''));
}

/**
 * Récupère toutes les années de palmarès disponibles
 */
export function getPalmaresYears(): string[] {
  const slugs = getContentSlugs('palmares');
  return slugs
    .filter(slug => /^\d{4}$/.test(slug))
    .sort((a, b) => parseInt(b) - parseInt(a));
}

// Types pour les résultats sportifs
export interface ResultatCompetition {
  id: string;
  date: string;
  competition: string;
  lieu: string;
  perf: number;
  engin: string;
  classement: number | null;
  isRecord: boolean;
  notes?: string;
}

export interface RecordPersonnel {
  perf: number;
  date: string;
  lieu: string;
}

export interface TitreMajeur {
  annee: number;
  titre: string;
  lieu: string;
  perf: number;
}

export interface ResultatsData {
  metadata: {
    lastUpdated: string;
    description: string;
  };
  resultats: ResultatCompetition[];
  records: Record<string, RecordPersonnel>;
  titres: TitreMajeur[];
}

/**
 * Récupère tous les résultats de compétitions depuis le JSON
 */
export function getResultats(): ResultatsData {
  const filePath = path.join(contentDirectory, 'palmares', 'resultats.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents) as ResultatsData;
}

/**
 * Récupère les résultats pour le graphique de progression
 */
export function getProgressionData(): Array<{
  date: string;
  perf: number;
  engin: string;
  competition: string;
  lieu: string;
}> {
  const data = getResultats();
  return data.resultats
    .map((r) => ({
      date: r.date,
      perf: r.perf,
      engin: r.engin,
      competition: r.competition,
      lieu: r.lieu,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Récupère les résultats groupés par année
 */
export function getResultatsByYear(): Record<string, ResultatCompetition[]> {
  const data = getResultats();
  const byYear: Record<string, ResultatCompetition[]> = {};

  data.resultats.forEach((r) => {
    const year = r.date.substring(0, 4);
    if (!byYear[year]) {
      byYear[year] = [];
    }
    byYear[year].push(r);
  });

  // Trier chaque année par date décroissante
  Object.keys(byYear).forEach((year) => {
    byYear[year].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  return byYear;
}

// Types pour les partenaires/structures
export interface PartnerItem {
  id: string;
  name: string;
  description: string;
  url: string;
  logo: string;
  facebook?: string;
  instagram?: string;
}

export interface PartnerSection {
  id: string;
  title: string;
  icon: 'users' | 'globe';
  iconColor: 'amber' | 'blue';
  items: PartnerItem[];
}

export interface PartnersData {
  metadata: {
    lastUpdated: string;
    description: string;
  };
  sections: PartnerSection[];
}

/**
 * Récupère les données des partenaires/structures depuis le JSON
 */
export function getPartners(): PartnersData {
  const filePath = path.join(contentDirectory, 'decouvrir', 'partners.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents) as PartnersData;
}
