import { type Metadata } from 'next';
import Image from 'next/image';
import { AnimatedSection } from '@/components/ui';
import { Button } from '@/components/ui';
import { Instagram, ExternalLink, Camera, Image as ImageIcon } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { UploadedMediaGallery } from '@/components/features/UploadedMediaGallery';

export const metadata: Metadata = {
  title: 'Médias - Timothy Montavon',
  description: 'Photos et vidéos de Timothy Montavon en compétition et à l\'entraînement.',
};

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
                <span>Photos & Vidéos</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                Médias
              </h1>
              <p className="text-xl text-slate-300">
                Photos et vidéos en compétition et à l&apos;entraînement
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

      {/* Section Photos & Vidéos */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <ImageIcon className="text-pink-500" size={28} />
              Photos & Vidéos
            </h2>
            <p className="text-slate-400 mt-2">
              Mes moments forts en compétition et à l&apos;entraînement
            </p>
          </AnimatedSection>

          {/* Galerie des médias uploadés */}
          <UploadedMediaGallery />

          {/* CTA Instagram */}
          <AnimatedSection>
            <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-2xl p-8 text-center border border-pink-500/20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
                <Instagram className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Plus de photos et vidéos sur Instagram
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                @{siteConfig.social.instagram}
              </p>
              <Button
                href={`https://instagram.com/${siteConfig.social.instagram}`}
                variant="accent"
                external
              >
                <Instagram size={18} />
                Voir mon profil
                <ExternalLink size={14} />
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
