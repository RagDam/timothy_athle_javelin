'use client';

import { AnimatedSection } from '@/components/ui';
import { Trophy, TrendingUp, Calendar, Medal, MapPin, BarChart3 } from 'lucide-react';
import { ProgressionChart } from './ProgressionChart';

interface Record {
  perf: string;
  date: string;
  lieu: string;
}

interface RecordsByYear {
  [year: string]: Record;
}

interface RecordData {
  name: string;
  type: 'time' | 'distance' | 'points';
  records: RecordsByYear;
}

interface Resultat {
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

interface DisciplineContentProps {
  disciplineId: string;
  disciplineName: string;
  color: 'amber' | 'blue' | 'purple';
  records: { [key: string]: RecordData };
  resultats: Resultat[];
}

export function DisciplineContent({
  disciplineId,
  disciplineName,
  color,
  records,
  resultats,
}: DisciplineContentProps) {
  // Trouver le record actuel (meilleure perf)
  const getCurrentRecord = () => {
    const allRecords = Object.values(records);
    if (allRecords.length === 0) return null;

    // Prendre le premier type de record comme principal
    const mainRecord = allRecords[0];
    const years = Object.keys(mainRecord.records).sort((a, b) => parseInt(b) - parseInt(a));
    if (years.length === 0) return null;

    return {
      ...mainRecord.records[years[0]],
      name: mainRecord.name,
      type: mainRecord.type,
      year: years[0],
    };
  };

  // Calculer la progression
  const getProgression = () => {
    const allRecords = Object.values(records);
    if (allRecords.length === 0) return null;

    const mainRecord = allRecords[0];
    const years = Object.keys(mainRecord.records).sort((a, b) => parseInt(a) - parseInt(b));
    if (years.length < 2) return null;

    const firstYear = years[0];
    const lastYear = years[years.length - 1];
    const firstPerf = parseFloat(mainRecord.records[firstYear].perf);
    const lastPerf = parseFloat(mainRecord.records[lastYear].perf);

    const diff = mainRecord.type === 'time'
      ? firstPerf - lastPerf // Pour le temps, moins c'est mieux
      : lastPerf - firstPerf; // Pour distance/points, plus c'est mieux

    return {
      from: firstYear,
      to: lastYear,
      diff: diff.toFixed(2),
      isPositive: diff > 0,
      type: mainRecord.type,
    };
  };

  // Préparer les données pour le graphique de progression
  const getProgressionData = () => {
    const allRecords = Object.values(records);
    if (allRecords.length === 0) return [];

    const mainRecord = allRecords[0];
    return Object.entries(mainRecord.records)
      .map(([year, record]) => ({
        date: year,
        perf: parseFloat(record.perf),
      }))
      .sort((a, b) => parseInt(a.date) - parseInt(b.date));
  };

  // Grouper les résultats par année
  const getResultsByYear = () => {
    const byYear: { [year: string]: Resultat[] } = {};
    resultats.forEach((r) => {
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

  const currentRecord = getCurrentRecord();
  const progression = getProgression();
  const progressionData = getProgressionData();
  const resultsByYear = getResultsByYear();
  const years = Object.keys(resultsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  const colorClasses = {
    amber: {
      badge: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
      icon: 'text-amber-500',
      stat: 'bg-amber-500/20',
      highlight: 'border-amber-500',
    },
    blue: {
      badge: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
      icon: 'text-blue-500',
      stat: 'bg-blue-500/20',
      highlight: 'border-blue-500',
    },
    purple: {
      badge: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
      icon: 'text-purple-500',
      stat: 'bg-purple-500/20',
      highlight: 'border-purple-500',
    },
  };

  const colors = colorClasses[color];

  // Formater la performance selon le type
  const formatPerf = (perf: string, type: 'time' | 'distance' | 'points') => {
    if (type === 'time') return `${perf}''`;
    if (type === 'points') return `${perf} pts`;
    return `${perf} m`;
  };

  // Formater la progression
  const formatProgression = (diff: string, type: 'time' | 'distance' | 'points', isPositive: boolean) => {
    const prefix = isPositive ? '+' : '';
    if (type === 'time') return `${isPositive ? '-' : '+'}${Math.abs(parseFloat(diff)).toFixed(2)}''`;
    if (type === 'points') return `${prefix}${diff} pts`;
    return `${prefix}${diff} m`;
  };

  return (
    <div className="space-y-12">
      {/* Stats rapides */}
      <section className="py-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {currentRecord && (
              <AnimatedSection animation="fadeUp" delay={0.1}>
                <div className="bg-slate-800/50 rounded-xl p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <Medal className={colors.icon} size={24} />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {formatPerf(currentRecord.perf, currentRecord.type)}
                  </div>
                  <div className="text-sm font-medium text-slate-300">Record personnel</div>
                  <div className="text-xs text-slate-500">{currentRecord.name}</div>
                </div>
              </AnimatedSection>
            )}

            {progression && (
              <AnimatedSection animation="fadeUp" delay={0.2}>
                <div className="bg-slate-800/50 rounded-xl p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <TrendingUp className={progression.isPositive ? 'text-green-500' : 'text-red-500'} size={24} />
                  </div>
                  <div className={`text-3xl font-bold mb-1 ${progression.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {formatProgression(progression.diff, progression.type, progression.isPositive)}
                  </div>
                  <div className="text-sm font-medium text-slate-300">Progression</div>
                  <div className="text-xs text-slate-500">{progression.from} → {progression.to}</div>
                </div>
              </AnimatedSection>
            )}

            <AnimatedSection animation="fadeUp" delay={0.3}>
              <div className="bg-slate-800/50 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-3">
                  <Calendar className="text-blue-500" size={24} />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{resultats.length}</div>
                <div className="text-sm font-medium text-slate-300">Compétitions</div>
                <div className="text-xs text-slate-500">Enregistrées</div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={0.4}>
              <div className="bg-slate-800/50 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-3">
                  <Trophy className="text-amber-500" size={24} />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {resultats.filter((r) => r.classement === 1).length}
                </div>
                <div className="text-sm font-medium text-slate-300">Victoires</div>
                <div className="text-xs text-slate-500">1ère place</div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Records par variante */}
      {Object.keys(records).length > 1 && (
        <section className="py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${colors.stat} rounded-xl flex items-center justify-center`}>
                  <Medal className={colors.icon} size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">Records par épreuve</h2>
              </div>
            </AnimatedSection>

            <div className="space-y-3">
              {Object.entries(records).map(([key, record], index) => {
                const years = Object.keys(record.records).sort((a, b) => parseInt(b) - parseInt(a));
                const bestYear = years[0];
                const bestRecord = record.records[bestYear];

                return (
                  <AnimatedSection key={key} animation="fadeUp" delay={0.1 * index}>
                    <div className="bg-slate-800/50 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{record.name}</div>
                        <div className="text-sm text-slate-400">
                          {new Date(bestRecord.date).toLocaleDateString('fr-FR')} • {bestRecord.lieu}
                        </div>
                      </div>
                      <div className={`text-2xl font-bold ${colors.icon}`}>
                        {formatPerf(bestRecord.perf, record.type)}
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Graphique de progression */}
      {progressionData.length > 1 && (
        <section className="py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="text-green-500" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">Courbe de progression</h2>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp">
              <div className="bg-slate-800/50 rounded-2xl p-6">
                <ProgressionChart
                  data={progressionData}
                  objectif={null}
                  isTime={Object.values(records)[0]?.type === 'time'}
                />
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Résultats par année */}
      {years.map((year, yearIndex) => {
        const yearResults = resultsByYear[year];
        const isCurrentYear = year === '2025';

        return (
          <section
            key={year}
            className={`py-12 ${yearIndex % 2 === 0 ? 'bg-slate-800/30' : ''}`}
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <AnimatedSection className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isCurrentYear ? colors.stat : 'bg-slate-700'
                    }`}
                  >
                    <Calendar
                      className={isCurrentYear ? colors.icon : 'text-slate-400'}
                      size={24}
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Saison {year}</h2>
                  {isCurrentYear && (
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
                      En cours
                    </span>
                  )}
                </div>
              </AnimatedSection>

              <div className="space-y-1">
                {yearResults.map((result) => (
                  <ResultCard key={result.id} result={result} color={color} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

interface ResultCardProps {
  result: Resultat;
  color: 'amber' | 'blue' | 'purple';
}

function ResultCard({ result, color }: ResultCardProps) {
  const formattedDate = new Date(result.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });

  const isHighlight = result.classement === 1;
  const colorBorder = {
    amber: 'border-amber-500',
    blue: 'border-blue-500',
    purple: 'border-purple-500',
  };

  return (
    <div
      className={`rounded-lg px-3 py-2 ${
        isHighlight ? `bg-slate-800/70 border-l-2 ${colorBorder[color]}` : 'bg-slate-800/30'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs text-slate-500 w-14 flex-shrink-0">{formattedDate}</span>
          <span className="text-slate-400 text-sm truncate">{result.lieu}</span>
          {result.niveau && (
            <span className="text-xs text-slate-500 bg-slate-700 px-1.5 py-0.5 rounded">
              {result.niveau}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {result.isRecord && (
            <span className="text-xs font-medium text-blue-400 bg-blue-500/20 px-1.5 py-0.5 rounded">
              RP
            </span>
          )}
          {result.notes && (
            <span className="text-xs font-medium text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">
              {result.notes}
            </span>
          )}
          <span className={`font-bold ${isHighlight ? 'text-amber-400' : 'text-white'}`}>
            {result.perf}
          </span>
          <span
            className={`text-xs font-medium w-8 text-right ${
              result.classement === 1 ? 'text-green-400' : 'text-slate-500'
            }`}
          >
            {result.classement === 1 ? '1er' : result.classement ? `${result.classement}e` : '-'}
          </span>
        </div>
      </div>
    </div>
  );
}
