'use client';

import { WeatherData } from '@/lib/types/chart.types';

interface WeatherWidgetProps {
  weather: WeatherData | null;
  isLoading?: boolean;
}

export default function WeatherWidget({ weather, isLoading }: WeatherWidgetProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-48">
          <div className="text-gray-600 dark:text-gray-400">Loading weather data...</div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-48">
          <div className="text-gray-600 dark:text-gray-400">No weather data available</div>
        </div>
      </div>
    );
  }

  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const getUVIndexColor = (uv: number): string => {
    if (uv <= 2) return 'text-green-600';
    if (uv <= 5) return 'text-yellow-600';
    if (uv <= 7) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Real-Time Weather
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Updated: {weather.lastUpdated}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Weather Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{weather.icon}</div>
            <div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {weather.temperature}°C
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-400">
                {weather.condition}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                Feels like {weather.feelsLike}°C
              </div>
            </div>
          </div>
          <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
            📍 {weather.location}
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Humidity
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {weather.humidity}%
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Wind Speed
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {weather.windSpeed} km/h
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {getWindDirection(weather.windDirection)}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Pressure
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {weather.pressure} hPa
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              UV Index
            </div>
            <div className={`text-2xl font-bold ${getUVIndexColor(weather.uvIndex)}`}>
              {weather.uvIndex}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 col-span-2">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Visibility
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {weather.visibility} km
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

