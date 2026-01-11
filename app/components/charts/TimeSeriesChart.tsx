'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TimeSeriesDataPoint } from '@/lib/types/chart.types';

interface TimeSeriesChartProps {
  data: TimeSeriesDataPoint[];
  title: string;
  height?: number;
  showLegend?: boolean;
}

export default function TimeSeriesChart({
  data,
  title,
  height = 300,
  showLegend = true,
}: TimeSeriesChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        {title}
      </h2>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="month" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          {showLegend && <Legend />}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0088FE"
            strokeWidth={2}
            name="Actual"
            dot={{ r: 4 }}
          />
          {data[0]?.prediction !== undefined && (
            <Line
              type="monotone"
              dataKey="prediction"
              stroke="#00C49F"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Prediction"
              dot={{ r: 4 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

