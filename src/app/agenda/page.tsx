import { type Metadata } from 'next';
import { AnimatedSection } from '@/components/ui';
import { Calendar, MapPin, Clock, Trophy } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Agenda - Timothy Montavon',
  description: 'Calendrier des compétitions et événements de Timothy Montavon pour la saison 2025-2026.',
};

interface Event {
  date: string;
  title: string;
  location: string;
  type: 'competition' | 'training' | 'event';
  description?: string;
  isPast?: boolean;
}

const events: Event[] = [
  {
    date: '2025-12-06',
    title: 'Championnats Départementaux',
    location: 'Coulaines',
    type: 'competition',
    description: 'Record personnel 50,70m (700g)',
    isPast: true,
  },
  {
    date: '2025-07-14',
    title: 'Coupe de France des Ligues Minimes',
    location: 'Lens',
    type: 'competition',
    description: 'Champion de France - 49,77m',
    isPast: true,
  },
  {
    date: '2025-06-18',
    title: 'Championnats de France UGSEL',
    location: 'Lens',
    type: 'competition',
    description: 'Champion de France - 50,16m',
    isPast: true,
  },
];

const upcomingEvents: Event[] = [
  // Les prochaines compétitions seront ajoutées ici
];

export default function AgendaPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-600/20 to-slate-900" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Agenda
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Calendrier des compétitions et événements
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Prochaines compétitions */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Calendar className="text-cyan-500" size={28} />
              Prochaines compétitions
            </h2>
          </AnimatedSection>

          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <AnimatedSection key={index} animation="fadeUp" delay={0.1 * index}>
                  <EventCard event={event} />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection>
              <div className="bg-slate-800/50 rounded-xl p-8 text-center">
                <Calendar className="mx-auto text-slate-600 mb-4" size={48} />
                <p className="text-slate-400">
                  Le calendrier 2026 sera bientôt disponible.
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Les compétitions de la prochaine saison seront annoncées prochainement.
                </p>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Compétitions passées */}
      <section className="py-16 bg-slate-800/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Trophy className="text-amber-500" size={28} />
              Compétitions 2025
            </h2>
          </AnimatedSection>

          <div className="space-y-4">
            {events.map((event, index) => (
              <AnimatedSection key={index} animation="fadeUp" delay={0.1 * index}>
                <EventCard event={event} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

interface EventCardProps {
  event: Event;
}

function EventCard({ event }: EventCardProps) {
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={`bg-slate-800/50 rounded-xl p-6 border-l-4 ${
      event.isPast ? 'border-slate-600' : 'border-cyan-500'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <Clock size={14} />
            <span>{formattedDate}</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin size={14} />
            <span>{event.location}</span>
          </div>
          {event.description && (
            <p className="mt-2 text-amber-400 font-medium">{event.description}</p>
          )}
        </div>
        {event.isPast && (
          <div className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-400">
            Terminé
          </div>
        )}
      </div>
    </div>
  );
}
