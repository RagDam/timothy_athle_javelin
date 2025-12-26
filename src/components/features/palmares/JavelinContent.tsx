'use client';

import { AnimatedSection } from '@/components/ui';
import { Trophy, TrendingUp, Calendar, Medal, MapPin, Award, BarChart3 } from 'lucide-react';
import { ProgressionChart } from './ProgressionChart';

interface JavelinContentProps {
  data: {
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

export function JavelinContent({ data, progressionData }: JavelinContentProps) {
  // Calculer les stats
  const currentRecord = data.records['700g'];
  const totalCompetitions = data.resultats.length;
  const progression2024to2025 = (data.records['700g'].perf - 38.24).toFixed(2);

  // Grouper les résultats par année
  const getResultsByYear = () => {
    const byYear: { [year: string]: typeof data.resultats } = {};
    data.resultats.forEach((r) => {
      const year = r.date.substring(0, 4);
      if (!byYear[year]) byYear[year] = [];
      byYear[year].push(r);
    });
    // Trier par date décroissante dans chaque année
    Object.values(byYear).forEach((arr) => {
      arr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
    return byYear;
  };

  const resultsByYear = getResultsByYear();
  const years = Object.keys(resultsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <>
      {/* Stats rapides */}
      <section className="py-12 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AnimatedSection animation="fadeUp" delay={0.1}>
              <QuickStat
                icon={<Medal className="text-amber-500" size={24} />}
                value={`${currentRecord.perf}m`}
                label="Record personnel"
                sublabel="Javelot 700g"
              />
            </AnimatedSection>
            <AnimatedSection animation="fadeUp" delay={0.2}>
              <QuickStat
                icon={<Trophy className="text-amber-500" size={24} />}
                value={String(data.titres.length)}
                label="Titres France"
                sublabel="Minime 2025"
              />
            </AnimatedSection>
            <AnimatedSection animation="fadeUp" delay={0.3}>
              <QuickStat
                icon={<TrendingUp className="text-green-500" size={24} />}
                value={`+${progression2024to2025}m`}
                label="Progression"
                sublabel="vs 2024"
              />
            </AnimatedSection>
            <AnimatedSection animation="fadeUp" delay={0.4}>
              <QuickStat
                icon={<Calendar className="text-blue-500" size={24} />}
                value={String(totalCompetitions)}
                label="Compétitions"
                sublabel="Enregistrées"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Titres majeurs */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Trophy className="text-amber-500" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white">Titres majeurs</h2>
            </div>
          </AnimatedSection>

          <div className="space-y-4">
            {data.titres.map((titre, index) => (
              <AnimatedSection key={index} animation="fadeUp" delay={0.1 * index}>
                <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">🥇</div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-amber-400 font-bold">{titre.annee}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{titre.titre}</h3>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1 text-slate-400">
                          <MapPin size={14} />
                          {titre.lieu}
                        </span>
                        <span className="text-amber-400 font-semibold">{titre.perf} m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Records personnels */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Medal className="text-blue-500" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white">Records personnels</h2>
            </div>
          </AnimatedSection>

          <div className="space-y-4">
            {Object.entries(data.records).map(([engin, record], index) => (
              <AnimatedSection key={engin} animation="fadeUp" delay={0.1 * index}>
                <RecordCard
                  engin={`Javelot ${engin}`}
                  perf={`${record.perf} m`}
                  date={new Date(record.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  lieu={record.lieu}
                  highlight={engin === '700g'}
                />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Graphique de progression */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="text-green-500" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white">Courbe de progression</h2>
            </div>
            <p className="text-slate-400">
              Évolution de mes performances en compétition
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp">
            <div className="bg-slate-800/50 rounded-2xl p-6">
              <ProgressionChart data={progressionData} objectif={60} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Résultats par année */}
      {years.map((year, yearIndex) => {
        const yearResults = resultsByYear[year];
        const isCurrentYear = year === '2025';

        return (
          <section
            key={year}
            className={`py-20 ${yearIndex % 2 === 0 ? 'bg-slate-800/30' : ''}`}
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <AnimatedSection className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isCurrentYear ? 'bg-amber-500/20' : 'bg-slate-700'
                    }`}
                  >
                    <Calendar
                      className={isCurrentYear ? 'text-amber-500' : 'text-slate-400'}
                      size={24}
                    />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Saison {year}</h2>
                  {isCurrentYear && (
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
                      En cours
                    </span>
                  )}
                </div>
              </AnimatedSection>

              <div className="space-y-1">
                {yearResults.map((result) => (
                  <ResultCard key={result.id} result={result} />
                ))}
              </div>

              {/* Points forts 2025 */}
              {isCurrentYear && (
                <AnimatedSection animation="fadeUp" delay={0.4}>
                  <div className="mt-8 bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                      <Award size={20} />
                      Points forts de la saison
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-slate-300">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>
                          <strong className="text-white">Double Champion de France Minime</strong>{' '}
                          (UGSEL + Coupe de France des Ligues)
                        </span>
                      </li>
                      <li className="flex items-start gap-2 text-slate-300">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>Passage à la nouvelle norme javelot 700g</span>
                      </li>
                      <li className="flex items-start gap-2 text-slate-300">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>
                          Record personnel à <strong className="text-white">50,70 m</strong>
                        </span>
                      </li>
                      <li className="flex items-start gap-2 text-slate-300">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>
                          Progression de <strong className="text-green-400">+{progression2024to2025} m</strong>{' '}
                          par rapport à 2024
                        </span>
                      </li>
                    </ul>
                  </div>
                </AnimatedSection>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}

// Composants

interface QuickStatProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel: string;
}

function QuickStat({ icon, value, label, sublabel }: QuickStatProps) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-6 text-center h-full flex flex-col">
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-300">{label}</div>
      <div className="text-xs text-slate-500">{sublabel}</div>
    </div>
  );
}

interface RecordCardProps {
  engin: string;
  perf: string;
  date: string;
  lieu: string;
  highlight: boolean;
}

function RecordCard({ engin, perf, date, lieu, highlight }: RecordCardProps) {
  return (
    <div
      className={`rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        highlight
          ? 'bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/30'
          : 'bg-slate-800/50'
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            highlight ? 'bg-blue-500/20' : 'bg-slate-700'
          }`}
        >
          <Medal className={highlight ? 'text-blue-400' : 'text-slate-400'} size={20} />
        </div>
        <div>
          <div className="font-bold text-white">{engin}</div>
          <div className="text-sm text-slate-400">
            {date} • {lieu}
          </div>
        </div>
      </div>
      <div className={`text-2xl font-bold ${highlight ? 'text-blue-400' : 'text-white'}`}>
        {perf}
      </div>
    </div>
  );
}

interface ResultCardProps {
  result: {
    date: string;
    competition: string;
    lieu: string;
    perf: number;
    engin: string;
    classement: number | null;
    isRecord: boolean;
    notes?: string;
  };
}

function ResultCard({ result }: ResultCardProps) {
  const formattedDate = new Date(result.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });

  // Vérifier si HC est dans les notes
  const isHC = result.notes?.includes('HC');

  // Texte du classement
  let classementText = '-';
  if (result.classement === 1) {
    classementText = '1er';
  } else if (result.classement) {
    classementText = `${result.classement}e`;
  } else if (isHC) {
    classementText = 'HC';
  }

  // Ajouter RP avec le poids si c'est un record personnel
  const recordBadge = result.isRecord ? `RP ${result.engin}` : null;

  const isHighlight = result.classement === 1;

  return (
    <div
      className={`rounded-lg px-3 py-2 ${
        isHighlight ? 'bg-slate-800/70 border-l-2 border-amber-500' : 'bg-slate-800/30'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs text-slate-500 w-14 flex-shrink-0">{formattedDate}</span>
          <span className="text-slate-400 text-sm truncate">{result.lieu}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {recordBadge && (
            <span className="text-xs font-medium text-blue-400 bg-blue-500/20 px-1.5 py-0.5 rounded">
              {recordBadge}
            </span>
          )}
          <span className={`font-bold ${isHighlight ? 'text-amber-400' : 'text-white'}`}>
            {result.perf} m
          </span>
          <span
            className={`text-xs font-medium w-8 text-right ${
              result.classement === 1 ? 'text-green-400' : 'text-slate-500'
            }`}
          >
            {classementText}
          </span>
        </div>
      </div>
    </div>
  );
}
