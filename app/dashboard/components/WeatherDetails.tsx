"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  fetchWeatherData,
  getWeatherDescription,
  getWindDirectionLabel,
  CITIES,
  type WeatherData,
  type City,
} from "@/lib/services/weatherService";

export default function WeatherDetails() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);

  useEffect(() => {
    loadWeatherData();
  }, [selectedCity]);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeatherData(selectedCity.location);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data");
      console.error("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (cityName: string) => {
    const city = CITIES.find(c => c.name === cityName);
    if (city) {
      setSelectedCity(city);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Weather Details</h1>
          <p className="text-neutral-400 mt-2">Maritime weather conditions and forecasts</p>
        </div>
        <Card className="bg-zinc-900/90 border-zinc-700">
          <CardContent className="p-12">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-neutral-400">Loading weather data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Weather Details</h1>
          <p className="text-neutral-400 mt-2">Maritime weather conditions and forecasts</p>
        </div>
        <Card className="bg-zinc-900/90 border-zinc-700">
          <CardContent className="p-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-400 font-medium">{error}</p>
              <Button onClick={loadWeatherData} className="bg-blue-600 hover:bg-blue-700">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!weatherData) return null;

  const { current, hourly, location: loc } = weatherData;
  
  // Prepare chart data for 24 hours
  const chartData = Array.from({ length: 24 }, (_, i) => ({
    time: hourly.time[i].toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    fullTime: hourly.time[i],
    temperature: parseFloat(hourly.temperature[i].toFixed(1)),
    windSpeed: parseFloat(hourly.windSpeed[i].toFixed(1)),
    humidity: parseFloat(hourly.humidity[i].toFixed(0)),
    pressure: parseFloat(hourly.pressure[i].toFixed(0)),
    precipitation: parseFloat(hourly.precipitation[i].toFixed(2)),
    precipitationProbability: parseFloat(hourly.precipitationProbability[i].toFixed(0)),
    snowfall: parseFloat(hourly.snowfall[i].toFixed(1)),
    windDirection: getWindDirectionLabel(hourly.windDirection[i]),
    cloudCover: parseFloat(hourly.cloudCover[i].toFixed(0)),
    visibility: parseFloat((hourly.visibility[i] / 1000).toFixed(1)),
    dewPoint: parseFloat(hourly.dewPoint[i].toFixed(1)),
  }));

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-800 border border-zinc-600 p-3 rounded-lg shadow-lg">
          <p className="text-neutral-300 text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{entry.unit || ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">Weather Details</h1>
          <p className="text-neutral-400 mt-2">
            Maritime weather conditions for {selectedCity.name}, {selectedCity.country}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedCity.name} onValueChange={handleCityChange}>
            <SelectTrigger className="w-48 bg-zinc-800 border-zinc-600 text-white">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-600">
              {CITIES.map((city) => (
                <SelectItem 
                  key={city.name} 
                  value={city.name}
                  className="text-white hover:bg-zinc-700 focus:bg-zinc-700"
                >
                  {city.name}, {city.country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={loadWeatherData} 
            variant="outline" 
            className="bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-600"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
        </div>
      </div>

      {/* Current Weather */}
      <Card className="bg-zinc-900/90 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Current Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-neutral-500">Weather</p>
              <p className="text-lg font-semibold text-white">{getWeatherDescription(current.weatherCode)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-neutral-500">Temperature</p>
              <p className="text-lg font-semibold text-white">{current.temperature.toFixed(1)}°C</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-neutral-500">Feels Like</p>
              <p className="text-lg font-semibold text-white">{current.apparentTemperature.toFixed(1)}°C</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-neutral-500">Wind Speed</p>
              <p className="text-lg font-semibold text-white">{current.windSpeed.toFixed(1)} km/h</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-neutral-500">Wind Direction</p>
              <p className="text-lg font-semibold text-white">{getWindDirectionLabel(current.windDirection)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-neutral-500">Wind Gusts</p>
              <p className="text-lg font-semibold text-white">{current.windGusts.toFixed(1)} km/h</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-neutral-500">Humidity</p>
              <p className="text-lg font-semibold text-white">{current.humidity.toFixed(0)}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-neutral-500">Pressure</p>
              <p className="text-lg font-semibold text-white">{current.pressure.toFixed(0)} hPa</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-neutral-500">Visibility</p>
              <p className="text-lg font-semibold text-white">{(current.visibility / 1000).toFixed(1)} km</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-neutral-500">Cloud Cover</p>
              <p className="text-lg font-semibold text-white">{current.cloudCover.toFixed(0)}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-neutral-500">Precipitation</p>
              <p className="text-lg font-semibold text-white">{current.precipitation.toFixed(1)} mm</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 24-Hour Forecast - Parallel Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Temperature Trend Chart */}
        <Card className="bg-zinc-900/90 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">24-Hour Temperature Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsAreaChart data={chartData}>
                <defs>
                  <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis 
                  dataKey="time" 
                  stroke="#a1a1aa" 
                  tick={{ fill: '#a1a1aa', fontSize: 12 }}
                  interval={2}
                />
                <YAxis 
                  stroke="#a1a1aa" 
                  tick={{ fill: '#a1a1aa', fontSize: 12 }}
                  label={{ value: '°C', angle: -90, position: 'insideLeft', fill: '#a1a1aa' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#temperatureGradient)"
                  name="Temperature"
                  unit="°C"
                />
              </RechartsAreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Wind Speed Chart */}
        <Card className="bg-zinc-900/90 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">24-Hour Wind Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis 
                  dataKey="time" 
                  stroke="#a1a1aa" 
                  tick={{ fill: '#a1a1aa', fontSize: 12 }}
                  interval={2}
                />
                <YAxis 
                  stroke="#a1a1aa" 
                  tick={{ fill: '#a1a1aa', fontSize: 12 }}
                  label={{ value: 'km/h', angle: -90, position: 'insideLeft', fill: '#a1a1aa' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="windSpeed"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Wind Speed"
                  unit=" km/h"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Hourly Table */}
      <Card className="bg-zinc-900/90 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Detailed 24-Hour Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-zinc-800 z-10">
                <tr className="text-neutral-400 border-b border-zinc-700">
                  <th className="text-left py-2 px-3 whitespace-nowrap">Time</th>
                  <th className="text-right py-2 px-3 whitespace-nowrap">Temp</th>
                  <th className="text-right py-2 px-3 whitespace-nowrap">Feels</th>
                  <th className="text-right py-2 px-3 whitespace-nowrap">Wind</th>
                  <th className="text-center py-2 px-3 whitespace-nowrap">Dir</th>
                  <th className="text-right py-2 px-3 whitespace-nowrap">Humidity</th>
                  <th className="text-right py-2 px-3 whitespace-nowrap">Pressure</th>
                  <th className="text-right py-2 px-3 whitespace-nowrap">Precip</th>
                  <th className="text-right py-2 px-3 whitespace-nowrap">Prob</th>
                  <th className="text-right py-2 px-3 whitespace-nowrap">Cloud</th>
                  <th className="text-right py-2 px-3 whitespace-nowrap">Visibility</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row, index) => (
                  <tr key={index} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                    <td className="py-1.5 px-3 text-neutral-300 whitespace-nowrap">{row.time}</td>
                    <td className="py-1.5 px-3 text-right text-white">{row.temperature}°C</td>
                    <td className="py-1.5 px-3 text-right text-neutral-400">{row.dewPoint}°C</td>
                    <td className="py-1.5 px-3 text-right text-white">{row.windSpeed} km/h</td>
                    <td className="py-1.5 px-3 text-center text-emerald-400">{row.windDirection}</td>
                    <td className="py-1.5 px-3 text-right text-white">{row.humidity}%</td>
                    <td className="py-1.5 px-3 text-right text-white">{row.pressure} hPa</td>
                    <td className="py-1.5 px-3 text-right text-cyan-400">{row.precipitation} mm</td>
                    <td className="py-1.5 px-3 text-right text-blue-400">{row.precipitationProbability}%</td>
                    <td className="py-1.5 px-3 text-right text-neutral-400">{row.cloudCover}%</td>
                    <td className="py-1.5 px-3 text-right text-neutral-400">{row.visibility} km</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #27272a;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #52525b;
          border-radius: 4px;
          border: 2px solid #27272a;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #71717a;
        }
        
        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #52525b #27272a;
        }
      `}</style>

      {/* API Info */}
      <Card className="bg-zinc-900/90 border-zinc-700">
        <CardContent className="p-4">
          <p className="text-xs text-neutral-500 text-center">
            Weather data provided by{" "}
            <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              Open-Meteo
            </a>
            {" "}· Free API for non-commercial use · Data updates hourly
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
