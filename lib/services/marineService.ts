/**
 * Marine Weather Service - OpenMeteo Marine API Integration
 * 
 * Provides comprehensive marine weather data for vessel operations including
 * waves, ocean currents, sea surface temperature, and sea level height.
 */

import { fetchWeatherApi } from "openmeteo";
import { type WeatherLocation, CITIES } from "./weatherService";

export interface CurrentMarine {
  time: Date;
  waveHeight: number;
  waveDirection: number;
  wavePeriod: number;
  wavePeakPeriod: number;
  windWaveHeight: number;
  windWaveDirection: number;
  windWavePeriod: number;
  windWavePeakPeriod: number;
  swellWaveHeight: number;
  swellWaveDirection: number;
  swellWavePeriod: number;
  swellWavePeakPeriod: number;
  secondarySwellWaveHeight: number;
  secondarySwellWavePeriod: number;
  secondarySwellWaveDirection: number;
  tertiarySwellWaveHeight: number;
  tertiarySwellWavePeriod: number;
  tertiarySwellWaveDirection: number;
  oceanCurrentVelocity: number;
  oceanCurrentDirection: number;
  seaSurfaceTemperature: number;
  seaLevelHeightMsl: number;
}

export interface HourlyMarineData {
  time: Date[];
  waveHeight: Float32Array;
  waveDirection: Float32Array;
  wavePeriod: Float32Array;
  wavePeakPeriod: Float32Array;
  windWaveHeight: Float32Array;
  windWaveDirection: Float32Array;
  windWavePeriod: Float32Array;
  windWavePeakPeriod: Float32Array;
  swellWaveHeight: Float32Array;
  swellWaveDirection: Float32Array;
  swellWavePeriod: Float32Array;
  swellWavePeakPeriod: Float32Array;
  secondarySwellWaveHeight: Float32Array;
  secondarySwellWavePeriod: Float32Array;
  secondarySwellWaveDirection: Float32Array;
  tertiarySwellWaveHeight: Float32Array;
  tertiarySwellWavePeriod: Float32Array;
  tertiarySwellWaveDirection: Float32Array;
  seaLevelHeightMsl: Float32Array;
  seaSurfaceTemperature: Float32Array;
  oceanCurrentVelocity: Float32Array;
  oceanCurrentDirection: Float32Array;
}

export interface MarineData {
  location: {
    latitude: number;
    longitude: number;
    elevation: number;
    timezone: string;
  };
  current: CurrentMarine;
  hourly: HourlyMarineData;
}

/**
 * Fetch marine weather data for a specific location
 * @param location - Latitude and longitude coordinates
 * @returns Processed marine weather data
 */
