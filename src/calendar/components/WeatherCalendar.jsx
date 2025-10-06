import React, { useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../styles/fullcalendar.css';
import { getRandomLocation } from '../utils/randomLocation';
import { getThreeDaySummary } from '../utils/openMeteo';
import { MapPin, CloudRain, Thermometer, Droplets, AlertTriangle } from 'lucide-react';

const WeatherDetailCard = ({ info }) => {
  if (!info) return (
    <div className="text-center text-slate-400 py-6">Select a date to view weather</div>
  );
  const alerts = info.alerts || [];
  return (
    <div className="card bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-white text-xl font-bold mb-1">{info.weatherDesc || 'Weather'}</div>
          <div className="text-slate-300 text-sm">{info.date}</div>
        </div>
        {alerts.length > 0 && (
          <div className="flex items-center space-x-2 bg-yellow-600/20 border border-yellow-500/40 px-3 py-1 rounded-full">
            <AlertTriangle className="w-4 h-4 text-yellow-300" />
            <span className="text-xs text-yellow-200">{alerts[0]}</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex items-center space-x-3">
          <Thermometer className="w-5 h-5 text-blue-300" />
          <div>
            <div className="text-white font-semibold">{info.tempAvg ?? Math.round(((info.tempMax ?? 0)+(info.tempMin ?? 0))/2)}°C</div>
            <div className="text-xs text-slate-400">Avg temp</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Droplets className="w-5 h-5 text-cyan-300" />
          <div>
            <div className="text-white font-semibold">{info.humidityAvg ?? 60}%</div>
            <div className="text-xs text-slate-400">Avg humidity</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <CloudRain className="w-5 h-5 text-blue-300" />
          <div>
            <div className="text-white font-semibold">{info.precipProb ?? info.precipProbAvg ?? 0}%</div>
            <div className="text-xs text-slate-400">Precipitation probability</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-300" />
          <div>
            <div className="text-white font-semibold">{alerts.length ? 'Alert' : 'None'}</div>
            <div className="text-xs text-slate-400">Weather alerts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WeatherCalendar() {
  const [location, setLocation] = useState(() => getRandomLocation());
  const [summary, setSummary] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getThreeDaySummary({ latitude: location.latitude, longitude: location.longitude, timezone: 'auto' });
        if (!cancelled) setSummary(res);
      } catch (e) {
        console.error('Open-Meteo fetch failed', e);
      }
    })();
    return () => { cancelled = true; };
  }, [location.latitude, location.longitude]);

  const [selectedIso, setSelectedIso] = useState(null);

  const handleDateClick = (arg) => {
    const iso = arg.dateStr;
    const info = summary.find(s => s.date === iso) || null;
    setSelected(info);
    setSelectedIso(iso);
  };

  return (
    <div className="mobile-container fade-in">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-electric-cyan" />
            <div>
              <div className="text-white font-bold">{location.name}</div>
              <div className="text-xs text-slate-400">lat {location.latitude.toFixed(3)}, lon {location.longitude.toFixed(3)}</div>
            </div>
          </div>
          <button
            onClick={() => setLocation(getRandomLocation())}
            className="btn-primary px-4 py-2 rounded-xl active:scale-95"
          >
            Randomize Location
          </button>
        </div>
      </div>

      <div className="card bg-slate-800/40 border-slate-600/40 p-2">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          aspectRatio={1.25}
          fixedWeekCount={false}
          headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
          buttonText={{ today: 'Today' }}
          titleFormat={{ year: 'numeric', month: 'long' }}
          dateClick={handleDateClick}
          dayCellClassNames={(arg) => {
            const iso = arg.date.toISOString().slice(0,10);
            const base = ['transition-colors','cursor-pointer','rounded-lg'];
            if (selectedIso === iso) {
              base.push('bg-purple-600/25','border-2','border-electric-cyan','ring-2','ring-electric-cyan/40');
            }
            return base;
          }}
          dayHeaderClassNames={() => ['text-slate-300','font-bold']}
        />
      </div>

      <div className="mt-6">
        <WeatherDetailCard info={selected} />
      </div>
    </div>
  );
}