'use client';

import { type FC } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Scatter,
  ComposedChart,
} from 'recharts';

interface ProgressionData {
  date: string;
  perf: number;
  engin: string;
  competition: string;
  lieu: string;
}

interface ProgressionChartProps {
  data: ProgressionData[] | SimpleProgressionData[];
  objectif?: number | null;
  isTime?: boolean;
}

interface SimpleProgressionData {
  date: string;
  perf: number;
}

const enginColors: Record<string, string> = {
  '500g': '#22c55e', // vert
  '600g': '#3b82f6', // bleu
  '700g': '#f59e0b', // amber
};

// Type guard pour vérifier si c'est des données simples
function isSimpleData(data: ProgressionData[] | SimpleProgressionData[]): data is SimpleProgressionData[] {
  return data.length > 0 && !('engin' in data[0]);
}

export const ProgressionChart: FC<ProgressionChartProps> = ({ data, objectif = 60, isTime = false }) => {
  // Détecter si c'est un mode simple (sans engin)
  const isSimple = isSimpleData(data);

  // Trier par date
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Créer les données pour le graphique
  const chartData = sortedData.map((item, index) => {
    const baseData = {
      ...item,
      index,
      dateLabel: isSimple
        ? item.date // Pour les données annuelles simples, garder juste l'année
        : new Date(item.date).toLocaleDateString('fr-FR', {
            month: 'short',
            year: '2-digit',
          }),
      fullDate: isSimple
        ? item.date
        : new Date(item.date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
    };

    if (isSimple) {
      return { ...baseData, perfSimple: item.perf };
    }

    const fullItem = item as ProgressionData;
    return {
      ...baseData,
      perf500g: fullItem.engin === '500g' ? fullItem.perf : null,
      perf600g: fullItem.engin === '600g' ? fullItem.perf : null,
      perf700g: fullItem.engin === '700g' ? fullItem.perf : null,
    };
  });

  // Trouver min/max pour l'axe Y
  const perfs = data.map((d) => d.perf);
  const minPerf = isTime
    ? Math.floor(Math.min(...perfs) - 1)
    : Math.floor(Math.min(...perfs) / 5) * 5 - 5;
  const maxPerf = isTime
    ? Math.ceil(Math.max(...perfs) + 1)
    : objectif
      ? Math.max(Math.ceil(Math.max(...perfs) / 5) * 5, objectif + 5)
      : Math.ceil(Math.max(...perfs) / 5) * 5 + 5;

  // Calculer l'intervalle pour les labels X (afficher environ 8-10 labels)
  const tickInterval = Math.max(1, Math.floor(chartData.length / 8));

  // Mode simple (autres disciplines)
  if (isSimple) {
    const unit = isTime ? "''" : 'm';
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
                tickFormatter={(value) => `${value}${unit}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
                      <p className="text-white font-bold text-lg">{d.perf}{unit}</p>
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
