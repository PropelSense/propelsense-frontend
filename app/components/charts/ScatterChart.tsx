'use client';

import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ScatterDataPoint } from '@/lib/types/chart.types';

interface ScatterChartProps {
  data: ScatterDataPoint[];
  title: string;
  height?: number;
  xLabel?: string;
  yLabel?: string;
  color?: string;
}

export default function ScatterChart({
  data,
  title,
  height = 300,
  xLabel = 'X Value',
  yLabel = 'Y Value',
  color = '#8884d8',
}: ScatterChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        {title}
      </h2>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis type="number" dataKey="x" name={xLabel} stroke="#666" />
          <YAxis type="number" dataKey="y" name={yLabel} stroke="#666" />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <Scatter name="Data Points" data={data} fill={color} />
        </RechartsScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

