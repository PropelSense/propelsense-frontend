/**
 * Weather Service - OpenMeteo API Integration
 * 
 * Provides weather data for maritime operations using OpenMeteo free API.
 * Focuses on parameters relevant for vessel propulsion and navigation.
 */

import { fetchWeatherApi } from "openmeteo";

export interface WeatherLocation {
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  pressure: number;
  precipitation: number;
  weatherCode: number;
  visibility: number;
  cloudCover: number;
}

export interface HourlyWeatherData {
  time: Date[];
  temperature: Float32Array;
  apparentTemperature: Float32Array;
  dewPoint: Float32Array;
  humidity: Float32Array;
  precipitation: Float32Array;
  precipitationProbability: Float32Array;
  rain: Float32Array;
  showers: Float32Array;
  snowfall: Float32Array;
  snowDepth: Float32Array;
  windSpeed: Float32Array;
  windDirection: Float32Array;
  windGusts: Float32Array;
  windSpeed80m: Float32Array;
  windSpeed120m: Float32Array;
  windSpeed180m: Float32Array;
  windDirection80m: Float32Array;
  windDirection120m: Float32Array;
  windDirection180m: Float32Array;
  temperature80m: Float32Array;
  temperature120m: Float32Array;
  temperature180m: Float32Array;
  pressure: Float32Array;
  surfacePressure: Float32Array;
  visibility: Float32Array;
  cloudCover: Float32Array;
  cloudCoverLow: Float32Array;
  cloudCoverMid: Float32Array;
  cloudCoverHigh: Float32Array;
  evapotranspiration: Float32Array;
  et0FaoEvapotranspiration: Float32Array;
  vapourPressureDeficit: Float32Array;
  weatherCode: Float32Array;
  soilTemperature0cm: Float32Array;
  soilTemperature6cm: Float32Array;
  soilTemperature18cm: Float32Array;
  soilTemperature54cm: Float32Array;
  soilMoisture0To1cm: Float32Array;
  soilMoisture1To3cm: Float32Array;
  soilMoisture3To9cm: Float32Array;
  soilMoisture9To27cm: Float32Array;
  soilMoisture27To81cm: Float32Array;
}

export interface WeatherData {
  location: {
    latitude: number;
    longitude: number;
    elevation: number;
    timezone: string;
  };
  current: CurrentWeather;
  hourly: HourlyWeatherData;
}

/**
 * Get weather description from WMO weather code
 */
export function getWeatherDescription(code: number): string {
  const weatherCodes: { [key: number]: string } = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

  return weatherCodes[code] || "Unknown";
}

/**
 * Fetch weather data for a specific location
 * @param location - Latitude and longitude coordinates
 * @returns Processed weather data
 */
