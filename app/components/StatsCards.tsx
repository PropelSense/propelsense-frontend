'use client';

import { StatsCard } from '@/lib/types/chart.types';

interface StatsCardsProps {
  stats: StatsCard[];
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {stat.label}
          </h3>
          <p
            className={`text-3xl font-bold ${
              stat.color || 'text-gray-900 dark:text-white'
            }`}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

