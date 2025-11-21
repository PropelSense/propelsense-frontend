'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CategoryDataPoint } from '@/lib/types/chart.types';

interface BarComparisonChartProps {
  data: CategoryDataPoint[];
  title: string;
  height?: number;
  showLegend?: boolean;
  valueKey?: string;
  targetKey?: string;
  valueName?: string;
  targetName?: string;
}

export default function BarComparisonChart({
  data,
  title,
  height = 300,
  showLegend = true,
  valueKey = 'value',
  targetKey = 'target',
  valueName = 'Actual',
  targetName = 'Target',
}: BarComparisonChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        {title}
      </h2>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="category" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          {showLegend && <Legend />}
          <Bar dataKey={valueKey} fill="#0088FE" name={valueName} />
          {data[0]?.[targetKey as keyof CategoryDataPoint] !== undefined && (
            <Bar dataKey={targetKey} fill="#00C49F" name={targetName} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

