'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatedSection } from '@/components/ui';
import { Newspaper, ExternalLink, Mic, X } from 'lucide-react';
import { InterviewsSection } from '@/components/features/interviews';
import { type PressArticle, type Interview } from '@/types';
import { cn } from '@/lib/utils';

// Configuration des sources avec leurs logos
const PRESS_SOURCES = [
  { id: 'ouest-france', name: 'Ouest-France', logo: '/images/presse/ouest-france.png', match: 'Ouest-France' },
  { id: 'france-bleu', name: 'France Bleu', logo: '/images/presse/france-bleu.png', match: 'France Bleu' },
  { id: 'maville', name: 'Le Mans Maville', logo: '/images/presse/lemansmaville.png', match: 'Maville' },
  { id: 'alexposure', name: 'Alexposure', logo: '/images/presse/alexposure.png', match: 'Alexposure' },
] as const;

interface PressContentProps {
  articles: PressArticle[];
  interviews: Interview[];
}

export function PressContent({ articles, interviews }: PressContentProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Filtrer les articles selon la source sélectionnée
  const filteredArticles = activeFilter
    ? articles.filter(article => {
        const source = PRESS_SOURCES.find(s => s.id === activeFilter);
        return source && article.source.toLowerCase().includes(source.match.toLowerCase());
      })
    : articles;

  // Filtrer les interviews selon la source sélectionnée
  const filteredInterviews = activeFilter
    ? interviews.filter(interview => {
        const source = PRESS_SOURCES.find(s => s.id === activeFilter);
        return source && interview.media.toLowerCase().includes(source.match.toLowerCase());
      })
    : interviews;

  const handleFilterClick = (sourceId: string) => {
    setActiveFilter(activeFilter === sourceId ? null : sourceId);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 via-slate-800/50 to-slate-900" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm mb-6">
                <Newspaper size={16} />
                <span>Couverture médiatique</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                Presse
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Articles, interviews et passages dans les médias
              </p>
              {/* Logos des médias - cliquables pour filtrer */}
              <div className="flex flex-wrap items-center gap-4">
                {PRESS_SOURCES.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => handleFilterClick(source.id)}
                    className={cn(
                      'relative p-2 rounded-lg transition-all duration-200',
                      activeFilter === source.id
                        ? 'bg-blue-500/20 ring-2 ring-blue-500'
                        : 'hover:bg-slate-800/50'
                    )}
                    title={`Filtrer par ${source.name}`}
                  >
                    <Image
                      src={source.logo}
                      alt={source.name}
                      width={140}
                      height={50}
                      className={cn(
                        'h-10 w-auto transition-opacity duration-200',
                        activeFilter && activeFilter !== source.id
                          ? 'opacity-40'
                          : 'opacity-80 hover:opacity-100'
                      )}
                    />
                  </button>
                ))}
              </div>
              {/* Indicateur de filtre actif - hauteur fixe pour éviter le décalage */}
              <div className="h-8 mt-4">
                {activeFilter && (
                  <button
                    onClick={() => setActiveFilter(null)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/30 transition-colors"
                  >
                    <span>Filtre : {PRESS_SOURCES.find(s => s.id === activeFilter)?.name}</span>
                    <X size={14} />
                  </button>
                )}
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fadeUp" delay={0.2}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20">
                <Image
                  src="/images/hero/presse.jpg"
                  alt="Timothy Montavon - Presse"
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

      {/* Section Articles de Presse */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Newspaper className="text-blue-500" size={28} />
              Revue de presse
              {activeFilter && (
                <span className="text-lg font-normal text-slate-400">
                  ({filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''})
                </span>
              )}
            </h2>
            <p className="text-slate-400 mt-2">
              Articles et mentions dans les médias
            </p>
          </AnimatedSection>

          {filteredArticles.length > 0 ? (
            <div className="space-y-4">
              {filteredArticles.map((article, index) => (
                <AnimatedSection key={article.id} animation="fadeUp" delay={0.1 * Math.min(index, 5)}>
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
                  {activeFilter
                    ? `Aucun article de ${PRESS_SOURCES.find(s => s.id === activeFilter)?.name}`
                    : 'Les articles de presse seront ajoutés prochainement'}
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
              {activeFilter && (
                <span className="text-lg font-normal text-slate-400">
                  ({filteredInterviews.length} interview{filteredInterviews.length > 1 ? 's' : ''})
                </span>
              )}
            </h2>
            <p className="text-slate-400 mt-2">
              Mes passages dans les médias
            </p>
          </AnimatedSection>

          <InterviewsSection interviews={filteredInterviews} />
        </div>
      </section>
    </>
  );
}
