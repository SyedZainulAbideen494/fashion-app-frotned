// Outfit Planning Logic - AI-powered recommendations based on weather and preferences

export const weatherOutfitMapping = {
  'Sunny': {
    temperature: {
      hot: { // 27°C+ (80°F+)
        casual: {
          name: 'Summer Breeze',
          items: ['Lightweight T-shirt', 'Linen shorts', 'Canvas sneakers', 'Sunglasses', 'Baseball cap'],
          colors: ['white', 'light blue', 'beige', 'pastel'],
          fabric: ['cotton', 'linen', 'bamboo'],
          style: 'relaxed'
        },
        formal: {
          name: 'Professional Summer',
          items: ['Breathable dress shirt', 'Lightweight chinos', 'Loafers', 'Minimal watch'],
          colors: ['white', 'light gray', 'navy'],
          fabric: ['cotton', 'linen blend'],
          style: 'business casual'
        },
        trendy: {
          name: 'Street Style Heat',
          items: ['Crop top', 'High-waisted shorts', 'White sneakers', 'Bucket hat', 'Crossbody bag'],
          colors: ['neon', 'white', 'pastels'],
          fabric: ['cotton', 'mesh'],
          style: 'streetwear'
        }
      },
      warm: { // 18-26°C (65-79°F)
        casual: {
          name: 'Perfect Day',
          items: ['Cotton t-shirt', 'Denim jeans', 'Sneakers', 'Light cardigan'],
          colors: ['any', 'denim blue'],
          fabric: ['cotton', 'denim'],
          style: 'classic casual'
        },
        formal: {
          name: 'Business Comfort',
          items: ['Button-down shirt', 'Dress pants', 'Oxford shoes', 'Blazer (optional)'],
          colors: ['white', 'blue', 'gray', 'navy'],
          fabric: ['cotton', 'wool blend'],
          style: 'business'
        }
      }
    },
    accessories: ['sunglasses', 'hat', 'light scarf'],
    avoid: ['heavy coats', 'wool sweaters', 'boots']
  },

  'Cloudy': {
    temperature: {
      mild: { // 16-24°C (60-75°F)
        casual: {
          name: 'Cozy Layers',
          items: ['Long-sleeve shirt', 'Light sweater', 'Jeans', 'Comfortable sneakers'],
          colors: ['earth tones', 'muted colors'],
          fabric: ['cotton', 'light wool'],
          style: 'layered casual'
        },
        formal: {
          name: 'Smart Layering',
          items: ['Dress shirt', 'Cardigan', 'Dress pants', 'Leather shoes'],
          colors: ['navy', 'gray', 'burgundy'],
          fabric: ['cotton', 'wool'],
          style: 'smart casual'
        }
      }
    },
    accessories: ['light jacket', 'scarf'],
    layering: true
  },

  'Rainy': {
    temperature: {
      any: {
        casual: {
          name: 'Rain Ready',
          items: ['Waterproof jacket', 'Quick-dry shirt', 'Water-resistant pants', 'Waterproof boots'],
          colors: ['dark colors', 'navy', 'black'],
          fabric: ['synthetic', 'treated cotton'],
          style: 'functional'
        },
        formal: {
          name: 'Professional Rain',
          items: ['Trench coat', 'Dress shirt', 'Dress pants', 'Leather boots', 'Umbrella'],
          colors: ['navy', 'black', 'khaki'],
          fabric: ['waterproof', 'wool'],
          style: 'business formal'
        }
      }
    },
    essential: ['umbrella', 'waterproof shoes', 'rain jacket'],
    avoid: ['suede', 'canvas shoes', 'light colors']
  },

  'Cold': {
    temperature: {
      cold: { // Below 10°C (50°F)
        casual: {
          name: 'Winter Warmth',
          items: ['Thermal base layer', 'Wool sweater', 'Heavy coat', 'Warm pants', 'Insulated boots'],
          colors: ['dark colors', 'burgundy', 'forest green'],
          fabric: ['wool', 'fleece', 'down'],
          style: 'layered warmth'
        },
        formal: {
          name: 'Executive Winter',
          items: ['Wool coat', 'Cashmere sweater', 'Dress pants', 'Leather boots', 'Scarf'],
          colors: ['charcoal', 'navy', 'camel'],
          fabric: ['wool', 'cashmere'],
          style: 'sophisticated'
        }
      }
    },
    essential: ['warm coat', 'gloves', 'scarf', 'warm boots'],
    layering: true
  }
};

// Generate AI-powered outfit recommendations based on weather
export const generateOutfitRecommendations = (weather, preferences = {}) => {
  const { condition = 'Sunny', temperature = 22, occasion = 'casual' } = weather;
  
  // Get base outfits for weather condition
  const weatherData = weatherOutfitMapping[condition] || weatherOutfitMapping['Sunny'];
  
  // Determine temperature category
  let tempCategory = 'warm';
  if (temperature >= 27) tempCategory = 'hot';
  else if (temperature <= 16) tempCategory = 'cold';
  else if (temperature <= 24) tempCategory = 'mild';
  
  // Get outfits for temperature
  const tempOutfits = weatherData.temperature[tempCategory] || weatherData.temperature.warm || weatherData.temperature.any;
  
  if (!tempOutfits) return [];
  
  // Convert to array format
  const outfits = Object.values(tempOutfits).map(outfit => ({
    ...outfit,
    suitability: calculateSuitability(weather, outfit),
    tips: generateStyleTips(weather, outfit)
  }));
  
  // Sort by suitability and return top recommendations
  return outfits.sort((a, b) => b.suitability - a.suitability).slice(0, 3);
};

