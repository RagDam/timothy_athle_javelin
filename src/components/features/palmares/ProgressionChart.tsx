'use client';

import { type FC } from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
} from 'recharts';

// Convertir des secondes en format "M:SS" pour affichage sur l'axe Y
function formatSecondsToTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  return `${secs}''`;
}

// Convertir des secondes en format complet "M:SS.cc" pour tooltip
function formatSecondsToFullTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins}:${secs.toFixed(2).padStart(5, '0')}`;
  }
  return `${secs.toFixed(2)}''`;
}

interface ProgressionData {
  date: string;
  perf: number;
  engin: string;
  competition: string;
  lieu: string;
}

interface SimpleProgressionData {
  date: string;
  perf: number;
}

interface MultiEpreuveData {
  date: string;
  perf: number;
  epreuve: string;
  lieu: string;
}

interface ProgressionChartProps {
  data: ProgressionData[] | SimpleProgressionData[] | MultiEpreuveData[];
  objectif?: number | null;
  isTime?: boolean;
  isPoints?: boolean;
}

const enginColors: Record<string, string> = {
  '500g': '#22c55e', // vert
  '600g': '#3b82f6', // bleu
  '700g': '#f59e0b', // amber
};

// Couleurs pour les épreuves multiples
const epreuveColors: string[] = [
  '#3b82f6', // bleu
  '#22c55e', // vert
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ef4444', // rouge
  '#06b6d4', // cyan
  '#ec4899', // rose
];

// Type guards
function isSimpleData(data: ProgressionData[] | SimpleProgressionData[] | MultiEpreuveData[]): data is SimpleProgressionData[] {
  return data.length > 0 && !('engin' in data[0]) && !('epreuve' in data[0]);
}

function isMultiEpreuveData(data: ProgressionData[] | SimpleProgressionData[] | MultiEpreuveData[]): data is MultiEpreuveData[] {
  return data.length > 0 && 'epreuve' in data[0] && !('engin' in data[0]);
}

export const ProgressionChart: FC<ProgressionChartProps> = ({ data, objectif = 60, isTime = false, isPoints = false }) => {
  // Détecter le mode
  const isSimple = isSimpleData(data);
  const isMultiEpreuve = isMultiEpreuveData(data);

  // Trier par date
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Trouver min/max pour l'axe Y avec marge adaptée
  const perfs = data.map((d) => d.perf);
  const minPerfRaw = Math.min(...perfs);
  const maxPerfRaw = Math.max(...perfs);
  const range = maxPerfRaw - minPerfRaw;

  let minPerf: number;
  let maxPerf: number;

  if (isTime) {
    // Pour les temps (en secondes), marge de 5-10 secondes
    const margin = Math.max(range * 0.1, 5);
    minPerf = Math.floor((minPerfRaw - margin) / 10) * 10;
    maxPerf = Math.ceil((maxPerfRaw + margin) / 10) * 10;
  } else if (maxPerfRaw <= 3) {
    // Pour très petites distances (hauteur ~1-2m), marge fine de 0.1m
    const margin = Math.max(range * 0.1, 0.1);
    minPerf = Math.floor((minPerfRaw - margin) * 10) / 10;
    maxPerf = Math.ceil((maxPerfRaw + margin) * 10) / 10;
    minPerf = Math.max(0, minPerf);
  } else if (maxPerfRaw <= 10) {
    // Pour petites distances (longueur 3-6m), marge de 0.25m arrondie à 0.5m
    const margin = Math.max(range * 0.1, 0.25);
    minPerf = Math.floor((minPerfRaw - margin) * 2) / 2;
    maxPerf = Math.ceil((maxPerfRaw + margin) * 2) / 2;
    minPerf = Math.max(0, minPerf);
  } else {
    // Pour les grandes distances (javelot, poids), arrondir aux 5m
    const margin = Math.max(range * 0.1, 2);
    minPerf = Math.floor((minPerfRaw - margin) / 5) * 5;
    maxPerf = objectif
      ? Math.max(Math.ceil((maxPerfRaw + margin) / 5) * 5, objectif + 5)
      : Math.ceil((maxPerfRaw + margin) / 5) * 5;
  }

  // Mode multi-épreuves (haies, poids, combinés, etc.)
  if (isMultiEpreuve) {
    const multiData = data as MultiEpreuveData[];

    // Obtenir les épreuves uniques
    const epreuves = Array.from(new Set(multiData.map((d) => d.epreuve)));

    // Créer un mapping épreuve -> couleur
    const epreuveColorMap: Record<string, string> = {};
    epreuves.forEach((ep, i) => {
      epreuveColorMap[ep] = epreuveColors[i % epreuveColors.length];
    });

    // Créer les données pour le graphique avec une colonne par épreuve
    const chartData = sortedData.map((item, index) => {
      const d = item as MultiEpreuveData;
      const baseData: Record<string, unknown> = {
        ...d,
        index,
        dateLabel: new Date(d.date).toLocaleDateString('fr-FR', {
          month: 'short',
          year: '2-digit',
        }),
        fullDate: new Date(d.date).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      };

      // Ajouter la perf pour l'épreuve correspondante
      epreuves.forEach((ep) => {
        const key = `perf_${ep.replace(/[^a-zA-Z0-9]/g, '_')}`;
        baseData[key] = d.epreuve === ep ? d.perf : null;
      });

      return baseData;
    });

    const tickInterval = Math.max(1, Math.floor(chartData.length / 10));

    // Fonction de formatage pour l'axe Y
    const formatYAxis = (value: number) => {
      if (isTime) {
        return formatSecondsToTime(value);
      }
      if (isPoints) {
        return `${value} pts`;
      }
      return `${value}m`;
    };

    return (
      <div className="w-full">
        {/* Légende des épreuves */}
        <div className="flex flex-wrap gap-3 mb-6 text-sm">
          {epreuves.map((ep) => (
            <div key={ep} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: epreuveColorMap[ep] }}
              />
              <span className="text-slate-300 text-xs">{ep}</span>
              <span className="text-slate-500 text-xs">
                ({multiData.filter((d) => d.epreuve === ep).length})
              </span>
            </div>
          ))}
          <div className="ml-auto text-slate-500 text-xs">
            Total: <span className="text-white font-medium">{multiData.length}</span>
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="dateLabel"
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                tickLine={{ stroke: '#475569' }}
                interval={tickInterval}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                domain={isTime ? [maxPerf, minPerf] : [minPerf, maxPerf]}
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickLine={{ stroke: '#475569' }}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = payload[0].payload as MultiEpreuveData & { fullDate: string };
                  const color = epreuveColorMap[d.epreuve] || '#3b82f6';
                  const displayPerf = isTime ? formatSecondsToFullTime(d.perf) : isPoints ? `${d.perf} pts` : `${d.perf}m`;
                  return (
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-slate-300 text-xs">{d.epreuve}</span>
                      </div>
                      <p className="text-white font-bold text-lg">{displayPerf}</p>
                      <p className="text-slate-400 text-sm">{d.fullDate}</p>
                      <p className="text-slate-500 text-xs">{d.lieu}</p>
                    </div>
                  );
                }}
              />

              {/* Lignes par épreuve */}
              {epreuves.map((ep) => {
                const key = `perf_${ep.replace(/[^a-zA-Z0-9]/g, '_')}`;
                return (
                  <Line
                    key={ep}
                    type="monotone"
                    dataKey={key}
                    stroke={epreuveColorMap[ep]}
                    strokeWidth={2}
                    dot={{ fill: epreuveColorMap[ep], strokeWidth: 0, r: 4 }}
                    activeDot={{ fill: epreuveColorMap[ep], strokeWidth: 0, r: 7 }}
                    connectNulls
                    name={ep}
                  />
                );
              })}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // Mode simple (données annuelles - records par année)
  if (isSimple) {
    const chartData = sortedData.map((item, index) => ({
      ...item,
      index,
      dateLabel: item.date,
      fullDate: item.date,
      perfSimple: item.perf,
    }));

    // Fonction de formatage pour l'axe Y (mode simple)
    const formatYAxisSimple = (value: number) => {
      if (isTime) {
        return formatSecondsToTime(value);
      }
      if (isPoints) {
        return `${value} pts`;
      }
      return `${value}m`;
    };

    return (
      <div className="w-full">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="dateLabel"
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickLine={{ stroke: '#475569' }}
              />
              <YAxis
                domain={isTime ? [maxPerf, minPerf] : [minPerf, maxPerf]}
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickLine={{ stroke: '#475569' }}
                tickFormatter={formatYAxisSimple}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = payload[0].payload;
                  const displayPerf = isTime ? formatSecondsToFullTime(d.perf) : isPoints ? `${d.perf} pts` : `${d.perf}m`;
                  return (
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
                      <p className="text-white font-bold text-lg">{displayPerf}</p>
                      <p className="text-slate-400 text-sm">{d.fullDate}</p>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="perfSimple"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 0, r: 6 }}
                activeDot={{ fill: '#3b82f6', strokeWidth: 0, r: 8 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // Mode complet (javelot avec engins)
  const fullData = data as ProgressionData[];
  const tickInterval = Math.max(1, Math.floor(sortedData.length / 8));

  // Créer les données pour le graphique
  const chartData = sortedData.map((item, index) => {
    const fullItem = item as ProgressionData;
    return {
      ...fullItem,
      index,
      dateLabel: new Date(fullItem.date).toLocaleDateString('fr-FR', {
        month: 'short',
        year: '2-digit',
      }),
      fullDate: new Date(fullItem.date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      perf500g: fullItem.engin === '500g' ? fullItem.perf : null,
      perf600g: fullItem.engin === '600g' ? fullItem.perf : null,
      perf700g: fullItem.engin === '700g' ? fullItem.perf : null,
    };
  });

  return (
    <div className="w-full">
      {/* Stats résumé */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-slate-400">500g</span>
          <span className="text-white font-medium">
            ({fullData.filter((d) => d.engin === '500g').length} compétitions)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-slate-400">600g</span>
          <span className="text-white font-medium">
            ({fullData.filter((d) => d.engin === '600g').length} compétitions)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-slate-400">700g</span>
          <span className="text-white font-medium">
            ({fullData.filter((d) => d.engin === '700g').length} compétitions)
          </span>
        </div>
        <div className="ml-auto text-slate-500">
          Total: <span className="text-white font-medium">{fullData.length} compétitions</span>
        </div>
      </div>

      <div className="h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="dateLabel"
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={{ stroke: '#475569' }}
              interval={tickInterval}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              domain={[minPerf, maxPerf]}
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={{ stroke: '#475569' }}
              tickFormatter={(value) => `${value}m`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Ligne objectif */}
            {objectif && (
              <ReferenceLine
                y={objectif}
                stroke="#ef4444"
                strokeDasharray="5 5"
                label={{
                  value: `Objectif ${objectif}m`,
                  position: 'right',
                  fill: '#ef4444',
                  fontSize: 12,
                }}
              />
            )}

            {/* Lignes par engin */}
            <Line
              type="monotone"
              dataKey="perf500g"
              stroke={enginColors['500g']}
              strokeWidth={2}
              dot={{ fill: enginColors['500g'], strokeWidth: 0, r: 5 }}
              activeDot={{ fill: enginColors['500g'], strokeWidth: 0, r: 8 }}
              connectNulls
              name="Javelot 500g"
            />
            <Line
              type="monotone"
              dataKey="perf600g"
              stroke={enginColors['600g']}
              strokeWidth={2}
              dot={{ fill: enginColors['600g'], strokeWidth: 0, r: 5 }}
              activeDot={{ fill: enginColors['600g'], strokeWidth: 0, r: 8 }}
              connectNulls
              name="Javelot 600g"
            />
            <Line
              type="monotone"
              dataKey="perf700g"
              stroke={enginColors['700g']}
              strokeWidth={2}
              dot={{ fill: enginColors['700g'], strokeWidth: 0, r: 5 }}
              activeDot={{ fill: enginColors['700g'], strokeWidth: 0, r: 8 }}
              connectNulls
              name="Javelot 700g"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ProgressionData & { dateLabel: string; fullDate: string };
  }>;
}

const CustomTooltip: FC<TooltipProps> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const color = enginColors[data.engin] || '#3b82f6';

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-slate-400 text-xs">{data.engin}</span>
      </div>
      <p className="text-white font-bold text-lg">{data.perf} m</p>
      <p className="text-slate-400 text-sm">{data.fullDate}</p>
      <p className="text-slate-300 text-sm mt-1">{data.competition}</p>
      <p className="text-slate-500 text-xs">{data.lieu}</p>
    </div>
  );
};
