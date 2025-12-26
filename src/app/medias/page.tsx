import { type Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import { AnimatedSection } from '@/components/ui';
import { Button } from '@/components/ui';
import { Instagram, ExternalLink, Camera } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Médias - Timothy Montavon',
  description: 'Photos et vidéos de Timothy Montavon en compétition et à l\'entraînement.',
};

export default function MediasPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* LightWidget Script */}
      <Script
        src="https://cdn.lightwidget.com/widgets/lightwidget.js"
        strategy="lazyOnload"
      />

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

      {/* Section Instagram Feed */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <Instagram className="text-pink-500" size={28} />
                Mon Instagram
              </h2>
              <Button
                href={`https://instagram.com/${siteConfig.social.instagram}`}
                variant="outline"
                external
                size="sm"
              >
                @{siteConfig.social.instagram}
                <ExternalLink size={14} />
              </Button>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={0.1}>
            <div className="rounded-2xl overflow-hidden">
              <iframe
                src={siteConfig.widgets.instagramFeed}
                scrolling="no"
                className="lightwidget-widget w-full border-0 overflow-hidden"
                style={{ minHeight: '400px' }}
              />
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={0.2} className="mt-8 text-center">
            <Button
              href={`https://instagram.com/${siteConfig.social.instagram}`}
              variant="accent"
              external
              size="lg"
            >
              <Instagram size={20} />
              Voir tout sur Instagram
              <ExternalLink size={16} />
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
