/**
 * GoogleCalendar.jsx
 *
 * Purpose
 * - Renders a month-view calendar that lets users select a date
 * - Shows Indian holidays/festivals for the current month using Google public calendars
 * - Shows weather details for the selected date using Open-Meteo (no API key)
 * - Displays simple advisories based on weather conditions
 *
 * Key Dependencies
 * - Env var: `VITE_GOOGLE_API_KEY` for public calendar events
 * - Utils: `../utils/googleCalendar` (labels + public fetch), `../utils/openMeteo` (forecast), `../utils/randomLocation`
 * - Icons: `lucide-react`
 *
 * Integration Notes
 * - Include this component under your "calendar" tab or route
 * - Ensure `.env` contains `VITE_GOOGLE_API_KEY`
 * - Styling uses utility classes; adapt if using a different CSS model
 */
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Droplets, Thermometer, Wind, Sun } from 'lucide-react';
// Calendar helpers: human-friendly labels per public calendar + API-key-only fetch
import { CALENDAR_LABELS, fetchIndiaHolidayEvents } from '../utils/googleCalendar';
// Weather helpers: fetch and summarize multi-day forecast
import { getForecastSummary } from '../utils/openMeteo';
// Simple location source: pick a random city for demo; replace with user location if available
import { getUserOrRandomLocation } from '../utils/randomLocation';

// Normalize a date object to the first day of its month at 00:00:00.000
function startOfMonth(date) {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Normalize a date object to the last day of its month at 23:59:59.999
function endOfMonth(date) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
}

// Return a new date offset by `days` from the given date
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// Build a 6x7 grid (42 cells) for the calendar month view including leading/trailing days
function getMonthGrid(date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const startWeekday = start.getDay();
  const gridStart = addDays(start, -startWeekday);
  const days = [];
  for (let i = 0; i < 42; i++) {
    const day = addDays(gridStart, i);
    days.push(day);
  }
  return days;
}

