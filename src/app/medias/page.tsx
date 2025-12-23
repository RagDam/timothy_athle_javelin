import { type Metadata } from 'next';
import Image from 'next/image';
import { AnimatedSection } from '@/components/ui';
import { Button } from '@/components/ui';
import { Camera, Instagram, ExternalLink } from 'lucide-react';
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
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-slate-900" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Médias
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Photos et vidéos de mes compétitions et entraînements
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="py-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <Instagram className="text-pink-500" size={32} />
              <div>
                <p className="text-white font-medium">Suivez-moi sur Instagram</p>
                <p className="text-slate-400 text-sm">@{siteConfig.social.instagram}</p>
              </div>
            </div>
            <Button
              href={`https://instagram.com/${siteConfig.social.instagram}`}
              variant="accent"
              external
            >
              <Instagram size={18} />
              Suivre
              <ExternalLink size={14} />
            </Button>
          </div>
        </div>
      </section>

      {/* Galerie Photos */}
      <section className="py-16">
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
              <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500">
                <Camera size={48} className="mb-4" />
                <p className="text-center px-4">
                  Plus de photos à venir...
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section Vidéos (placeholder) */}
      <section className="py-16 bg-slate-800/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-white mb-8">Vidéos</h2>
            <div className="bg-slate-800/50 rounded-xl p-12 text-center">
              <p className="text-slate-400 mb-4">
                Les vidéos seront bientôt disponibles.
              </p>
              <p className="text-sm text-slate-500">
                En attendant, retrouvez mes vidéos sur Instagram.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
