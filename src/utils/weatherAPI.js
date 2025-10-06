// Weather API Integration and Mock Data Service
// This utility provides weather data for calendar dates and outfit planning

import { Sun, Cloud, CloudRain, Snowflake } from 'lucide-react';

// Mock weather API that simulates real weather data
export class WeatherService {
  constructor() {
    this.cache = new Map();
    this.baseWeatherPatterns = [
      { condition: 'Sunny', probability: 0.3, tempRange: [21, 29] }, // 70-85°F -> 21-29°C
      { condition: 'Cloudy', probability: 0.25, tempRange: [16, 24] }, // 60-75°F -> 16-24°C
      { condition: 'Rainy', probability: 0.25, tempRange: [13, 21] }, // 55-70°F -> 13-21°C
      { condition: 'Cold', probability: 0.2, tempRange: [2, 13] } // 35-55°F -> 2-13°C
    ];
  }

  // Generate realistic weather forecast for multiple days
  generateForecast(days = 14, location = 'Karnataka') {
    const forecast = {};
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateKey = date.toDateString();
      
      // Use cached data if available
      if (this.cache.has(dateKey)) {
        forecast[dateKey] = this.cache.get(dateKey);
        continue;
      }
      
      // Generate weather based on seasonal patterns
      const weather = this.generateDayWeather(date, location);
      forecast[dateKey] = weather;
      this.cache.set(dateKey, weather);
    }
    
