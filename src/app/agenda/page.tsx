import { type Metadata } from 'next';
import Image from 'next/image';
import { AnimatedSection } from '@/components/ui';
import { Calendar, MapPin, Clock, Trophy, ExternalLink } from 'lucide-react';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Agenda - Timothy Montavon',
  description: 'Calendrier des compétitions et événements de Timothy Montavon pour la saison 2025-2026.',
};

interface EventLocation {
  venue: string;
  city: string;
  country: string;
}

interface EventLinks {
  event: string | null;
  results: string | null;
}

interface Event {
  id: string;
  title: string;
  date: string;
  endDate: string | null;
  time: string | null;
  location: EventLocation;
  type: string;
  category: string;
  discipline: string;
  importance: 'regional' | 'national' | 'major';
  image: string;
  description: string;
  status: string;
  links: EventLinks;
}

interface EventsData {
  events: Event[];
}

function getEvents(): Event[] {
  const filePath = path.join(process.cwd(), 'content/agenda/events.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data: EventsData = JSON.parse(fileContents);
  return data.events;
}

function isEventPast(event: Event): boolean {
  const eventDate = event.endDate || event.date;
  return new Date(eventDate) < new Date();
}

const importanceLabels: Record<string, { label: string; color: string }> = {
  regional: { label: 'Régional', color: 'bg-slate-600 text-slate-200' },
  national: { label: 'National', color: 'bg-cyan-600 text-white' },
  major: { label: 'Championnat de France', color: 'bg-amber-500 text-black' },
};

export default function AgendaPage() {
  const allEvents = getEvents();
  const upcomingEvents = allEvents.filter(e => !isEventPast(e)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastEvents = allEvents.filter(e => isEventPast(e)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-20 bg-slate-900 overflow-hidden">
        <div className="relative h-[60vh] md:h-[70vh]">
          <Image
            src="/images/hero/agenda.jpg"
            alt="Timothy Montavon devant le Los Angeles Memorial Coliseum"
            fill
            className="object-contain object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 via-70% to-slate-900" />
          <div className="absolute bottom-8 md:bottom-12 left-0 right-0 z-10 text-center">
            <AnimatedSection>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                Agenda
              </h1>
              <p className="text-lg md:text-xl text-slate-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Calendrier des compétitions et événements
              </p>
            </AnimatedSection>
          </div>
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
                <AnimatedSection key={event.id} animation="fadeUp" delay={0.1 * index}>
                  <EventCard event={event} isPast={false} />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection>
              <div className="bg-slate-800/50 rounded-xl p-8 text-center">
                <Calendar className="mx-auto text-slate-600 mb-4" size={48} />
                <p className="text-slate-400">
                  Aucune compétition à venir pour le moment.
                </p>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Compétitions passées */}
      {pastEvents.length > 0 && (
        <section className="py-16 bg-slate-800/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="mb-12">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <Trophy className="text-amber-500" size={28} />
                Compétitions passées
              </h2>
            </AnimatedSection>

            <div className="space-y-4">
              {pastEvents.map((event, index) => (
                <AnimatedSection key={event.id} animation="fadeUp" delay={0.1 * index}>
                  <EventCard event={event} isPast={true} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

interface EventCardProps {
  event: Event;
  isPast: boolean;
}

function EventCard({ event, isPast }: EventCardProps) {
  const startDate = new Date(event.date);
  const formattedStartDate = startDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  let dateDisplay = formattedStartDate;
  if (event.endDate) {
    const endDate = new Date(event.endDate);
    const formattedEndDate = endDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    dateDisplay = `Du ${formattedStartDate} au ${formattedEndDate}`;
  }

  const importance = importanceLabels[event.importance] || importanceLabels.regional;

  return (
    <div className={`bg-slate-800/50 rounded-xl overflow-hidden border-l-4 ${
      isPast ? 'border-slate-600' : event.importance === 'major' ? 'border-amber-500' : 'border-cyan-500'
    }`}>
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-24 sm:h-auto h-20 relative bg-slate-700 flex items-center justify-center p-4">
          <Image
            src={event.image}
            alt={event.title}
            width={64}
            height={64}
            className="object-contain"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Badge importance */}
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${importance.color}`}>
              {importance.label}
            </span>
            {/* Badge catégorie */}
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
              {event.category} - {event.discipline}
            </span>
            {isPast && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-slate-700 text-slate-400">
                Terminé
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{dateDisplay}</span>
              {event.time && <span className="text-cyan-400">• {event.time}</span>}
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{event.location.venue}, {event.location.city}</span>
            </div>
          </div>

          {event.description && (
            <p className="mt-2 text-slate-300 text-sm">{event.description}</p>
          )}

          {event.links.event && (
            <a
              href={event.links.event}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Voir l&apos;événement <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
