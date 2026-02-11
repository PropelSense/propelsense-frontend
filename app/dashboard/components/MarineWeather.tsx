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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  fetchMarineData,
  getWaveDirectionLabel,
  getCurrentDirectionLabel,
  getSeaStateDescription,
  getWaveSeverity,
  type MarineData,
} from "@/lib/services/marineService";
import { CITIES, type City } from "@/lib/services/weatherService";

export default function MarineWeather() {
  const [marineData, setMarineData] = useState<MarineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);

  useEffect(() => {
    loadMarineData();
  }, [selectedCity]);

  const loadMarineData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMarineData(selectedCity.location);
      setMarineData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch marine data",
      );
      console.error("Marine data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (cityName: string) => {
    const city = CITIES.find((c) => c.name === cityName);
    if (city) {
      setSelectedCity(city);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Ocean Analytics</h1>
          <p className="text-neutral-400 mt-2">
            Comprehensive marine weather intelligence
          </p>
        </div>
        <Card className="bg-zinc-900/90 border-zinc-700">
          <CardContent className="p-12">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-neutral-400">Loading marine data...</p>
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
          <h1 className="text-3xl font-bold text-white">Ocean Analytics</h1>
          <p className="text-neutral-400 mt-2">
            Comprehensive marine weather intelligence
          </p>
        </div>
        <Card className="bg-zinc-900/90 border-zinc-700">
          <CardContent className="p-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-red-400 font-medium">{error}</p>
              <Button
                onClick={loadMarineData}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!marineData) return null;

  const { current, hourly, location: loc } = marineData;

  // Prepare chart data for 48 hours (2 days for marine conditions)
  const chartData = Array.from({ length: 48 }, (_, i) => ({
    time: hourly.time[i].toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    }),
    fullTime: hourly.time[i],
    waveHeight: parseFloat(hourly.waveHeight[i].toFixed(2)),
    windWaveHeight: parseFloat(hourly.windWaveHeight[i].toFixed(2)),
    swellWaveHeight: parseFloat(hourly.swellWaveHeight[i].toFixed(2)),
    wavePeriod: parseFloat(hourly.wavePeriod[i].toFixed(1)),
    oceanCurrentVelocity: parseFloat(hourly.oceanCurrentVelocity[i].toFixed(2)),
    seaSurfaceTemp: parseFloat(hourly.seaSurfaceTemperature[i].toFixed(1)),
    seaLevelHeight: parseFloat(hourly.seaLevelHeightMsl[i].toFixed(2)),
    waveDirection: getWaveDirectionLabel(hourly.waveDirection[i]),
    currentDirection: getCurrentDirectionLabel(hourly.oceanCurrentDirection[i]),
  }));

  // Wave severity indicator
  const waveSeverity = getWaveSeverity(current.waveHeight);
  const severityColors = [
    "text-green-400",
    "text-yellow-400",
    "text-orange-400",
    "text-red-400",
    "text-purple-400",
  ];
  const severityBgColors = [
    "bg-green-900/20",
    "bg-yellow-900/20",
    "bg-orange-900/20",
    "bg-red-900/20",
    "bg-purple-900/20",
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-800 border border-zinc-600 p-3 rounded-lg shadow-lg">
          <p className="text-neutral-300 text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.unit || ""}
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
          <h1 className="text-3xl font-bold text-white">Ocean Analytics</h1>
          <p className="text-neutral-400 mt-2">
            Marine weather intelligence for {selectedCity.name},{" "}
            {selectedCity.country}
          </p>
        </div>
        <div className="flex items-center gap-3">
          \n{" "}
          <Select value={selectedCity.name} onValueChange={handleCityChange}>
            <SelectTrigger className="w-48 bg-zinc-800 border-zinc-600 text-white">
              <SelectValue placeholder="Select port" />
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
            onClick={loadMarineData}
            variant="outline"
            className="bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-600"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </Button>
        </div>
      </div>

      {/* Current Marine Conditions - Hero Section */}
      <Card className="bg-linear-to-br from-blue-900/30 via-zinc-900/90 to-cyan-900/30 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white text-xl">
            Current Marine Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Wave State */}
            <div
              className={`p-4 rounded-lg ${severityBgColors[waveSeverity]} border border-zinc-700`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-400">Sea State</span>
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                  />
                </svg>
              </div>
              <div
                className={`text-3xl font-bold ${severityColors[waveSeverity]} mb-1`}
              >
                {current.waveHeight.toFixed(2)}m
              </div>
              <div className="text-sm text-neutral-300">
                {getSeaStateDescription(current.waveHeight)}
              </div>
              <div className="text-xs text-neutral-500 mt-2">
                Period: {current.wavePeriod.toFixed(1)}s | From{" "}
                {getWaveDirectionLabel(current.waveDirection)}
              </div>
            </div>

            {/* Ocean Current */}
            <div className="p-4 rounded-lg bg-cyan-900/20 border border-zinc-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-400">Ocean Current</span>
                <svg
                  className="w-6 h-6 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold text-cyan-400 mb-1">
                {current.oceanCurrentVelocity.toFixed(2)} km/h
              </div>
              <div className="text-sm text-neutral-300">Flowing Towards</div>
              <div className="text-xs text-neutral-500 mt-2">
                {getCurrentDirectionLabel(current.oceanCurrentDirection)} (
                {current.oceanCurrentDirection.toFixed(0)}°)
              </div>
            </div>

            {/* Sea Surface Temperature */}
            <div className="p-4 rounded-lg bg-orange-900/20 border border-zinc-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-400">
                  Sea Surface Temp
                </span>
                <svg
                  className="w-6 h-6 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold text-orange-400 mb-1">
                {current.seaSurfaceTemperature.toFixed(1)}°C
              </div>
              <div className="text-sm text-neutral-300">Water Temperature</div>
              <div className="text-xs text-neutral-500 mt-2">
                Affects marine life & operations
              </div>
            </div>

            {/* Sea Level */}
            <div className="p-4 rounded-lg bg-indigo-900/20 border border-zinc-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-400">
                  Sea Level (MSL)
                </span>
                <svg
                  className="w-6 h-6 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold text-indigo-400 mb-1">
                {current.seaLevelHeightMsl >= 0 ? "+" : ""}
                {current.seaLevelHeightMsl.toFixed(2)}m
              </div>
              <div className="text-sm text-neutral-300">
                Tides & Pressure Effects
              </div>
              <div className="text-xs text-neutral-500 mt-2">
                Accounts for ocean tides
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wave Analysis Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Wind Waves */}
        <Card className="bg-zinc-900/90 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Wind Waves
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Height</span>
              <span className="text-lg font-semibold text-white">
                {current.windWaveHeight.toFixed(2)}m
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Direction</span>
              <span className="text-lg font-semibold text-emerald-400">
                {getWaveDirectionLabel(current.windWaveDirection)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Period</span>
              <span className="text-lg font-semibold text-white">
                {current.windWavePeriod.toFixed(1)}s
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Peak Period</span>
              <span className="text-lg font-semibold text-white">
                {current.windWavePeakPeriod.toFixed(1)}s
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Swell Waves */}
        <Card className="bg-zinc-900/90 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              Primary Swell
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Height</span>
              <span className="text-lg font-semibold text-white">
                {current.swellWaveHeight.toFixed(2)}m
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Direction</span>
              <span className="text-lg font-semibold text-emerald-400">
                {getWaveDirectionLabel(current.swellWaveDirection)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Period</span>
              <span className="text-lg font-semibold text-white">
                {current.swellWavePeriod.toFixed(1)}s
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Peak Period</span>
              <span className="text-lg font-semibold text-white">
                {current.swellWavePeakPeriod.toFixed(1)}s
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Swell */}
        <Card className="bg-zinc-900/90 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              Secondary Swell
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Height</span>
              <span className="text-lg font-semibold text-white">
                {current.secondarySwellWaveHeight.toFixed(2)}m
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Direction</span>
              <span className="text-lg font-semibold text-emerald-400">
                {getWaveDirectionLabel(current.secondarySwellWaveDirection)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Period</span>
              <span className="text-lg font-semibold text-white">
                {current.secondarySwellWavePeriod.toFixed(1)}s
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Tertiary Height</span>
              <span className="text-lg font-semibold text-neutral-400">
                {current.tertiarySwellWaveHeight.toFixed(2)}m
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 48-Hour Forecast Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Wave Heights Comparison */}
        <Card className="bg-zinc-900/90 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">
              48-Hour Wave Heights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis
                  dataKey="time"
                  stroke="#a1a1aa"
                  tick={{ fill: "#a1a1aa", fontSize: 10 }}
                  interval={5}
                />
                <YAxis
                  stroke="#a1a1aa"
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  label={{
                    value: "meters",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#a1a1aa",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="waveHeight"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="Total Wave"
                  unit="m"
                />
                <Line
                  type="monotone"
                  dataKey="windWaveHeight"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  name="Wind Wave"
                  unit="m"
                />
                <Line
                  type="monotone"
                  dataKey="swellWaveHeight"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={false}
                  name="Swell Wave"
                  unit="m"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ocean Current Velocity */}
        <Card className="bg-zinc-900/90 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">
              48-Hour Ocean Current
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsAreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="currentGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis
                  dataKey="time"
                  stroke="#a1a1aa"
                  tick={{ fill: "#a1a1aa", fontSize: 10 }}
                  interval={5}
                />
                <YAxis
                  stroke="#a1a1aa"
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  label={{
                    value: "km/h",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#a1a1aa",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="oceanCurrentVelocity"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="url(#currentGradient)"
                  name="Current Velocity"
                  unit=" km/h"
                />
              </RechartsAreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sea Surface Temperature */}
        <Card className="bg-zinc-900/90 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">
              48-Hour Sea Surface Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis
                  dataKey="time"
                  stroke="#a1a1aa"
                  tick={{ fill: "#a1a1aa", fontSize: 10 }}
                  interval={5}
                />
                <YAxis
                  stroke="#a1a1aa"
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  label={{
                    value: "°C",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#a1a1aa",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="seaSurfaceTemp"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: "#f59e0b", r: 2 }}
                  name="SST"
                  unit="°C"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sea Level Height */}
        <Card className="bg-zinc-900/90 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">
              48-Hour Sea Level Height (MSL)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis
                  dataKey="time"
                  stroke="#a1a1aa"
                  tick={{ fill: "#a1a1aa", fontSize: 10 }}
                  interval={5}
                />
                <YAxis
                  stroke="#a1a1aa"
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  label={{
                    value: "meters",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#a1a1aa",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="seaLevelHeight"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: "#6366f1", r: 3 }}
                  name="Sea Level"
                  unit="m"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Hourly Marine Forecast Table */}
      <Card className="bg-zinc-900/90 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">
            Detailed 48-Hour Marine Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-zinc-800 z-10">
                <tr className="text-neutral-400 border-b border-zinc-700">
                  <th className="text-left py-2 px-3 whitespace-nowrap">
                    Time
                  </th>
                  <th className="text-right py-2 px-3 whitespace-nowrap">
                    Wave
                  </th>
                  <th className="text-right py-2 px-3 whitespace-nowrap">
                    Wind Wave
                  </th>
                  <th className="text-right py-2 px-3 whitespace-nowrap">
                    Swell
                  </th>
                  <th className="text-right py-2 px-3 whitespace-nowrap">
                    Period
                  </th>
                  <th className="text-center py-2 px-3 whitespace-nowrap">
                    Wave Dir
                  </th>
                  <th className="text-right py-2 px-3 whitespace-nowrap">
                    Current
                  </th>
                  <th className="text-center py-2 px-3 whitespace-nowrap">
                    Curr Dir
                  </th>
                  <th className="text-right py-2 px-3 whitespace-nowrap">
                    SST
                  </th>
                  <th className="text-right py-2 px-3 whitespace-nowrap">
                    Sea Level
                  </th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="py-1.5 px-3 text-neutral-300 whitespace-nowrap">
                      {row.time}
                    </td>
                    <td className="py-1.5 px-3 text-right text-white font-medium">
                      {row.waveHeight}m
                    </td>
                    <td className="py-1.5 px-3 text-right text-green-400">
                      {row.windWaveHeight}m
                    </td>
                    <td className="py-1.5 px-3 text-right text-cyan-400">
                      {row.swellWaveHeight}m
                    </td>
                    <td className="py-1.5 px-3 text-right text-white">
                      {row.wavePeriod}s
                    </td>
                    <td className="py-1.5 px-3 text-center text-emerald-400">
                      {row.waveDirection}
                    </td>
                    <td className="py-1.5 px-3 text-right text-cyan-400">
                      {row.oceanCurrentVelocity} km/h
                    </td>
                    <td className="py-1.5 px-3 text-center text-emerald-400">
                      {row.currentDirection}
                    </td>
                    <td className="py-1.5 px-3 text-right text-orange-400">
                      {row.seaSurfaceTemp}°C
                    </td>
                    <td className="py-1.5 px-3 text-right text-indigo-400">
                      {row.seaLevelHeight}m
                    </td>
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
            Marine data provided by{" "}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Open-Meteo Marine API
            </a>{" "}
            · Optimized for maritime operations · Data updates hourly
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
