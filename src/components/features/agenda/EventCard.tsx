'use client';

import Image from 'next/image';
import { Clock, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export interface EventLocation {
  venue: string;
  city: string;
  country: string;
}

export interface EventLinks {
  event: string | null;
  results: string | null;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  endDate: string | null;
  time: string | null;
  location: EventLocation;
  type: string;
  category: string;
  discipline: string;
  importance: 'local' | 'regional' | 'national' | 'major';
  image: string;
  description: string;
  status: string;
  links: EventLinks;
}

const importanceLabels: Record<string, { label: string; color: string }> = {
  local: { label: 'Départemental', color: 'bg-slate-700 text-slate-300' },
  regional: { label: 'Régional', color: 'bg-slate-600 text-slate-200' },
  national: { label: 'National', color: 'bg-cyan-600 text-white' },
  major: { label: 'Championnat de France', color: 'bg-amber-500 text-black' },
};

interface EventCardProps {
  event: Event;
  isPast: boolean;
  isHighlighted?: boolean;
}

export const EventCard = forwardRef<HTMLDivElement, EventCardProps>(
  function EventCard({ event, isPast, isHighlighted = false }, ref) {
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
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'bg-slate-800/50 rounded-xl overflow-hidden border-l-4 transition-all duration-300',
          isPast
            ? 'border-slate-600'
            : event.importance === 'major'
              ? 'border-amber-500'
              : 'border-cyan-500',
          isHighlighted && 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900'
        )}
      >
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
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${importance.color}`}
              >
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
                <span>
                  {event.location.venue}, {event.location.city}
                </span>
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
      </motion.div>
    );
  }
);
