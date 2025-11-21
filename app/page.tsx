'use client';

import { useState, useEffect } from 'react';

// Import service layer
import {
  getTimeSeriesData,
  getCategoryData,
  getDistributionData,
  getScatterData,
  getCorrelationData,
  getWeatherData,
} from '@/lib/services/dataService';

// Import types
import type {
  TimeSeriesDataPoint,
  CategoryDataPoint,
  DistributionDataPoint,
  ScatterDataPoint,
  CorrelationDataPoint,
  WeatherData,
} from '@/lib/types/chart.types';

// Import data (Model layer)
import { statsCards } from '@/lib/data/statsData';

// Import components (View layer)
import TimeSeriesChart from '@/app/components/charts/TimeSeriesChart';
import BarComparisonChart from '@/app/components/charts/BarComparisonChart';
import AreaChart from '@/app/components/charts/AreaChart';
import PieChart from '@/app/components/charts/PieChart';
import ScatterChart from '@/app/components/charts/ScatterChart';
import ComposedChart from '@/app/components/charts/ComposedChart';
import StatsCards from '@/app/components/StatsCards';
import WeatherWidget from '@/app/components/WeatherWidget';
import { APP_TITLE, APP_DESCRIPTION } from '@/lib/constants/app';

// Controller/View: Main Dashboard Page
export default function Dashboard() {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesDataPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDataPoint[]>([]);
  const [distributionData, setDistributionData] = useState<DistributionDataPoint[]>([]);
  const [scatterData, setScatterData] = useState<ScatterDataPoint[]>([]);
  const [correlationData, setCorrelationData] = useState<CorrelationDataPoint[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [timeSeries, categories, distribution, scatter, correlation] =
          await Promise.all([
            getTimeSeriesData(),
            getCategoryData(),
            getDistributionData(),
            getScatterData(),
            getCorrelationData(),
          ]);

        setTimeSeriesData(timeSeries);
        setCategoryData(categories);
        setDistributionData(distribution);
        setScatterData(scatter);
        setCorrelationData(correlation);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Fetch weather data separately and refresh every 30 seconds
  useEffect(() => {
    async function fetchWeather() {
      try {
        setIsWeatherLoading(true);
        const weather = await getWeatherData();
        setWeatherData(weather);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setIsWeatherLoading(false);
      }
    }

    // Fetch immediately
    fetchWeather();

    // Set up interval to refresh every 30 seconds
    const interval = setInterval(fetchWeather, 30000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {APP_TITLE}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {APP_DESCRIPTION}
          </p>
        </header>

        {/* Stats Cards */}
        <StatsCards stats={statsCards} />

        {/* Weather Widget */}
        <div className="mb-6">
          <WeatherWidget weather={weatherData} isLoading={isWeatherLoading} />
        </div>

        {/* Charts Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-gray-600 dark:text-gray-400">
              Loading dashboard data...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <TimeSeriesChart
              data={timeSeriesData}
              title="Time Series Analysis"
              height={300}
            />

            <BarComparisonChart
              data={categoryData}
              title="Category Comparison"
              height={300}
            />

            <AreaChart
              data={timeSeriesData}
              title="Cumulative Distribution"
              height={300}
            />

            <PieChart
              data={distributionData}
              title="Distribution Analysis"
              height={300}
            />

            <ScatterChart
              data={scatterData}
              title="Scatter Plot Analysis"
              height={300}
            />

            <ComposedChart
              data={correlationData}
              title="Feature Correlation & Importance"
              height={300}
            />
          </div>
        )}
      </div>
    </div>
  );
}
