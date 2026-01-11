import {
  TimeSeriesDataPoint,
  CategoryDataPoint,
  DistributionDataPoint,
  ScatterDataPoint,
  CorrelationDataPoint,
  WeatherData,
} from '../types/chart.types';
import {
  timeSeriesData as sampleTimeSeriesData,
  categoryData as sampleCategoryData,
  distributionData as sampleDistributionData,
  scatterData as sampleScatterData,
  correlationData as sampleCorrelationData,
} from '../data/sampleData';

/**
 * Service layer for data fetching
 * Currently returns sample data, but can be easily extended to fetch from API
 */

/**
 * Fetches time series data from the server
 * @returns Promise<TimeSeriesDataPoint[]> Array of time series data points
 */
export async function getTimeSeriesData(): Promise<TimeSeriesDataPoint[]> {
  // TODO: Replace with actual API call
  // Example: const response = await fetch('/api/time-series');
  // return await response.json();
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  return sampleTimeSeriesData;
}

/**
 * Fetches category comparison data from the server
 * @returns Promise<CategoryDataPoint[]> Array of category data points
 */
export async function getCategoryData(): Promise<CategoryDataPoint[]> {
  // TODO: Replace with actual API call
  // Example: const response = await fetch('/api/categories');
  // return await response.json();
  
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  return sampleCategoryData;
}

/**
 * Fetches distribution data from the server
 * @returns Promise<DistributionDataPoint[]> Array of distribution data points
 */
export async function getDistributionData(): Promise<DistributionDataPoint[]> {
  // TODO: Replace with actual API call
  // Example: const response = await fetch('/api/distribution');
  // return await response.json();
  
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  return sampleDistributionData;
}

/**
 * Fetches scatter plot data from the server
 * @returns Promise<ScatterDataPoint[]> Array of scatter data points
 */
export async function getScatterData(): Promise<ScatterDataPoint[]> {
  // TODO: Replace with actual API call
  // Example: const response = await fetch('/api/scatter');
  // return await response.json();
  
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  return sampleScatterData;
}

/**
 * Fetches correlation data from the server
 * @returns Promise<CorrelationDataPoint[]> Array of correlation data points
 */
export async function getCorrelationData(): Promise<CorrelationDataPoint[]> {
  // TODO: Replace with actual API call
  // Example: const response = await fetch('/api/correlation');
  // return await response.json();
  
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  return sampleCorrelationData;
}

/**
 * Fetches all chart data at once
 * @returns Promise with all chart datasets
 */
export async function getAllChartData() {
  const [timeSeries, categories, distribution, scatter, correlation] =
    await Promise.all([
      getTimeSeriesData(),
      getCategoryData(),
      getDistributionData(),
      getScatterData(),
      getCorrelationData(),
    ]);

  return {
    timeSeries,
    categories,
    distribution,
    scatter,
    correlation,
  };
}

/**
 * Helper function to get weather icon emoji based on condition code
 */
function getWeatherIcon(conditionCode: string, condition: string): string {
  const code = parseInt(conditionCode);
  
  // Thunderstorm
  if (code >= 200 && code < 300) return '⛈️';
  // Drizzle
  if (code >= 300 && code < 400) return '🌦️';
  // Rain
  if (code >= 500 && code < 600) return '🌧️';
  // Snow
  if (code >= 600 && code < 700) return '❄️';
  // Atmosphere (mist, fog, etc.)
  if (code >= 700 && code < 800) return '🌫️';
  // Clear
  if (code === 800) return '☀️';
  // Clouds
  if (code === 801) return '🌤️'; // Few clouds
  if (code === 802) return '⛅'; // Scattered clouds
  if (code >= 803 && code < 900) return '☁️'; // Broken/Overcast clouds
  
  // Fallback based on condition text
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) return '☀️';
  if (lowerCondition.includes('cloud')) return '☁️';
  if (lowerCondition.includes('rain')) return '🌧️';
  if (lowerCondition.includes('snow')) return '❄️';
  if (lowerCondition.includes('storm')) return '⛈️';
  
  return '🌤️';
}

/**
 * Fetches real-time weather data from OpenWeatherMap API
 * @param location Optional location parameter (city name, e.g., "Turku" or "Turku,FI")
 * @returns Promise<WeatherData> Weather data object
 */
export async function getWeatherData(location?: string): Promise<WeatherData> {
  const apiKey = "dcfe11d5dbc553237ade0cc97934f5cc";
  const defaultLocation = location || 'Turku,FI';
  
  // If no API key is provided, return sample data
  if (!apiKey) {
    console.warn('WEATHER_API_KEY not found. Using sample data.');
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    return {
      location: defaultLocation,
      temperature: Math.round(Math.random() * 15 + 5),
      feelsLike: Math.round(Math.random() * 15 + 3),
      condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
      icon: '☀️',
      humidity: Math.round(Math.random() * 40 + 50),
      windSpeed: Math.round(Math.random() * 15 + 5),
      windDirection: Math.round(Math.random() * 360),
      pressure: Math.round(Math.random() * 20 + 1000),
      visibility: Math.round(Math.random() * 5 + 8),
      uvIndex: Math.round(Math.random() * 6 + 2),
      lastUpdated: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }),
    };
  }

  try {
    // OpenWeatherMap Current Weather API
    // Documentation: https://openweathermap.org/api/current
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(defaultLocation)}&appid=${apiKey}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Map OpenWeatherMap response to our WeatherData interface
    const weatherData: WeatherData = {
      location: `${data.name}, ${data.sys.country}`,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      icon: getWeatherIcon(data.weather[0].id.toString(), data.weather[0].main),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: data.wind.deg || 0,
      pressure: Math.round(data.main.pressure),
      visibility: data.visibility ? Math.round(data.visibility / 1000) : 10, // Convert m to km
      uvIndex: 0, // UV index requires separate API call (One Call API)
      lastUpdated: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }),
    };
    console.log(weatherData);
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data from API:', error);
    
    // Fallback to sample data on error
    return {
      location: defaultLocation,
      temperature: Math.round(Math.random() * 15 + 5),
      feelsLike: Math.round(Math.random() * 15 + 3),
      condition: 'Unable to fetch',
      icon: '🌤️',
      humidity: 0,
      windSpeed: 0,
      windDirection: 0,
      pressure: 0,
      visibility: 0,
      uvIndex: 0,
      lastUpdated: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }),
    };
  }
}

