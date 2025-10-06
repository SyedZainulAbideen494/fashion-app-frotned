// This file creates the Calendar component - a smart calendar that helps users plan their outfits
// It shows dates, weather forecasts, and suggests what clothes to wear based on the weather
// Think of it as a digital wardrobe planner that knows the weather forecast

// Import React - the main library for building user interfaces
import React, { useState, useEffect } from 'react';

// Import icons from Lucide React - these are small pictures/symbols used in the interface
// Each icon represents something specific (like arrows, weather symbols, clothing items)
import { 
  ChevronLeft,    // Left arrow icon for going to previous month
  ChevronRight,   // Right arrow icon for going to next month
  Plus,           // Plus sign icon for adding new outfits
  Shirt,          // Shirt icon to represent clothing/outfits
  Cloud,          // Cloud icon for cloudy weather
  Sun,            // Sun icon for sunny weather
  CloudRain,      // Rain cloud icon for rainy weather
  Snowflake,      // Snowflake icon for cold/snowy weather
  Eye,            // Eye icon for viewing outfit details
  Edit3,          // Pencil icon for editing outfits
  Trash2,         // Trash can icon for deleting outfits
  Sparkles,       // Sparkles icon for AI recommendations
  TrendingUp,     // Arrow up icon for trending/popular items
  AlertTriangle   // Warning triangle icon for weather alerts
} from 'lucide-react';

// Import helper functions from other files
// These functions help with outfit suggestions and weather information
import { generateOutfitRecommendations } from '../utils/outfitLogic';  // Creates outfit suggestions
// Switch to real API via Open-Meteo
import { getForecastSummary } from '../utils/openMeteo';
import { getRandomLocation } from '../utils/randomLocation';