export async function fetchMarineData(
  location: WeatherLocation
): Promise<MarineData> {
  const params = {
    latitude: location.latitude,
    longitude: location.longitude,
    hourly: [
      "wave_height",
      "wave_direction",
      "wave_period",
      "wave_peak_period",
      "wind_wave_height",
      "wind_wave_direction",
      "wind_wave_period",
      "wind_wave_peak_period",
      "swell_wave_height",
      "swell_wave_direction",
      "swell_wave_period",
      "swell_wave_peak_period",
      "secondary_swell_wave_height",
      "secondary_swell_wave_period",
      "secondary_swell_wave_direction",
      "tertiary_swell_wave_height",
      "tertiary_swell_wave_period",
      "tertiary_swell_wave_direction",
      "sea_level_height_msl",
      "sea_surface_temperature",
      "ocean_current_velocity",
      "ocean_current_direction",
    ],
    current: [
      "wave_direction",
      "wave_height",
      "wave_period",
      "wave_peak_period",
      "swell_wave_peak_period",
      "swell_wave_period",
      "swell_wave_direction",
      "swell_wave_height",
      "wind_wave_peak_period",
      "wind_wave_period",
      "wind_wave_direction",
      "wind_wave_height",
      "secondary_swell_wave_height",
      "secondary_swell_wave_period",
      "secondary_swell_wave_direction",
      "tertiary_swell_wave_height",
      "tertiary_swell_wave_period",
      "tertiary_swell_wave_direction",
      "ocean_current_direction",
      "ocean_current_velocity",
      "sea_surface_temperature",
      "sea_level_height_msl",
    ],
    timezone: "auto",
    forecast_days: 7,
    length_unit: "metric",
    cell_selection: "sea", // Prefer sea grid-cells for marine data
  };

  const url = "https://marine-api.open-meteo.com/v1/marine";
  const responses = await fetchWeatherApi(url, params);
  const response = responses[0];

  // Extract location info
  const latitude = response.latitude();
  const longitude = response.longitude();
  const elevation = response.elevation();
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const timezone = response.timezone();

  // Process current marine data
  const current = response.current()!;
  const currentMarine: CurrentMarine = {
    time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
    waveDirection: current.variables(0)!.value(),
    waveHeight: current.variables(1)!.value(),
    wavePeriod: current.variables(2)!.value(),
    wavePeakPeriod: current.variables(3)!.value(),
    swellWavePeakPeriod: current.variables(4)!.value(),
    swellWavePeriod: current.variables(5)!.value(),
    swellWaveDirection: current.variables(6)!.value(),
    swellWaveHeight: current.variables(7)!.value(),
    windWavePeakPeriod: current.variables(8)!.value(),
    windWavePeriod: current.variables(9)!.value(),
    windWaveDirection: current.variables(10)!.value(),
    windWaveHeight: current.variables(11)!.value(),
    secondarySwellWaveHeight: current.variables(12)!.value(),
    secondarySwellWavePeriod: current.variables(13)!.value(),
    secondarySwellWaveDirection: current.variables(14)!.value(),
    tertiarySwellWaveHeight: current.variables(15)!.value(),
    tertiarySwellWavePeriod: current.variables(16)!.value(),
    tertiarySwellWaveDirection: current.variables(17)!.value(),
    oceanCurrentDirection: current.variables(18)!.value(),
    oceanCurrentVelocity: current.variables(19)!.value(),
    seaSurfaceTemperature: current.variables(20)!.value(),
    seaLevelHeightMsl: current.variables(21)!.value(),
  };

  // Process hourly marine data
  const hourly = response.hourly()!;
  const timeArray = Array.from(
    { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
    (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
  );

  const hourlyData: HourlyMarineData = {
    time: timeArray,
    waveHeight: hourly.variables(0)!.valuesArray()!,
    waveDirection: hourly.variables(1)!.valuesArray()!,
    wavePeriod: hourly.variables(2)!.valuesArray()!,
    wavePeakPeriod: hourly.variables(3)!.valuesArray()!,
    windWaveHeight: hourly.variables(4)!.valuesArray()!,
    windWaveDirection: hourly.variables(5)!.valuesArray()!,
    windWavePeriod: hourly.variables(6)!.valuesArray()!,
    windWavePeakPeriod: hourly.variables(7)!.valuesArray()!,
    swellWaveHeight: hourly.variables(8)!.valuesArray()!,
    swellWaveDirection: hourly.variables(9)!.valuesArray()!,
    swellWavePeriod: hourly.variables(10)!.valuesArray()!,
    swellWavePeakPeriod: hourly.variables(11)!.valuesArray()!,
    secondarySwellWaveHeight: hourly.variables(12)!.valuesArray()!,
    secondarySwellWavePeriod: hourly.variables(13)!.valuesArray()!,
    secondarySwellWaveDirection: hourly.variables(14)!.valuesArray()!,
    tertiarySwellWaveHeight: hourly.variables(15)!.valuesArray()!,
    tertiarySwellWavePeriod: hourly.variables(16)!.valuesArray()!,
    tertiarySwellWaveDirection: hourly.variables(17)!.valuesArray()!,
    seaLevelHeightMsl: hourly.variables(18)!.valuesArray()!,
    seaSurfaceTemperature: hourly.variables(19)!.valuesArray()!,
    oceanCurrentVelocity: hourly.variables(20)!.valuesArray()!,
    oceanCurrentDirection: hourly.variables(21)!.valuesArray()!,
  };

  return {
    location: {
      latitude,
      longitude,
      elevation,
      timezone: timezone || "UTC",
    },
    current: currentMarine,
    hourly: hourlyData,
  };
}

/**
 * Get wave direction label from degrees
 * Waves come FROM the indicated direction
 */
export function getWaveDirectionLabel(degrees: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/**
 * Get ocean current direction label from degrees
 * Current flows TOWARDS the indicated direction
 */
export function getCurrentDirectionLabel(degrees: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/**
 * Get Beaufort scale description for wave height
 */
export function getSeaStateDescription(waveHeight: number): string {
  if (waveHeight < 0.1) return "Calm (Glassy)";
  if (waveHeight < 0.5) return "Calm (Rippled)";
  if (waveHeight < 1.25) return "Smooth";
  if (waveHeight < 2.5) return "Slight";
  if (waveHeight < 4) return "Moderate";
  if (waveHeight < 6) return "Rough";
  if (waveHeight < 9) return "Very Rough";
  if (waveHeight < 14) return "High";
  return "Very High";
}

/**
 * Get wave severity level (0-4) for UI styling
 */
export function getWaveSeverity(waveHeight: number): number {
  if (waveHeight < 1.25) return 0; // Calm/Smooth
  if (waveHeight < 2.5) return 1;  // Slight
  if (waveHeight < 4) return 2;    // Moderate
  if (waveHeight < 6) return 3;    // Rough
  return 4;                         // Very Rough+
}
