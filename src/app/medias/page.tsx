import { type Metadata } from 'next';
import Image from 'next/image';
import { AnimatedSection } from '@/components/ui';
import { Button } from '@/components/ui';
import { Instagram, ExternalLink, Camera } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Médias - Timothy Montavon',
  description: 'Photos et vidéos de Timothy Montavon en compétition et à l\'entraînement.',
};

const photos = [
  {
    src: '/images/hero/timothy-lancer.jpg',
    alt: 'Timothy Montavon - Lancer de javelot',
    caption: 'En pleine action',
  },
  {
    src: '/images/hero/timothy-lancer2.jpg',
    alt: 'Timothy Montavon - Portrait',
    caption: 'Portrait sportif',
  },
];

export default function MediasPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-600/20 via-purple-600/10 to-slate-900" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-400 text-sm mb-6">
                <Camera size={16} />
                <span>Photos, Vidéos & Presse</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                Médias
              </h1>
              <p className="text-xl text-slate-300">
                Photos et vidéos de mes compétitions et entraînements
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fadeUp" delay={0.2}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-pink-500/20">
                <Image
                  src="/images/hero/media.jpg"
                  alt="Timothy Montavon - Médias"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section Instagram - Lien vers profil */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-2xl p-8 sm:p-12 text-center border border-pink-500/20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-6">
                <Instagram className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Suivez-moi sur Instagram
              </h2>
              <p className="text-slate-300 mb-2">
                @{siteConfig.social.instagram}
              </p>
              <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
                Retrouvez toutes mes vidéos, reels et moments forts de compétitions directement sur mon profil Instagram
              </p>
              <Button
                href={`https://instagram.com/${siteConfig.social.instagram}`}
                variant="accent"
                external
                size="lg"
              >
                <Instagram size={20} />
                Voir mon profil Instagram
                <ExternalLink size={16} />
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Galerie Photos */}
      <section className="py-16 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Camera className="text-purple-500" size={28} />
              Galerie photos
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <AnimatedSection key={index} animation="fadeUp" delay={0.1 * index}>
                <div className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-800">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-medium">{photo.caption}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}

            {/* Placeholder pour plus de photos */}
            <AnimatedSection animation="fadeUp" delay={0.3}>
              <a
                href={`https://instagram.com/${siteConfig.social.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-[4/3] rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 hover:border-pink-500/50 hover:text-pink-400 transition-colors"
              >
                <Instagram size={48} className="mb-4" />
                <p className="text-center px-4">
                  Plus sur Instagram
                </p>
              </a>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </main>
  );
}
