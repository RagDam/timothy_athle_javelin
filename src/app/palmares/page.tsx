import { type Metadata } from 'next';
import { getResultats, getProgressionData } from '@/lib/content';
import { PalmaresContent } from '@/components/features/palmares/PalmaresContent';
import rawPolyvalenceData from '@/../content/palmares/polyvalence.json';
import type { Discipline } from '@/components/features/palmares';

// Types pour les données polyvalence
interface RecordEntry {
  perf: string;
  date: string;
  lieu: string;
}

interface RecordData {
  name: string;
  type: 'time' | 'distance' | 'points';
  records: Record<string, RecordEntry>;
}

interface ResultatEntry {
  id: string;
  date: string;
  epreuve: string;
  perf: string;
  lieu: string;
  classement: number;
  niveau?: string;
  isRecord?: boolean;
  notes?: string;
}

interface PolyvalenceData {
  disciplines: Discipline[];
  records: Record<string, Record<string, RecordData>>;
  resultats: Record<string, ResultatEntry[]>;
}

export const metadata: Metadata = {
  title: 'Palmarès - Timothy Montavon',
  description:
    'Records personnels et résultats de Timothy Montavon au lancer de javelot et autres disciplines. Double Champion de France Minime 2025.',
};

export default function PalmaresPage() {
  // Charger les données javelot depuis le JSON existant
  const javelinData = getResultats();
  const javelinProgressionData = getProgressionData();

  // Cast des données avec les bons types
  const polyvalenceData = rawPolyvalenceData as unknown as PolyvalenceData;

  return (
    <PalmaresContent
      disciplines={polyvalenceData.disciplines}
      polyvalenceData={polyvalenceData}
      javelinData={javelinData}
      progressionData={javelinProgressionData}
    />
  );
}