// Main Calendar component - this is like a function that creates the calendar interface
// It receives data from the main app and can send updates back
const Calendar = ({ calendarData, updateCalendarData, weather }) => {
  
  // State variables - these store information that can change over time
  // Think of them as the calendar's memory for different things
  
  const [currentDate, setCurrentDate] = useState(new Date());  // Which month/year we're currently viewing
  const [selectedDate, setSelectedDate] = useState(null);      // Which specific date the user clicked on
  const [plannedOutfits, setPlannedOutfits] = useState(calendarData?.plannedOutfits || {});  // Outfits planned for each date
  const [weatherForecast, setWeatherForecast] = useState(calendarData?.weatherForecast || {});  // Weather predictions for upcoming days
  const [location, setLocation] = useState(() => getRandomLocation());
  const [showOutfitPlanner, setShowOutfitPlanner] = useState(false);  // Whether to show the outfit planning popup
  const [aiRecommendations, setAiRecommendations] = useState([]);  // AI-suggested outfits based on weather
  const [weatherAlerts, setWeatherAlerts] = useState([]);  // Important weather warnings (like storms, extreme heat)

  // useEffect - this runs code when certain things change
  // This one gets weather forecasts when the location changes
  useEffect(() => {
    // Fetch real daily forecast from Open-Meteo (max days)
    (async () => {
      try {
        const days = 16; // maximize daily forecast length
        const daily = await getForecastSummary({
          latitude: location.latitude,
          longitude: location.longitude,
          timezone: 'auto',
          days
        });
        const byDateKey = {};
        daily.forEach(d => {
          const key = new Date(d.date).toDateString();
          // Map to existing structure used in UI
          byDateKey[key] = {
            condition: d.weatherDesc || 'Weather',
            temp: Math.round((d.tempMax + d.tempMin) / 2),
            tempMax: d.tempMax,
            tempMin: d.tempMin,
            precipProb: d.precipProb,
            windSpeedMax: d.windSpeedMax,
            uvIndexMax: d.uvIndexMax
          };
        });
        setWeatherForecast(byDateKey);
        // Optional: compute alerts client-side if needed; keeping empty for API-only data
        setWeatherAlerts([]);
      } catch (e) {
        console.error('Open-Meteo fetch failed', e);
      }
    })();
  }, [location.latitude, location.longitude]);

  // Another useEffect - this one sends weather data back to the main app
  // It's separate to prevent infinite loops (endless repetition)
  useEffect(() => {
    // If we have a way to update the main app and we have weather data
    if (updateCalendarData && Object.keys(weatherForecast).length > 0) {
      // Send the weather information back to the main app
      updateCalendarData({
        weatherForecast,
        weatherAlerts
      });
    }
  }, [weatherForecast, weatherAlerts]);  // This runs when weather data changes

  // Helper function - gets outfit suggestions based on weather conditions
  // This is like asking an AI stylist "What should I wear when it's sunny/rainy/cold?"
  const getOutfitSuggestions = (weather) => {
    if (!weather) return [];  // If no weather data, return empty list
    
    // Use AI-powered recommendations from our outfit logic helper
    const aiOutfits = generateOutfitRecommendations(weather);
    return aiOutfits.slice(0, 3); // Return only the top 3 best recommendations
  };

  // Helper function - calculates how many days are in a specific month
  // For example: January has 31 days, February has 28 or 29 days, etc.
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Helper function - finds what day of the week the month starts on
  // For example: Does January 1st fall on a Sunday (0), Monday (1), Tuesday (2), etc.?
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Helper function - moves the calendar forward or backward by months
  // Direction: -1 means go back one month, +1 means go forward one month
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);  // Make a copy of current date
    newDate.setMonth(currentDate.getMonth() + direction);  // Add or subtract months
    setCurrentDate(newDate);  // Update what month we're viewing
  };

  // Helper functions - specific navigation for previous and next month
  // These make it easy to go back or forward one month at a time
  const goToPreviousMonth = () => navigateMonth(-1);  // Go back one month
  const goToNextMonth = () => navigateMonth(1);       // Go forward one month

  // Function that runs when user clicks on a specific date
  // This opens the outfit planning interface for that date
  const handleDateClick = (day) => {
    // Create a proper date object for the clicked day
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = date.toDateString();  // Convert to text format for storage
    setSelectedDate(dateKey);  // Remember which date was clicked
    setShowOutfitPlanner(true);  // Show the outfit planning popup
  };

  // Function that saves a planned outfit for a specific date
  // This is like writing in a diary "On March 15th, I want to wear..."
  const saveOutfit = (outfit) => {
    if (selectedDate) {  // Make sure a date is selected
      const dateKey = selectedDate.toDateString();  // Get the date in text format
      const updatedOutfits = {
        ...plannedOutfits,  // Keep all existing planned outfits
        [dateKey]: outfit   // Add the new outfit for this date
      };
      setPlannedOutfits(updatedOutfits);  // Update our local memory
      
      // Also tell the main app about this new outfit plan
      if (updateCalendarData) {
        updateCalendarData({
          plannedOutfits: updatedOutfits
        });
      }
      
      setShowOutfitPlanner(false);  // Close the outfit planning popup
    }
  };

  // Function that removes a planned outfit from a specific date
  // This is like erasing an entry from your outfit diary
  const deleteOutfit = (dateKey) => {
    const updatedOutfits = { ...plannedOutfits };  // Make a copy of all planned outfits
    delete updatedOutfits[dateKey];  // Remove the outfit for this specific date
    setPlannedOutfits(updatedOutfits);  // Update our local memory
    
    // Also tell the main app about this deletion
    if (updateCalendarData) {
      updateCalendarData({
        plannedOutfits: updatedOutfits
      });
    }
  };

  // Function that creates all the individual day boxes you see in the calendar
  // This is like drawing each square on a paper calendar and filling in the information
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);      // How many days in this month?
    const firstDay = getFirstDayOfMonth(currentDate);     // What day of week does month start?
    const days = [];                                      // Empty list to store all day boxes
    const today = new Date();                             // What's today's date?

    // Create empty boxes for days before the first day of the month
    // For example, if March 1st is on a Wednesday, we need empty boxes for Sun, Mon, Tue
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Create boxes for each actual day of the month (1, 2, 3, ... 31)
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = date.toDateString();
      const isToday = date.toDateString() === today.toDateString();
      const hasOutfit = plannedOutfits[dateKey];
      const weather = weatherForecast[dateKey];
      
      // Get weather icon component
      const getWeatherIcon = (condition) => {
        switch(condition) {
          case 'Sunny': return Sun;
          case 'Cloudy': return Cloud;
          case 'Rainy': return CloudRain;
          case 'Cold': return Snowflake;
          default: return Cloud;
        }
      };
      
      const WeatherIcon = weather ? getWeatherIcon(weather.condition) : Cloud;

      days.push(
          <div
            key={`${currentDate.getMonth()}-${day}`}
            className={`
              relative p-2 sm:p-3 md:p-4 aspect-square border-2 rounded-lg sm:rounded-xl cursor-pointer flex flex-col
              transition-all duration-300 active:scale-95 active:shadow-lg
              ${isToday ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400 shadow-lg shadow-blue-500/30' : 'bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600'}
              ${selectedDate && selectedDate.toDateString() === dateKey ? 'ring-4 ring-purple-400 ring-opacity-60 shadow-xl shadow-purple-500/40' : ''}
              ${hasOutfit ? 'border-emerald-400 shadow-md shadow-emerald-500/20' : ''}
            `}
            onClick={() => setSelectedDate(date)}
          >
            {/* Date number - top section */}
            <div className="flex items-center justify-between mb-1 sm:mb-2 md:mb-3">
              <span className={`text-sm sm:text-base md:text-lg font-bold ${isToday ? 'text-white drop-shadow-md' : 'text-white'}`}>
                {day}
              </span>
              {hasOutfit && (
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full shadow-md animate-pulse"></div>
              )}
            </div>

            {/* Weather section - center */}
            {weather && (
              <div className="flex flex-col items-center mb-1 sm:mb-2 md:mb-3 space-y-0.5 sm:space-y-1">
                <WeatherIcon className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-300 drop-shadow-sm" />
                <div className="text-center">
                  <div className="text-xs sm:text-sm font-bold text-blue-200">{weather.temp}°</div>
                  <div className="text-xs text-blue-300 hidden sm:block">{weather.condition}</div>
                </div>
              </div>
            )}

            {/* Outfit section - bottom */}
            {hasOutfit && (
              <div className="mt-auto">
                <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm rounded p-1 sm:p-2 border border-emerald-400/30">
                  <div className="flex items-center space-x-1 sm:space-x-2 mb-0.5 sm:mb-1">
                    <Shirt className="w-2 h-2 sm:w-3 sm:h-3 text-emerald-300" />
                    <span className="text-xs font-semibold text-emerald-300 hidden sm:inline">Outfit</span>
                  </div>
                  <div className="text-xs text-white font-medium truncate">
                    {hasOutfit.name}
                  </div>
                  {hasOutfit.items && (
                    <div className="text-xs text-emerald-200 mt-0.5 sm:mt-1 hidden md:block">
                      {hasOutfit.items.slice(0, 2).map(item => item.name).join(', ')}
                      {hasOutfit.items.length > 2 && '...'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
    }

    return days;
  };

  const OutfitPlanner = () => {
    if (!selectedDate) return null;

    const dateKey = selectedDate.toDateString();
    const weather = weatherForecast[dateKey];
    const existingOutfit = plannedOutfits[dateKey];
    const suggestions = getOutfitSuggestions(weather);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
        <div className="w-full bg-dark-navy rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              {weather && (
                <div className="flex items-center space-x-2 mt-1">
                  <weather.icon className="w-4 h-4 text-electric-cyan" />
                  <span className="text-sm text-slate-300">
                    {weather.temp}°C • {weather.condition}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowOutfitPlanner(false)}
              className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center active:scale-95"
            >
              <Plus className="w-4 h-4 text-slate-300 rotate-45" />
            </button>
          </div>

          {existingOutfit ? (
            <div className="space-y-4">
              <div className="card bg-gradient-to-r from-hot-pink/10 to-hot-pink/5 border-hot-pink/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">Planned Outfit</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPlannedOutfits(prev => ({ ...prev, [dateKey]: null }))}
                      className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center active:scale-95"
                    >
                      <Edit3 className="w-4 h-4 text-electric-cyan" />
                    </button>
                    <button
                      onClick={() => deleteOutfit(dateKey)}
                      className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center active:scale-95"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
                <h5 className="font-medium text-white mb-2">{existingOutfit.name}</h5>
                <div className="flex flex-wrap gap-2">
                  {existingOutfit.items.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white">AI Outfit Suggestions</h4>
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-4 h-4 text-electric-cyan" />
                  <span className="text-xs text-electric-cyan">Powered by AI</span>
                </div>
              </div>
              {suggestions.map((outfit, index) => (
                <button
                  key={index}
                  onClick={() => saveOutfit(outfit)}
                  className="w-full card bg-gradient-to-r from-electric-cyan/10 to-electric-cyan/5 border-electric-cyan/30 active:scale-98 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-electric-cyan/20 rounded-xl flex items-center justify-center">
                      <Shirt className="w-6 h-6 text-electric-cyan" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-medium text-white">{outfit.name}</h5>
                        {outfit.suitability && (
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3 text-green-400" />
                            <span className="text-xs text-green-400">{outfit.suitability}% match</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {outfit.items.slice(0, 3).map((item, itemIndex) => (
                          <span
                            key={itemIndex}
                            className="text-xs text-slate-400"
                          >
                            {item}{itemIndex < 2 && itemIndex < outfit.items.length - 1 ? ' • ' : ''}
                          </span>
                        ))}
                        {outfit.items.length > 3 && (
                          <span className="text-xs text-slate-400">+{outfit.items.length - 3} more</span>
                        )}
                      </div>
                      {outfit.tips && outfit.tips.length > 0 && (
                        <p className="text-xs text-electric-cyan/70 italic">
                          💡 {outfit.tips[0]}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mobile-container fade-in">
      {/* Enhanced header with psychological appeal */}
      <div className="mb-8 px-2 text-center">
        <div className="flex items-center justify-between mb-6">
           <button
             onClick={goToPreviousMonth}
             className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm text-white rounded-2xl active:scale-95 transition-all duration-200 shadow-lg border border-purple-500/30 glow-effect"
           >
             <ChevronLeft className="w-6 h-6" />
           </button>
           
           <div className="text-center">
             <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
               {currentDate.toLocaleDateString('en-US', { month: 'long' })}
             </h2>
             <div className="text-xl sm:text-2xl font-semibold text-slate-300 mb-2">
               {currentDate.getFullYear()}
             </div>
             <p className="text-slate-400 text-sm sm:text-base font-medium">
               {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
             </p>
           </div>
           
           <button
             onClick={goToNextMonth}
             className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm text-white rounded-2xl active:scale-95 transition-all duration-200 shadow-lg border border-purple-500/30 glow-effect"
           >
             <ChevronRight className="w-6 h-6" />
           </button>
         </div>
      </div>

      {/* Weather Alerts with enhanced psychological design */}
      {weatherAlerts.length > 0 && (
        <div className="mb-8 space-y-4 slide-up">
          {weatherAlerts.map((alert, index) => (
            <div key={index} className={`${alert.severity === 'urgent' ? 'weather-alert-urgent' : 'weather-alert'} touch-feedback`}>
               <div className="flex items-center space-x-3">
                 <AlertTriangle className={`w-6 h-6 ${alert.severity === 'urgent' ? 'text-red-400' : 'text-amber-400'}`} />
                 <div>
                   <p className={`font-bold text-lg ${alert.severity === 'urgent' ? 'text-red-200' : 'text-amber-200'}`}>
                     {alert.title}
                   </p>
                   <p className={`text-sm ${alert.severity === 'urgent' ? 'text-red-300' : 'text-amber-300'}`}>
                     {alert.message}
                   </p>
                 </div>
               </div>
             </div>
          ))}
        </div>
      )}

      {/* Enhanced calendar grid with psychological principles */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 border border-slate-700/50 shadow-2xl glow-effect">
        {/* Days header with enhanced visual hierarchy */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-4 mb-3 sm:mb-4 md:mb-6">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-lg sm:rounded-xl md:rounded-2xl py-2 sm:py-3 md:py-4 border border-slate-600/30">
                <div className="text-center text-xs sm:text-sm font-bold text-slate-300 tracking-wider">
                  {day}
                </div>
              </div>
            ))}
        </div>

      {/* Calendar days with enhanced mobile interactions */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-4">
          {renderCalendarDays()}
      </div>
      </div>

      {/* Advisory panel below calendar and before holidays/upcoming sections */}
      <div className="mt-4 card bg-slate-800/40 border-slate-600/40 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-semibold">Daily Advice</h3>
          <span className="text-xs text-slate-400">From weather</span>
        </div>
        {(() => {
          const dateKey = selectedDate ? selectedDate.toDateString() : new Date().toDateString();
          const wx = weatherForecast[dateKey];
          const has = (v) => v !== undefined && v !== null;
          const tips = [];

          if (wx) {
            // Temperature
            if (has(wx.tempMin)) {
              if (wx.tempMin <= 5) tips.push('Very cold — add thermal layers, hat and gloves.');
              else if (wx.tempMin <= 10) tips.push('It’s cold — layer up with a warm jacket.');
            }
            if (has(wx.tempMax)) {
              if (wx.tempMax >= 35) tips.push('Extreme heat — hydrate, light fabrics, avoid midday sun.');
              else if (wx.tempMax >= 30) tips.push('Hot day — breathable clothes and carry water.');
            }

            // Rain and wind
            if (has(wx.precipProb)) {
              if (wx.precipProb >= 80) tips.push('Likely heavy rain — waterproof shoes and raincoat.');
              else if (wx.precipProb >= 60) tips.push('High chance of rain — carry an umbrella.');
              else if (wx.precipProb <= 20 && has(wx.tempMax) && wx.tempMax >= 18 && wx.tempMax <= 30) {
                tips.push('Great weather — ideal for outdoor activities.');
              }
            }
            if (has(wx.windSpeedMax)) {
              if (wx.windSpeedMax >= 40) tips.push('Very windy — secure loose items and avoid tall trees.');
              else if (wx.windSpeedMax >= 25) tips.push('Windy — consider a windbreaker; secure umbrella.');
            }

            // UV
            if (has(wx.uvIndexMax)) {
              if (wx.uvIndexMax >= 8) tips.push('UV very high — sunscreen, sunglasses, hat; limit midday sun.');
              else if (wx.uvIndexMax >= 6) tips.push('UV is high — use sunscreen and wear a hat.');
            }

            // Diurnal swing
            if (has(wx.tempMax) && has(wx.tempMin) && wx.tempMax - wx.tempMin >= 10) {
              tips.push('Large temperature swing — dress in layers.');
            }

            // Daylight length
            if (has(wx.sunrise) && has(wx.sunset)) {
              const sr = new Date(wx.sunrise);
              const ss = new Date(wx.sunset);
              const hours = (ss - sr) / 3600000;
              if (hours <= 10) tips.push('Short daylight hours — plan outdoor tasks earlier.');
            }

            // Combined severe conditions
            if (has(wx.precipProb) && has(wx.windSpeedMax) && wx.precipProb >= 70 && wx.windSpeedMax >= 25) {
              tips.push('Wet and windy — consider indoor plans or reschedule.');
            }
          }

          const finalTips = tips.slice(0, 5);
          return finalTips.length === 0 ? (
            <p className="text-slate-400 text-sm">No special advisories for the selected day.</p>
          ) : (
            <ul className="space-y-1">
              {finalTips.map((t, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="text-slate-400 leading-5">•</span>
                  <span className="text-slate-300 text-sm leading-5">{t}</span>
                </li>
              ))}
            </ul>
          );
        })()}
      </div>

      {/* Upcoming Planned Outfits */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Upcoming Outfits</h3>
        {Object.entries(plannedOutfits)
          .filter(([dateKey]) => new Date(dateKey) >= new Date())
          .slice(0, 3)
          .map(([dateKey, outfit]) => {
            const date = new Date(dateKey);
            const weather = weatherForecast[dateKey];
            const WeatherIcon = weather?.icon || Cloud;
            
            return (
              <div key={dateKey} className="card bg-slate-800/30 border-slate-600/30">
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <div className="text-sm font-medium text-white">
                      {date.getDate()}
                    </div>
                    <div className="text-xs text-slate-400">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-white">{outfit.name}</h4>
                      {weather && (
                        <div className="flex items-center space-x-1">
                          <WeatherIcon className="w-3 h-3 text-electric-cyan" />
                          <span className="text-xs text-slate-400">{weather.temp}°C</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">
                      {outfit.items.slice(0, 2).join(' • ')}
                      {outfit.items.length > 2 && ` +${outfit.items.length - 2} more`}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedDate(date);
                      setShowOutfitPlanner(true);
                    }}
                    className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center active:scale-95"
                  >
                    <Eye className="w-4 h-4 text-electric-cyan" />
                  </button>
                </div>
              </div>
            );
          })}
        
        {Object.keys(plannedOutfits).length === 0 && (
          <div className="text-center py-8">
            <Shirt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No outfits planned yet</p>
            <p className="text-sm text-slate-500">Tap on a date to plan your outfit</p>
          </div>
        )}
      </div>

      {/* Outfit Planner Modal with enhanced mobile design */}
      {showOutfitPlanner && selectedDate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center p-0 z-50">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-t-3xl w-full max-h-[85vh] overflow-y-auto border-t-4 border-purple-500 shadow-2xl">
            {/* Modal Header with drag indicator */}
            <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 p-6 border-b border-slate-700/50">
              <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mb-4"></div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Plan Your Outfit
                  </h3>
                  <p className="text-sm text-slate-300">
                    {new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setShowOutfitPlanner(false)}
                  className="p-3 bg-slate-800 text-slate-400 rounded-full active:scale-95 transition-transform duration-200"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Weather info for selected date with enhanced design */}
              {weatherForecast[selectedDate] && (
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30">
                  <div className="flex items-center space-x-4">
                    {(() => {
                      const weather = weatherForecast[selectedDate];
                      const WeatherIcon = weather ? (() => {
                        switch(weather.condition) {
                          case 'Sunny': return Sun;
                          case 'Cloudy': return Cloud;
                          case 'Rainy': return CloudRain;
                          case 'Cold': return Snowflake;
                          default: return Cloud;
                        }
                      })() : Cloud;
                      return <WeatherIcon className="w-12 h-12 text-blue-300 drop-shadow-lg" />;
                    })()}
                    <div>
                      <p className="text-white font-bold text-lg">{weatherForecast[selectedDate].condition}</p>
                      <p className="text-blue-200 text-2xl font-bold">{weatherForecast[selectedDate].temp}°C</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Current outfit or add new with enhanced mobile buttons */}
              {plannedOutfits[selectedDate] ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 backdrop-blur-sm rounded-2xl p-4 border border-emerald-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-white text-lg">{plannedOutfits[selectedDate].name}</h4>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => editOutfit(selectedDate)}
                          className="p-3 bg-blue-600 text-white rounded-full active:scale-95 transition-transform duration-200 shadow-lg"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteOutfit(selectedDate)}
                          className="p-3 bg-red-600 text-white rounded-full active:scale-95 transition-transform duration-200 shadow-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {plannedOutfits[selectedDate].items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 text-white bg-black/20 p-3 rounded-xl">
                          <Shirt className="w-5 h-5 text-emerald-400" />
                          <span className="font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => generateAIRecommendations(selectedDate)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-2xl active:scale-95 transition-transform duration-200 shadow-xl flex items-center justify-center space-x-3"
                  >
                    <Sparkles className="w-6 h-6" />
                    <span className="text-lg">Get AI Suggestions</span>
                  </button>
                  
                  <button
                    onClick={() => addCustomOutfit(selectedDate)}
                    className="w-full bg-gradient-to-r from-slate-700 to-slate-600 text-white font-bold py-4 px-6 rounded-2xl active:scale-95 transition-transform duration-200 shadow-xl flex items-center justify-center space-x-3 border-2 border-slate-500"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-lg">Create Custom Outfit</span>
                  </button>
                </div>
              )}

              {/* AI Recommendations with enhanced mobile design */}
              {aiRecommendations.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                    <h4 className="font-bold text-white text-lg">AI Suggestions</h4>
                    <span className="text-xs text-purple-300 bg-purple-900/50 px-3 py-1 rounded-full font-medium">
                      Powered by AI
                    </span>
                  </div>
                  
                  {aiRecommendations.map((outfit, index) => (
                    <div key={index} className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <h5 className="font-bold text-white text-lg">{outfit.name}</h5>
                          <div className="flex items-center space-x-2 bg-green-600/30 px-3 py-1 rounded-full">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-bold text-green-300">{outfit.suitability}%</span>
                          </div>
                        </div>
                        <button
                          onClick={() => selectAIOutfit(outfit, selectedDate)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-6 py-3 rounded-xl active:scale-95 transition-transform duration-200 shadow-lg"
                        >
                          Select
                        </button>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        {outfit.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center space-x-3 text-white bg-black/20 p-3 rounded-xl">
                            <Shirt className="w-4 h-4 text-purple-400" />
                            <span className="font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                      
                      {outfit.tips && (
                        <div className="bg-yellow-600/20 border border-yellow-500/30 p-3 rounded-xl">
                          <p className="text-sm text-yellow-200 font-medium">
                            💡 {outfit.tips}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;