// Main calendar tab component
export default function GoogleCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateIso, setSelectedDateIso] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  // Public calendar API key (no OAuth needed for public calendars)
  const apiKey = 'AIzaSyBqL0mfheCON7giEzw0_MBKH8FJmr3-bI4';
  const [dayWeather, setDayWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  // Cached "today" as YYYY-MM-DD
  const todayIsoRef = useRef(new Date().toISOString().slice(0, 10));
  // Demo location source; swap with user geolocation if you have it
const [location, setLocation] = useState(null);

useEffect(() => {
  getUserOrRandomLocation().then(setLocation);
}, []);
  // Expanded advisory logic based on multiple thresholds
  // Returns up to 5 concise tips to avoid overwhelming the user
  const getAdvisories = (wx) => {
    if (!wx) return [];
    const tips = [];
    const has = (v) => v !== undefined && v !== null;

    // Temperature advisories
    if (has(wx.tempMin)) {
      if (wx.tempMin <= 5) tips.push('Very cold — add thermal layers, hat and gloves.');
      else if (wx.tempMin <= 10) tips.push('It’s cold — wear a warm jacket.');
    }
    if (has(wx.tempMax)) {
      if (wx.tempMax >= 35) tips.push('Extreme heat — hydrate, wear light fabrics, avoid midday sun.');
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

    // UV advisories
    if (has(wx.uvIndexMax)) {
      if (wx.uvIndexMax >= 8) tips.push('UV is very high — sunscreen, sunglasses, hat; limit midday sun.');
      else if (wx.uvIndexMax >= 6) tips.push('UV is high — wear sunscreen and sunglasses.');
    }

    // Large diurnal swing
    if (has(wx.tempMax) && has(wx.tempMin) && wx.tempMax - wx.tempMin >= 10) {
      tips.push('Large temperature swing — dress in layers.');
    }

    // Daylight length advisories if sunrise/sunset available
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

    // Limit to top 5 tips for readability
    return tips.slice(0, 5);
  };

  // Month grid cells and human-friendly header label for current month
  const days = useMemo(() => getMonthGrid(currentMonth), [currentMonth]);
  const monthLabel = useMemo(() => currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), [currentMonth]);

  useEffect(() => {
    // Fetch India holidays/festivals for the visible month
    // Uses Google public calendars and only requires `VITE_GOOGLE_API_KEY`
    (async () => {
      try {
        setLoading(true);
        const timeMin = startOfMonth(currentMonth).toISOString();
        const timeMax = endOfMonth(currentMonth).toISOString();
        const items = await fetchIndiaHolidayEvents({ apiKey, timeMin, timeMax });
        setEvents(items);
      } catch (e) {
        console.error('Holiday/Festival fetch error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [apiKey, currentMonth]);

  // Fetch real weather for selected date via Open-Meteo
  // Forecast spans up to 16 days from today; selecting outside range shows a tip
   useEffect(() => {
    if (!location || !selectedDateIso) {
      setDayWeather(null);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setWeatherLoading(true);
        const daily = await getForecastSummary({
          latitude: location.latitude,
          longitude: location.longitude,
          timezone: 'auto',
          days: 16,
        });
        const found = daily.find(d => d.date === selectedDateIso) || null;
        if (!cancelled) setDayWeather(found);
      } catch (e) {
        console.error('Weather fetch failed:', e);
      } finally {
        if (!cancelled) setWeatherLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [selectedDateIso, location]);

  // Index events by YYYY-MM-DD for quick lookup when a date is selected
  const eventsByDay = useMemo(() => {
    const map = new Map();
    for (const ev of events) {
      const startIso = ev.start?.dateTime || ev.start?.date;
      if (!startIso) continue;
      const dayKey = new Date(startIso).toISOString().slice(0, 10);
      if (!map.has(dayKey)) map.set(dayKey, []);
      map.get(dayKey).push(ev);
    }
    return map;
  }, [events]);

  // Month navigation actions
  const onPrev = () => setCurrentMonth((d) => addDays(startOfMonth(d), -1));
  const onNext = () => setCurrentMonth((d) => addDays(endOfMonth(d), 1));

  // (intentionally no extra helpers beyond comments to keep footprint minimal)

  const selectedEvents = useMemo(() => {
    if (!selectedDateIso) return [];
    return eventsByDay.get(selectedDateIso) || [];
  }, [selectedDateIso, eventsByDay]);

  return (
    <div className="fade-in w-full px-0">
      {/* Header: month navigation + title */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrev} className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-white active:scale-95">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text">{monthLabel}</h2>
        </div>
        <button onClick={onNext} className="p-3 rounded-2xl bg-pink-600/20 border border-pink-500/30 text-white active:scale-95">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Loading indicator + hint for selection */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-slate-300">
          <CalendarIcon className="w-4 h-4 text-electric-cyan" />
          <span className="text-sm">{loading ? 'Loading India holidays…' : 'Select a date to view details'}</span>
        </div>
      </div>

      {/* Weekday headers: Sun-Sat */}
      <div className="w-full">
        <div className="grid grid-cols-7 gap-x-[6px] gap-y-[6px] sm:gap-x-[10px] sm:gap-y-[8px] md:gap-x-[12px] md:gap-y-[10px] mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-center text-xs sm:text-sm font-bold text-slate-300">
              {d}
            </div>
          ))}
        </div>
      </div>

      {/* Month grid: 6x7 cells with selection/today marker */}
      <div className="w-full">
        <div className="grid grid-cols-7 gap-x-[6px] gap-y-[8px] sm:gap-x-[10px] sm:gap-y-[10px] md:gap-x-[12px] md:gap-y-[12px] mb-6">
          {days.map((day) => {
            const iso = day.toISOString().slice(0, 10);
            const inMonth = day.getMonth() === currentMonth.getMonth();
            const isToday = iso === todayIsoRef.current;
            const isSelected = iso === selectedDateIso;
            const classes = [
              'rounded-xl p-1 sm:p-2 border aspect-square w-full overflow-hidden box-border',
              inMonth ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-800/10 border-slate-700/20 opacity-70',
              isSelected ? 'ring-2 ring-purple-400 border-purple-500/60 bg-purple-600/15' : '',
              isToday ? 'border-electric-cyan/50' : '',
              'hover:bg-slate-700/30 transition-colors cursor-pointer',
            ].join(' ');
            return (
              <button key={iso} className={classes} onClick={() => setSelectedDateIso(iso)}>
                <div className="h-full flex items-start justify-between">
                  <div className={`${inMonth ? 'text-white' : 'text-slate-400'} font-semibold text-[11px] sm:text-xs md:text-sm`}>{day.getDate()}</div>
                  {isToday && <span className="hidden sm:inline text-[10px] text-electric-cyan font-bold">Today</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advisory panel: top tips for the selected date based on weather */}
      {selectedDateIso && (
        <div className="card bg-slate-800/40 border-slate-600/40 p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold">Today’s Advice</h3>
            <span className="text-xs text-slate-400">Based on weather</span>
          </div>
          {getAdvisories(dayWeather).length === 0 ? (
            <p className="text-slate-400 text-sm">No special advisories for this day.</p>
          ) : (
            <ul className="space-y-1">
              {getAdvisories(dayWeather).map((tip, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-slate-400 leading-5">•</span>
                  <span className="text-slate-300 text-sm leading-5">{tip}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Selected day details: India festivals/holidays only (API-key fetch) */}
      <div className="card bg-slate-800/40 border-slate-600/40 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-semibold">{selectedDateIso ? new Date(selectedDateIso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}</h3>
          {selectedDateIso && <span className="text-xs text-slate-400">{eventsByDay.get(selectedDateIso)?.length || 0} items</span>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {selectedEvents.length === 0 && (
            <p className="text-slate-400 text-sm">No major Indian holidays or festivals on this day.</p>
          )}
          {selectedEvents.map((ev) => (
            <div key={`${ev.__calendarId}-${ev.id}`} className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border border-slate-600/60 text-slate-300 bg-slate-800/60">
                      {CALENDAR_LABELS[ev.__calendarId] || 'Holiday/Festival'}
                    </span>
                    <span className="text-[11px] text-slate-400">All day</span>
                  </div>
                  <div className="text-sm sm:text-base font-medium text-white whitespace-normal break-words">
                    {ev.summary || 'Untitled'}
                  </div>
                  {ev.location && <p className="text-[11px] text-slate-400 mt-1 whitespace-normal break-words">{ev.location}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather box: forecast metrics for the selected date (Open‑Meteo) */}
      <div className="card bg-slate-800/40 border-slate-600/40 p-4 mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-semibold">Weather</h3>
          {!selectedDateIso && <span className="text-xs text-slate-400">Select a date</span>}
        </div>
        {!selectedDateIso && (
          <p className="text-slate-400 text-sm">Pick a date to view the weather forecast.</p>
        )}
        {selectedDateIso && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {weatherLoading && <p className="text-slate-400 text-sm">Loading weather…</p>}
            {!weatherLoading && !dayWeather && (
              <p className="text-amber-300 text-sm">Weather available for the next 16 days from today. Please pick a date within this range.</p>
            )}
            {!weatherLoading && dayWeather && (
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {/* Icon */}
                  {(() => {
                    const IconComp = dayWeather.icon || Sun;
                    return <IconComp className="w-5 h-5 text-electric-cyan" />;
                  })()}
                  <span className="text-white font-semibold text-sm sm:text-base">{dayWeather.weatherDesc || 'Weather'}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2 text-slate-300"><Thermometer className="w-4 h-4" /><span className="text-sm">{dayWeather.tempMax}° / {dayWeather.tempMin}°C</span></div>
                  <div className="flex items-center gap-2 text-slate-300"><Droplets className="w-4 h-4" /><span className="text-sm">{dayWeather.precipProb}%</span></div>
                  <div className="flex items-center gap-2 text-slate-300"><Wind className="w-4 h-4" /><span className="text-sm">{dayWeather.windSpeedMax ?? '—'} km/h</span></div>
                  <div className="flex items-center gap-2 text-slate-300"><Sun className="w-4 h-4" /><span className="text-sm">UV {dayWeather.uvIndexMax ?? '—'}</span></div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {dayWeather.sunrise && <div className="flex items-center gap-2 text-slate-300"><Sun className="w-4 h-4" /><span className="text-sm">Sunrise {new Date(dayWeather.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>}
                  {dayWeather.sunset && <div className="flex items-center gap-2 text-slate-300"><Sun className="w-4 h-4" /><span className="text-sm">Sunset {new Date(dayWeather.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>}
                </div>
                {dayWeather.weatherDesc && <p className="text-slate-400 text-sm mt-2 whitespace-normal break-words">{dayWeather.weatherDesc}</p>}
                <p className="text-[11px] text-slate-500 mt-1">Location: {location.name}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}