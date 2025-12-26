'use client';

import { AnimatedSection } from '@/components/ui';
import { AudioPlayer } from '../AudioPlayer';
import { Mic, Play, Newspaper, ExternalLink } from 'lucide-react';
import { type Interview } from '@/types';

interface InterviewsSectionProps {
  interviews: Interview[];
}

export function InterviewsSection({ interviews }: InterviewsSectionProps) {
  if (interviews.length === 0) {
    return (
      <AnimatedSection>
        <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/50">
          <Mic className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">
            Les interviews seront ajoutées prochainement
          </p>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <div className="space-y-4">
      {interviews.map((interview, index) => (
        <AnimatedSection key={interview.id} animation="fadeUp" delay={0.1 * index}>
          {interview.type === 'audio' ? (
            <AudioPlayer
              src={interview.url}
              title={interview.title}
              media={interview.media}
              date={interview.date}
              sourceUrl={interview.sourceUrl}
            />
          ) : (
            <a
              href={interview.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 hover:bg-slate-800 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  {interview.type === 'video' && <Play className="w-5 h-5 text-purple-400" />}
                  {interview.type === 'article' && <Newspaper className="w-5 h-5 text-purple-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-purple-400 font-medium">{interview.media}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(interview.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <ExternalLink className="text-slate-500 group-hover:text-purple-400 transition-colors" size={18} />
              </div>
              <h3 className="text-white font-medium group-hover:text-purple-400 transition-colors">
                {interview.title}
              </h3>
            </a>
          )}
        </AnimatedSection>
      ))}
    </div>
  );
}