export async function fetchWeatherData(
  location: WeatherLocation
): Promise<WeatherData> {
  const params = {
    latitude: location.latitude,
    longitude: location.longitude,
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "weather_code",
      "cloud_cover",
      "pressure_msl",
      "wind_speed_10m",
      "wind_direction_10m",
      "wind_gusts_10m",
    ],
    hourly: [
      "temperature_2m",
      "relative_humidity_2m",
      "dew_point_2m",
      "apparent_temperature",
      "precipitation_probability",
      "precipitation",
      "rain",
      "showers",
      "snowfall",
      "snow_depth",
      "weather_code",
      "surface_pressure",
      "pressure_msl",
      "cloud_cover",
      "cloud_cover_low",
      "cloud_cover_mid",
      "cloud_cover_high",
      "visibility",
      "evapotranspiration",
      "et0_fao_evapotranspiration",
      "vapour_pressure_deficit",
      "temperature_180m",
      "temperature_120m",
      "temperature_80m",
      "wind_gusts_10m",
      "wind_direction_180m",
      "wind_direction_120m",
      "wind_direction_80m",
      "wind_direction_10m",
      "wind_speed_120m",
      "wind_speed_180m",
      "wind_speed_80m",
      "wind_speed_10m",
      "soil_temperature_0cm",
      "soil_temperature_6cm",
      "soil_temperature_18cm",
      "soil_temperature_54cm",
      "soil_moisture_0_to_1cm",
      "soil_moisture_1_to_3cm",
      "soil_moisture_9_to_27cm",
      "soil_moisture_27_to_81cm",
      "soil_moisture_3_to_9cm",
    ],
    timezone: "auto",
    forecast_days: 7,
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);
  const response = responses[0];

  // Extract location info
  const latitude = response.latitude();
  const longitude = response.longitude();
  const elevation = response.elevation();
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const timezone = response.timezone();

  // Process current weather
  const current = response.current()!;
  const currentWeather: CurrentWeather = {
    temperature: current.variables(0)!.value(),
    humidity: current.variables(1)!.value(),
    apparentTemperature: current.variables(2)!.value(),
    precipitation: current.variables(3)!.value(),
    weatherCode: current.variables(4)!.value(),
    cloudCover: current.variables(5)!.value(),
    pressure: current.variables(6)!.value(),
    windSpeed: current.variables(7)!.value(),
    windDirection: current.variables(8)!.value(),
    windGusts: current.variables(9)!.value(),
    visibility: 0, // Not available in current, will use latest hourly
  };

  // Process hourly data
  const hourly = response.hourly()!;
  const timeArray = Array.from(
    { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
    (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
  );

  const hourlyData: HourlyWeatherData = {
    time: timeArray,
    temperature: hourly.variables(0)!.valuesArray()!,
    humidity: hourly.variables(1)!.valuesArray()!,
    dewPoint: hourly.variables(2)!.valuesArray()!,
    apparentTemperature: hourly.variables(3)!.valuesArray()!,
    precipitationProbability: hourly.variables(4)!.valuesArray()!,
    precipitation: hourly.variables(5)!.valuesArray()!,
    rain: hourly.variables(6)!.valuesArray()!,
    showers: hourly.variables(7)!.valuesArray()!,
    snowfall: hourly.variables(8)!.valuesArray()!,
    snowDepth: hourly.variables(9)!.valuesArray()!,
    weatherCode: hourly.variables(10)!.valuesArray()!,
    surfacePressure: hourly.variables(11)!.valuesArray()!,
    pressure: hourly.variables(12)!.valuesArray()!,
    cloudCover: hourly.variables(13)!.valuesArray()!,
    cloudCoverLow: hourly.variables(14)!.valuesArray()!,
    cloudCoverMid: hourly.variables(15)!.valuesArray()!,
    cloudCoverHigh: hourly.variables(16)!.valuesArray()!,
    visibility: hourly.variables(17)!.valuesArray()!,
    evapotranspiration: hourly.variables(18)!.valuesArray()!,
    et0FaoEvapotranspiration: hourly.variables(19)!.valuesArray()!,
    vapourPressureDeficit: hourly.variables(20)!.valuesArray()!,
    temperature180m: hourly.variables(21)!.valuesArray()!,
    temperature120m: hourly.variables(22)!.valuesArray()!,
    temperature80m: hourly.variables(23)!.valuesArray()!,
    windGusts: hourly.variables(24)!.valuesArray()!,
    windDirection180m: hourly.variables(25)!.valuesArray()!,
    windDirection120m: hourly.variables(26)!.valuesArray()!,
    windDirection80m: hourly.variables(27)!.valuesArray()!,
    windDirection: hourly.variables(28)!.valuesArray()!,
    windSpeed120m: hourly.variables(29)!.valuesArray()!,
    windSpeed180m: hourly.variables(30)!.valuesArray()!,
    windSpeed80m: hourly.variables(31)!.valuesArray()!,
    windSpeed: hourly.variables(32)!.valuesArray()!,
    soilTemperature0cm: hourly.variables(33)!.valuesArray()!,
    soilTemperature6cm: hourly.variables(34)!.valuesArray()!,
    soilTemperature18cm: hourly.variables(35)!.valuesArray()!,
    soilTemperature54cm: hourly.variables(36)!.valuesArray()!,
    soilMoisture0To1cm: hourly.variables(37)!.valuesArray()!,
    soilMoisture1To3cm: hourly.variables(38)!.valuesArray()!,
    soilMoisture9To27cm: hourly.variables(39)!.valuesArray()!,
    soilMoisture27To81cm: hourly.variables(40)!.valuesArray()!,
    soilMoisture3To9cm: hourly.variables(41)!.valuesArray()!,
  };

  // Update current visibility from hourly data (latest value)
  if (hourlyData.visibility.length > 0) {
    currentWeather.visibility = hourlyData.visibility[0];
  }

  return {
    location: {
      latitude,
      longitude,
      elevation,
      timezone: timezone || "UTC",
    },
    current: currentWeather,
    hourly: hourlyData,
  };
}

/**
 * Get wind direction label from degrees
 */
export function getWindDirectionLabel(degrees: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/**
 * Predefined city locations for weather data
 */
export interface City {
  name: string;
  location: WeatherLocation;
  country: string;
}

export const CITIES: City[] = [
  {
    name: "Turku",
    location: { latitude: 60.4515, longitude: 22.2687 },
    country: "Finland",
  },
  // More cities can be added here in the future
  // {
  //   name: "Helsinki",
  //   location: { latitude: 60.1699, longitude: 24.9384 },
  //   country: "Finland",
  // },
  // {
  //   name: "Stockholm",
  //   location: { latitude: 59.3293, longitude: 18.0686 },
  //   country: "Sweden",
  // },
];

/**
 * Default location (Turku, Finland - major maritime port)
 */
export const DEFAULT_LOCATION: WeatherLocation = CITIES[0].location;
