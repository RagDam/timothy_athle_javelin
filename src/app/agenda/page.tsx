import { type Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { AgendaContent } from '@/components/features/agenda';
import type { Event } from '@/components/features/agenda';

export const metadata: Metadata = {
  title: 'Agenda - Timothy Montavon',
  description:
    'Calendrier des compétitions et événements de Timothy Montavon pour la saison 2025-2026.',
};

interface EventsData {
  events: Event[];
}

function getEvents(): Event[] {
  const filePath = path.join(process.cwd(), 'content/agenda/events.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data: EventsData = JSON.parse(fileContents);
  return data.events;
}

export default function AgendaPage() {
  const events = getEvents();

  return (
    <main className="min-h-screen bg-slate-900">
      <AgendaContent events={events} />
    </main>
  );
}