// Calculate outfit suitability score
const calculateSuitability = (weather, outfit) => {
  let score = 70; // Base score
  
  // Weather appropriateness
  if (weather.condition === 'Rainy' && outfit.style === 'functional') score += 20;
  if (weather.condition === 'Sunny' && outfit.fabric?.includes('cotton')) score += 15;
  if (weather.temperature > 25 && outfit.fabric?.includes('linen')) score += 15;
  if (weather.temperature < 15 && outfit.fabric?.includes('wool')) score += 15;
  
  // Style preferences
  if (weather.occasion && outfit.style?.includes(weather.occasion)) score += 10;
  
  return Math.min(score, 100);
};

// Generate styling tips
const generateStyleTips = (weather, outfit) => {
  const tips = [];
  
  if (weather.condition === 'Sunny') {
    tips.push('Don\'t forget sunscreen and sunglasses');
    if (weather.temperature > 25) tips.push('Choose breathable fabrics');
  }
  
  if (weather.condition === 'Rainy') {
    tips.push('Carry an umbrella and wear waterproof shoes');
  }
  
  if (weather.condition === 'Cold') {
    tips.push('Layer up for warmth and easy adjustment');
  }
  
  return tips;
};

// Get color palette recommendations based on weather and season
export const getColorPalette = (weather, season = 'current') => {
  const palettes = {
    'Sunny': {
      spring: ['pastel pink', 'mint green', 'sky blue', 'cream'],
      summer: ['white', 'coral', 'turquoise', 'lemon yellow'],
      fall: ['warm orange', 'golden yellow', 'rust', 'cream'],
      winter: ['crisp white', 'navy', 'silver', 'ice blue'],
      current: ['white', 'light blue', 'beige', 'coral']
    },
    'Cloudy': {
      spring: ['soft gray', 'muted green', 'dusty rose', 'cream'],
      summer: ['light gray', 'sage green', 'soft blue', 'white'],
      fall: ['charcoal', 'burgundy', 'forest green', 'camel'],
      winter: ['dark gray', 'navy', 'burgundy', 'cream'],
      current: ['gray', 'muted colors', 'earth tones']
    },
    'Rainy': {
      current: ['navy', 'black', 'dark gray', 'burgundy']
    },
    'Cold': {
      current: ['dark colors', 'burgundy', 'forest green', 'charcoal']
    }
  };
  
  return palettes[weather.condition]?.[season] || palettes[weather.condition]?.current || ['navy', 'gray', 'white'];
};

// Get fabric recommendations based on weather
export const getFabricRecommendations = (weather) => {
  const fabricMap = {
    'Sunny': {
      hot: ['cotton', 'linen', 'bamboo', 'modal'],
      warm: ['cotton', 'cotton blend', 'light denim']
    },
    'Cloudy': {
      mild: ['cotton', 'light wool', 'cotton blend', 'jersey']
    },
    'Rainy': {
      any: ['waterproof', 'synthetic', 'treated cotton', 'polyester']
    },
    'Cold': {
      cold: ['wool', 'cashmere', 'fleece', 'down', 'thermal']
    }
  };
  
  const weatherFabrics = fabricMap[weather.condition];
  if (!weatherFabrics) return ['cotton', 'cotton blend'];
  
  // Return fabrics based on temperature
  if (weather.temperature >= 27) return weatherFabrics.hot || weatherFabrics.any || Object.values(weatherFabrics)[0];
  if (weather.temperature <= 16) return weatherFabrics.cold || weatherFabrics.any || Object.values(weatherFabrics)[0];
  return weatherFabrics.warm || weatherFabrics.mild || weatherFabrics.any || Object.values(weatherFabrics)[0];
};

// Occasion-based outfit filtering
export const filterByOccasion = (outfits, occasion) => {
  const occasionMap = {
    'work': ['business', 'business casual', 'smart casual'],
    'casual': ['casual', 'relaxed', 'comfortable'],
    'date': ['trendy', 'sophisticated', 'smart casual'],
    'workout': ['functional', 'athletic'],
    'formal': ['business formal', 'sophisticated'],
    'weekend': ['casual', 'relaxed', 'streetwear']
  };
  
  const suitableStyles = occasionMap[occasion] || occasionMap['casual'];
  return outfits.filter(outfit => suitableStyles.includes(outfit.style));
};

// Generate outfit variations
export const generateOutfitVariations = (baseOutfit, userWardrobe = []) => {
  const variations = [];
  
  // Create color variations
  const colors = ['navy', 'black', 'white', 'gray', 'burgundy'];
  colors.forEach(color => {
    variations.push({
      ...baseOutfit,
      name: `${baseOutfit.name} - ${color.charAt(0).toUpperCase() + color.slice(1)}`,
      primaryColor: color,
      items: baseOutfit.items.map(item => `${color} ${item.toLowerCase()}`)
    });
  });
  
  return variations.slice(0, 3); // Return top 3 variations
};