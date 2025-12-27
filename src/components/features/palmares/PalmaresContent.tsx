'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatedSection } from '@/components/ui';
import { Trophy, ExternalLink } from 'lucide-react';
import { DisciplineSelector, type Discipline } from './DisciplineSelector';
import { DisciplineContent } from './DisciplineContent';
import { JavelinContent } from './JavelinContent';

interface PalmaresContentProps {
  disciplines: Discipline[];
  polyvalenceData: {
    records: Record<string, Record<string, {
      name: string;
      type: 'time' | 'distance' | 'points';
      records: Record<string, { perf: string; date: string; lieu: string }>;
    }>>;
    resultats: Record<string, Array<{
      id: string;
      date: string;
      epreuve: string;
      perf: string;
      lieu: string;
      classement: number;
      niveau?: string;
      isRecord?: boolean;
      notes?: string;
    }>>;
  };
  javelinData: {
    records: Record<string, { perf: number; date: string; lieu: string }>;
    titres: Array<{ annee: number; titre: string; lieu: string; perf: number }>;
    resultats: Array<{
      id: string;
      date: string;
      competition: string;
      lieu: string;
      perf: number;
      engin: string;
      classement: number | null;
      isRecord: boolean;
      notes?: string;
    }>;
  };
  progressionData: Array<{
    date: string;
    perf: number;
    engin: string;
    competition: string;
    lieu: string;
  }>;
}

export function PalmaresContent({
  disciplines,
  polyvalenceData,
  javelinData,
  progressionData,
}: PalmaresContentProps) {
  const [selectedDiscipline, setSelectedDiscipline] = useState('javelot');

  const currentDiscipline = disciplines.find((d) => d.id === selectedDiscipline) || disciplines[0];

  // Obtenir le sous-titre selon la discipline
  const getSubtitle = () => {
    if (selectedDiscipline === 'javelot') {
      return 'Mes records et résultats au lancer de javelot';
    }
    if (selectedDiscipline === 'combines') {
      return 'Épreuves combinées : Triathlon, Pentathlon, Heptathlon, Octathlon';
    }
    return `Mes records et résultats en ${currentDiscipline.name.toLowerCase()}`;
  };

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-600/20 to-slate-900" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm mb-6">
                <Trophy size={16} />
                <span>Double Champion de France 2025</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                Palmarès
              </h1>
              <p className="text-xl text-slate-300 mb-6">
                {getSubtitle()}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://www.athle.fr/athletes/2035277/resultats"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium"
                >
                  <span>Ma fiche officielle FFA</span>
                  <ExternalLink size={14} />
                </a>
                <a
                  href="https://www.athle.fr/bases/liste.aspx?frmpostback=true&frmbase=bilans&frmmode=1&frmespace=0&frmannee=2026&frmepreuve=672&frmsexe=M&frmcategorie=CA&frmdepartement=&frmligue=&frmnationalite=&frmvent=VR&frmamaxi="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                >
                  <span>Bilan FFA Javelot U18 France 2025/26</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fadeUp" delay={0.2}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/20">
                <Image
                  src="/images/competitions/champion-france-2025.jpg"
                  alt="Timothy Montavon - Champion de France 2025"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold">Champion de France UGSEL 2025</p>
                  <p className="text-slate-300 text-sm">Lens - 50.16m</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Sélecteur de discipline */}
      <section className="py-6 border-b border-slate-800 sticky top-16 md:top-20 z-40 bg-slate-900/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <DisciplineSelector
            disciplines={disciplines}
            selected={selectedDiscipline}
            onSelect={setSelectedDiscipline}
          />
        </div>
      </section>

      {/* Contenu selon la discipline */}
      {selectedDiscipline === 'javelot' ? (
        <JavelinContent
          data={javelinData}
          progressionData={progressionData}
        />
      ) : (
        <DisciplineContent
          disciplineId={selectedDiscipline}
          disciplineName={currentDiscipline.name}
          color={currentDiscipline.color}
          records={polyvalenceData.records[selectedDiscipline] || {}}
          resultats={polyvalenceData.resultats[selectedDiscipline] || []}
        />
      )}
    </main>
  );
}
