"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CategoryDataPoint } from "@/lib/types/chart.types";

interface BarComparisonChartProps {
  data: CategoryDataPoint[];
  title?: string;
  height?: number;
  showLegend?: boolean;
  valueKey?: string;
  targetKey?: string;
  valueName?: string;
  targetName?: string;
  plain?: boolean; // No wrapper, for use in pre-styled containers
}

export default function BarComparisonChart({
  data,
  title,
  height = 300,
  showLegend = true,
  valueKey = "value",
  targetKey = "target",
  valueName = "Actual",
  targetName = "Target",
  plain = false,
}: BarComparisonChartProps) {
  const chart = (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
        <XAxis dataKey="category" stroke="#a1a1aa" />
        <YAxis stroke="#a1a1aa" />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(24, 24, 27, 0.95)",
            border: "1px solid #3f3f46",
            borderRadius: "8px",
            color: "#e4e4e7",
          }}
        />
        {showLegend && <Legend wrapperStyle={{ color: "#e4e4e7" }} />}
        <Bar dataKey={valueKey} fill="#3b82f6" name={valueName} />
        {data[0]?.[targetKey as keyof CategoryDataPoint] !== undefined && (
          <Bar dataKey={targetKey} fill="#22c55e" name={targetName} />
        )}
      </BarChart>
    </ResponsiveContainer>
  );

  if (plain) {
    return chart;
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-800">
      {title && (
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          {title}
        </h2>
      )}
      {chart}
    </div>
  );
}