    return forecast;
  }

  // Generate weather for a specific day
  generateDayWeather(date, location = 'Karnataka') {
    const month = date.getMonth();
    const season = this.getSeason(month);
    
    // Adjust weather patterns based on season
    const seasonalPatterns = this.getSeasonalPatterns(season);
    const selectedPattern = this.selectWeatherPattern(seasonalPatterns);
    
    // Generate temperature with some randomness
    const tempRange = selectedPattern.tempRange;
    const baseTemp = Math.floor(Math.random() * (tempRange[1] - tempRange[0])) + tempRange[0];
    
    // Add daily variation
    const variation = Math.floor(Math.random() * 6) - 3; // ±3 degrees Celsius
    const finalTemp = Math.max(-1, Math.min(38, baseTemp + variation)); // -1°C to 38°C range
    
    // Generate additional weather details
    const weather = {
      condition: selectedPattern.condition,
      temp: finalTemp,
      location: location,
      humidity: this.generateHumidity(selectedPattern.condition),
      windSpeed: this.generateWindSpeed(),
      uvIndex: this.generateUVIndex(selectedPattern.condition),
      precipitation: this.generatePrecipitation(selectedPattern.condition),
      icon: this.getWeatherIcon(selectedPattern.condition),
      description: this.getWeatherDescription(selectedPattern.condition, finalTemp),
      hourlyForecast: this.generateHourlyForecast(selectedPattern, finalTemp)
    };
    
    return weather;
  }

  // Determine season based on month
  getSeason(month) {
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }

  // Get seasonal weather patterns
  getSeasonalPatterns(season) {
    const patterns = {
      spring: [
        { condition: 'Sunny', probability: 0.4, tempRange: [18, 27] }, // 65-80°F -> 18-27°C
        { condition: 'Cloudy', probability: 0.3, tempRange: [16, 24] }, // 60-75°F -> 16-24°C
        { condition: 'Rainy', probability: 0.3, tempRange: [13, 21] } // 55-70°F -> 13-21°C
      ],
      summer: [
        { condition: 'Sunny', probability: 0.6, tempRange: [24, 35] }, // 75-95°F -> 24-35°C
        { condition: 'Cloudy', probability: 0.25, tempRange: [21, 29] }, // 70-85°F -> 21-29°C
        { condition: 'Rainy', probability: 0.15, tempRange: [18, 27] } // 65-80°F -> 18-27°C
      ],
      fall: [
        { condition: 'Cloudy', probability: 0.4, tempRange: [13, 24] }, // 55-75°F -> 13-24°C
        { condition: 'Sunny', probability: 0.3, tempRange: [16, 27] }, // 60-80°F -> 16-27°C
        { condition: 'Rainy', probability: 0.3, tempRange: [10, 18] } // 50-65°F -> 10-18°C
      ],
      winter: [
        { condition: 'Cold', probability: 0.4, tempRange: [-1, 10] }, // 30-50°F -> -1-10°C
        { condition: 'Cloudy', probability: 0.35, tempRange: [2, 13] }, // 35-55°F -> 2-13°C
        { condition: 'Sunny', probability: 0.25, tempRange: [4, 16] } // 40-60°F -> 4-16°C
      ]
    };
    
    return patterns[season] || patterns.spring;
  }

  // Select weather pattern based on probability
  selectWeatherPattern(patterns) {
    const random = Math.random();
    let cumulative = 0;
    
    for (const pattern of patterns) {
      cumulative += pattern.probability;
      if (random <= cumulative) {
        return pattern;
      }
    }
    
    return patterns[0]; // Fallback
  }

  // Generate humidity based on weather condition
  generateHumidity(condition) {
    const ranges = {
      'Sunny': [30, 50],
      'Cloudy': [50, 70],
      'Rainy': [70, 90],
      'Cold': [40, 60]
    };
    
    const range = ranges[condition] || [40, 60];
    return Math.floor(Math.random() * (range[1] - range[0])) + range[0];
  }

  // Generate wind speed
  generateWindSpeed() {
    return Math.floor(Math.random() * 15) + 3; // 3-18 mph
  }

  // Generate UV index
  generateUVIndex(condition) {
    const ranges = {
      'Sunny': [7, 10],
      'Cloudy': [3, 6],
      'Rainy': [1, 3],
      'Cold': [2, 5]
    };
    
    const range = ranges[condition] || [3, 6];
    return Math.floor(Math.random() * (range[1] - range[0])) + range[0];
  }

  // Generate precipitation chance
  generatePrecipitation(condition) {
    const chances = {
      'Sunny': Math.random() * 10, // 0-10%
      'Cloudy': Math.random() * 30 + 10, // 10-40%
      'Rainy': Math.random() * 40 + 60, // 60-100%
      'Cold': Math.random() * 20 + 10 // 10-30%
    };
    
    return Math.floor(chances[condition] || 20);
  }

  // Get weather icon
  getWeatherIcon(condition) {
    const icons = {
      'Sunny': Sun,
      'Cloudy': Cloud,
      'Rainy': CloudRain,
      'Cold': Snowflake
    };
    
    return icons[condition] || Cloud;
  }

  // Get weather description
  getWeatherDescription(condition, temp) {
    const descriptions = {
      'Sunny': temp > 27 ? 'Hot and sunny' : 'Bright and sunny', // 27°C = 80°F
      'Cloudy': 'Partly cloudy',
      'Rainy': 'Light rain expected',
      'Cold': temp < 4 ? 'Very cold' : 'Cool weather' // 4°C = 40°F
    };
    
    return descriptions[condition] || 'Pleasant weather';
  }

  // Generate hourly forecast for the day
  generateHourlyForecast(pattern, baseTemp) {
    const hourly = [];
    
    for (let hour = 0; hour < 24; hour++) {
      // Temperature variation throughout the day
      let tempVariation = 0;
      if (hour >= 6 && hour <= 18) {
        // Warmer during day
        tempVariation = Math.sin((hour - 6) * Math.PI / 12) * 8;
      } else {
        // Cooler at night
        tempVariation = -5;
      }
      
      hourly.push({
        hour: hour,
        temp: Math.round(baseTemp + tempVariation),
        condition: pattern.condition,
        precipitation: this.generatePrecipitation(pattern.condition)
      });
    }
    
    return hourly;
  }

  // Get weather for a specific date
  async getWeatherForDate(date, location = 'Karnataka') {
    const dateKey = date.toDateString();
    
    // Check cache first
    if (this.cache.has(dateKey)) {
      return this.cache.get(dateKey);
    }
    
    // Generate weather for this date
    const weather = this.generateDayWeather(date, location);
    this.cache.set(dateKey, weather);
    
    return weather;
  }

  // Get extended forecast
  async getExtendedForecast(days = 7, location = 'Karnataka') {
    return this.generateForecast(days, location);
  }

  // Clear cache (useful for testing or refreshing data)
  clearCache() {
    this.cache.clear();
  }

  // Get weather alerts (mock implementation)
  getWeatherAlerts(forecast) {
    const alerts = [];
    
    Object.entries(forecast).forEach(([dateKey, weather]) => {
      const date = new Date(dateKey);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Only check tomorrow's weather for alerts
      if (date.toDateString() === tomorrow.toDateString()) {
        if (weather.condition === 'Rainy') {
          alerts.push({
            type: 'rain',
            message: 'Rain expected tomorrow - plan waterproof outfits',
            severity: 'medium',
            date: dateKey
          });
        }
        
        if (weather.temp > 85) {
          alerts.push({
            type: 'heat',
            message: 'Hot weather tomorrow - choose breathable fabrics',
            severity: 'medium',
            date: dateKey
          });
        }
        
        if (weather.temp < 45) {
          alerts.push({
            type: 'cold',
            message: 'Cold weather tomorrow - layer up!',
            severity: 'high',
            date: dateKey
          });
        }
      }
    });
    
    return alerts;
  }
}

// Create a singleton instance
export const weatherService = new WeatherService();

// Utility functions for easy access
export const getWeatherForecast = (days = 14, location = 'Karnataka') => {
  return weatherService.generateForecast(days, location);
};

export const getWeatherForDate = async (date, location = 'Karnataka') => {
  return weatherService.getWeatherForDate(date, location);
};

export const getWeatherAlerts = (forecast) => {
  return weatherService.getWeatherAlerts(forecast);
};

// Weather condition mappings for outfit planning
export const weatherConditionMap = {
  'Sunny': 'Sunny',
  'Cloudy': 'Cloudy', 
  'Rainy': 'Rainy',
  'Cold': 'Cold'
};

// Export default service
export default weatherService;