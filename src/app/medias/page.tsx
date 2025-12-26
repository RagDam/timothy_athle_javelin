import { type Metadata } from 'next';
import Image from 'next/image';
import { AnimatedSection } from '@/components/ui';
import { Button } from '@/components/ui';
import { Instagram, ExternalLink, Camera, Newspaper, Mic, ImageIcon } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { InterviewsSection } from '@/components/features/interviews';
import { type PressArticle, type Interview } from '@/types';
import presseData from '@/../content/medias/presse.json';

export const metadata: Metadata = {
  title: 'Médias - Timothy Montavon',
  description: 'Photos et vidéos de Timothy Montavon en compétition et à l\'entraînement.',
};

// Photos - à compléter avec tes vraies photos
const photos = [
  {
    src: '/images/hero/timothy-lancer.jpg',
    alt: 'Timothy Montavon - Lancer de javelot',
    caption: 'En pleine action',
  },
  {
    src: '/images/hero/timothy-lancer2.jpg',
    alt: 'Timothy Montavon - Technique',
    caption: 'Phase de lancer',
  },
];

// Données chargées depuis content/medias/presse.json (triées par date décroissante)
const pressArticles = ([...presseData.articles] as PressArticle[]).sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);
const interviews = ([...presseData.interviews] as Interview[]).sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

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
                Photos, vidéos, articles de presse et interviews
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

          {/* Galerie photos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
          </div>

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

      {/* Section Presse */}
      <section className="py-16 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Newspaper className="text-blue-500" size={28} />
              Revue de presse
            </h2>
            <p className="text-slate-400 mt-2">
              Articles et mentions dans les médias
            </p>
          </AnimatedSection>

          {pressArticles.length > 0 ? (
            <div className="space-y-4">
              {pressArticles.map((article, index) => (
                <AnimatedSection key={article.id} animation="fadeUp" delay={0.1 * index}>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2 text-sm text-slate-400 mb-2">
                          <span className="text-blue-400 font-medium">{article.source}</span>
                          <span>•</span>
                          <span>{new Date(article.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}</span>
                          {article.tag && (
                            <>
                              <span>•</span>
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
                                {article.tag}
                              </span>
                            </>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                            {article.excerpt}
                          </p>
                        )}
                      </div>
                      <ExternalLink className="text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0" size={20} />
                    </div>
                  </a>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection>
              <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <Newspaper className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">
                  Les articles de presse seront ajoutés prochainement
                </p>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Section Interviews */}
      <section className="py-16 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Mic className="text-purple-500" size={28} />
              Interviews
            </h2>
            <p className="text-slate-400 mt-2">
              Mes passages dans les médias
            </p>
          </AnimatedSection>

          <InterviewsSection interviews={interviews} />
        </div>
      </section>
    </main>
  );
}
