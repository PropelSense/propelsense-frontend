'use client';

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DistributionDataPoint } from '@/lib/types/chart.types';
import { CHART_COLORS } from '@/lib/data/sampleData';

interface PieChartProps {
  data: DistributionDataPoint[];
  title: string;
  height?: number;
  showLabel?: boolean;
  colors?: string[];
}

export default function PieChart({
  data,
  title,
  height = 300,
  showLabel = true,
  colors = CHART_COLORS,
}: PieChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        {title}
      </h2>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={
              showLabel
                ? ({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                : false
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

