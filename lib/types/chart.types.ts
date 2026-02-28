// Chart data type definitions

export interface TimeSeriesDataPoint {
  month: string;
  value: number;
  prediction?: number;
}

export interface CategoryDataPoint {
  category: string;
  value: number;
  target?: number;
}

export interface DistributionDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface ScatterDataPoint {
  x: number;
  y: number;
  size?: number;
}

export interface CorrelationDataPoint {
  feature: string;
  correlation: number;
  importance: number;
}

export interface ChartConfig {
  title: string;
  height?: number;
  showLegend?: boolean;
  colors?: string[];
}

export interface StatsCard {
  label: string;
  value: string | number;
  color?: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  lastUpdated: string;
}

