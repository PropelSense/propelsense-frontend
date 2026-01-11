'use client';

import {
  ComposedChart as RechartsComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CorrelationDataPoint } from '@/lib/types/chart.types';

interface ComposedChartProps {
  data: CorrelationDataPoint[];
  title: string;
  height?: number;
  showLegend?: boolean;
  barKey?: string;
  lineKey?: string;
  barName?: string;
  lineName?: string;
  barColor?: string;
  lineColor?: string;
}

export default function ComposedChart({
  data,
  title,
  height = 300,
  showLegend = true,
  barKey = 'correlation',
  lineKey = 'importance',
  barName = 'Correlation',
  lineName = 'Importance',
  barColor = '#0088FE',
  lineColor = '#FF8042',
}: ComposedChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        {title}
      </h2>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="feature" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          {showLegend && <Legend />}
          <Bar dataKey={barKey} fill={barColor} name={barName} />
          <Line
            type="monotone"
            dataKey={lineKey}
            stroke={lineColor}
            strokeWidth={2}
            name={lineName}
          />
        </RechartsComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

