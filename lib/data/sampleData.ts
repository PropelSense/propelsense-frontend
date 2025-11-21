import {
  TimeSeriesDataPoint,
  CategoryDataPoint,
  DistributionDataPoint,
  ScatterDataPoint,
  CorrelationDataPoint,
} from '../types/chart.types';

// Sample data science datasets
export const timeSeriesData: TimeSeriesDataPoint[] = [
  { month: 'Jan', value: 400, prediction: 420 },
  { month: 'Feb', value: 300, prediction: 350 },
  { month: 'Mar', value: 500, prediction: 480 },
  { month: 'Apr', value: 450, prediction: 460 },
  { month: 'May', value: 600, prediction: 580 },
  { month: 'Jun', value: 550, prediction: 570 },
  { month: 'Jul', value: 700, prediction: 680 },
  { month: 'Aug', value: 650, prediction: 670 },
  { month: 'Sep', value: 800, prediction: 790 },
  { month: 'Oct', value: 750, prediction: 760 },
  { month: 'Nov', value: 900, prediction: 890 },
  { month: 'Dec', value: 850, prediction: 860 },
];

export const categoryData: CategoryDataPoint[] = [
  { category: 'Category A', value: 400, target: 450 },
  { category: 'Category B', value: 300, target: 350 },
  { category: 'Category C', value: 500, target: 480 },
  { category: 'Category D', value: 200, target: 250 },
  { category: 'Category E', value: 600, target: 580 },
];

export const distributionData: DistributionDataPoint[] = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group E', value: 100 },
];

export const scatterData: ScatterDataPoint[] = Array.from(
  { length: 50 },
  (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 30 + 10,
  })
);

export const correlationData: CorrelationDataPoint[] = [
  { feature: 'Feature 1', correlation: 0.85, importance: 0.92 },
  { feature: 'Feature 2', correlation: 0.72, importance: 0.78 },
  { feature: 'Feature 3', correlation: 0.65, importance: 0.71 },
  { feature: 'Feature 4', correlation: 0.58, importance: 0.64 },
  { feature: 'Feature 5', correlation: 0.45, importance: 0.52 },
];

export const CHART_COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
];

