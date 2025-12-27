'use client';

import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Event } from './EventCard';

const MONTHS_FR = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

const DAYS_SHORT = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

interface MiniCalendarProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  selectedDate: Date | null;
  onDateSelect: (date: Date, events: Event[]) => void;
  eventsByDate: Map<string, Event[]>;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

function getCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = (firstDay.getDay() + 6) % 7;

  const days: CalendarDay[] = [];

  for (let i = 0; i < startDayOfWeek; i++) {
    const prevDate = new Date(year, month, -startDayOfWeek + i + 1);
    days.push({ date: prevDate, isCurrentMonth: false });
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push({ date: new Date(year, month, day), isCurrentMonth: true });
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
  }

  return days;
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const IMPORTANCE_COLORS: Record<Event['importance'], string> = {
  major: 'bg-amber-500',
  national: 'bg-cyan-500',
  regional: 'bg-slate-400',
};

export function MiniCalendar({
  currentMonth,
  onMonthChange,
  selectedDate,
  onDateSelect,
  eventsByDate,
}: MiniCalendarProps) {
  const calendarDays = useMemo(() => {
    return getCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth());
  }, [currentMonth]);

  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const selectedDateKey = selectedDate ? formatDateKey(selectedDate) : null;

  const goToPreviousMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="w-8 h-8 rounded-full hover:bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          aria-label="Mois précédent"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-base font-semibold text-white">
          {MONTHS_FR[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button
          type="button"
          onClick={goToNextMonth}
          className="w-8 h-8 rounded-full hover:bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          aria-label="Mois suivant"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Days header */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS_SHORT.map((day, i) => (
          <div
            key={`${day}-${i}`}
            className="aspect-square flex items-center justify-center text-xs font-medium text-slate-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentMonth.getMonth()}-${currentMonth.getFullYear()}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="grid grid-cols-7 gap-1"
        >
          {calendarDays.map((day, index) => {
            const dateKey = formatDateKey(day.date);
            const dayEvents = eventsByDate.get(dateKey) || [];
            const hasEvents = dayEvents.length > 0;
            const isToday = day.date.getTime() === today.getTime();
            const isSelected = dateKey === selectedDateKey;

            const eventColor = hasEvents
              ? dayEvents.reduce((best, e) => {
                  const priority = { major: 3, national: 2, regional: 1 };
                  return priority[e.importance] > priority[best.importance] ? e : best;
                }, dayEvents[0]).importance
              : null;

            return (
              <button
                key={`${dateKey}-${index}`}
                type="button"
                onClick={() => hasEvents && onDateSelect(day.date, dayEvents)}
                disabled={!hasEvents}
                className={cn(
                  'aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-all relative',
                  !day.isCurrentMonth && 'text-slate-600',
                  day.isCurrentMonth && !isToday && !isSelected && 'text-slate-300',
                  isToday && !isSelected && 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/50',
                  isSelected && 'bg-cyan-500 text-white',
                  hasEvents && !isSelected && 'hover:bg-slate-700/50 cursor-pointer',
                  !hasEvents && 'cursor-default'
                )}
              >
                <span>{day.date.getDate()}</span>
                {hasEvents && !isSelected && eventColor && (
                  <span
                    className={cn(
                      'absolute bottom-1 w-1.5 h-1.5 rounded-full',
                      IMPORTANCE_COLORS[eventColor]
                    )}
                  />
                )}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-slate-700/50">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-xs text-slate-400">Champ.</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-500" />
          <span className="text-xs text-slate-400">National</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span className="text-xs text-slate-400">Régional</span>
        </div>
      </div>
    </div>
  );
}
