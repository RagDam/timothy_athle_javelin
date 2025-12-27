'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, Trophy } from 'lucide-react';
import { AnimatedSection } from '@/components/ui';
import { MiniCalendar } from './MiniCalendar';
import { EventCard } from './EventCard';
import type { Event } from './EventCard';

interface AgendaContentProps {
  events: Event[];
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isEventPast(event: Event): boolean {
  const eventDate = event.endDate || event.date;
  return new Date(eventDate) < new Date();
}

export function AgendaContent({ events }: AgendaContentProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);

  const eventRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const eventsByDate = useMemo(() => {
    const map = new Map<string, Event[]>();
    events.forEach((event) => {
      const startKey = event.date.split('T')[0];
      const existing = map.get(startKey) || [];
      map.set(startKey, [...existing, event]);

      if (event.endDate) {
        const start = new Date(event.date);
        const end = new Date(event.endDate);
        const current = new Date(start);
        current.setDate(current.getDate() + 1);

        while (current <= end) {
          const key = formatDateKey(current);
          const dayEvents = map.get(key) || [];
          if (!dayEvents.find((e) => e.id === event.id)) {
            map.set(key, [...dayEvents, event]);
          }
          current.setDate(current.getDate() + 1);
        }
      }
    });
    return map;
  }, [events]);

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const upcoming = events
      .filter((e) => !isEventPast(e))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const past = events
      .filter((e) => isEventPast(e))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  // Stats du mois affiché
  const monthStats = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const now = new Date();

    let pastThisMonth = 0;
    let upcomingThisMonth = 0;

    events.forEach((event) => {
      const eventDate = new Date(event.date);
      if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
        const eventEndDate = event.endDate ? new Date(event.endDate) : eventDate;
        if (eventEndDate < now) {
          pastThisMonth++;
        } else {
          upcomingThisMonth++;
        }
      }
    });

    return { pastThisMonth, upcomingThisMonth };
  }, [events, currentMonth]);

  const handleDateSelect = (date: Date, dayEvents: Event[]) => {
    if (dayEvents.length === 0) return;

    setSelectedDate(date);
    const firstEvent = dayEvents[0];
    setHighlightedEventId(firstEvent.id);

    setTimeout(() => {
      const eventRef = eventRefs.current.get(firstEvent.id);
      if (eventRef) {
        eventRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);

    setTimeout(() => {
      setHighlightedEventId(null);
    }, 3000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedDate(null);
        setHighlightedEventId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-600/20 to-slate-900" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-end">
            {/* Left: Text + Calendar */}
            <div className="flex flex-col">
              <AnimatedSection>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm mb-4">
                  <Calendar size={16} />
                  <span>Saison 2025-2026</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
                  Agenda
                </h1>
                <p className="text-lg text-slate-300 mb-6">
                  Calendrier des compétitions et événements
                </p>
              </AnimatedSection>

              {/* Stats du mois - hauteur fixe pour éviter les décalages */}
              <div className="h-9 mb-4 flex gap-3">
                {monthStats.upcomingThisMonth > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-400 text-sm">
                    <span className="font-semibold">{monthStats.upcomingThisMonth}</span>
                    <span>à venir</span>
                  </div>
                )}
                {monthStats.pastThisMonth > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-700/50 text-slate-400 text-sm">
                    <span className="font-semibold">{monthStats.pastThisMonth}</span>
                    <span>passé{monthStats.pastThisMonth > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              {/* Calendar - Full width, aligned bottom with image */}
              <AnimatedSection animation="fadeUp" delay={0.2}>
                <MiniCalendar
                  currentMonth={currentMonth}
                  onMonthChange={setCurrentMonth}
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  eventsByDate={eventsByDate}
                />
              </AnimatedSection>
            </div>

            {/* Right: Image */}
            <AnimatedSection animation="fadeUp" delay={0.3}>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/hero/agenda.jpg"
                  alt="Timothy Montavon devant le Los Angeles Memorial Coliseum"
                  fill
                  className="object-cover object-top"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Calendar className="text-cyan-500" size={24} />
                Prochaines compétitions
              </h2>
              {selectedDate && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate(null);
                    setHighlightedEventId(null);
                  }}
                  className="px-3 py-1.5 rounded-full bg-slate-700 text-slate-300 text-sm hover:bg-slate-600 transition-colors"
                >
                  Voir tout
                </button>
              )}
            </div>
          </AnimatedSection>

          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <AnimatedSection key={event.id} animation="fadeUp" delay={0.05 * index}>
                  <EventCard
                    ref={(el) => {
                      if (el) eventRefs.current.set(event.id, el);
                    }}
                    event={event}
                    isPast={false}
                    isHighlighted={highlightedEventId === event.id}
                  />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection>
              <div className="bg-slate-800/50 rounded-xl p-6 text-center">
                <Calendar className="mx-auto text-slate-600 mb-3" size={40} />
                <p className="text-slate-400">Aucune compétition à venir pour le moment.</p>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="py-10 bg-slate-800/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Trophy className="text-amber-500" size={24} />
                Compétitions passées
              </h2>
            </AnimatedSection>

            <div className="space-y-3">
              {pastEvents.map((event, index) => (
                <AnimatedSection key={event.id} animation="fadeUp" delay={0.05 * index}>
                  <EventCard
                    ref={(el) => {
                      if (el) eventRefs.current.set(event.id, el);
                    }}
                    event={event}
                    isPast={true}
                    isHighlighted={highlightedEventId === event.id}
                  />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
