// Open-Meteo helper to fetch 3-day weather and summarize by date
export async function fetchOpenMeteoForecast({ latitude, longitude, timezone = 'auto', days = '3' }) {
  const base = 'https://api.open-meteo.com/v1/forecast';
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'precipitation_probability',
      'weathercode'
    ].join(','),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'weathercode',
      'windspeed_10m_max',
      'uv_index_max',
      'sunrise',
      'sunset'
    ].join(','),
    current: ['temperature_2m', 'relative_humidity_2m', 'weathercode'].join(','),
    forecast_days: String(days),
    timezone
  });

  const url = `${base}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
  return res.json();
}

// Simple mapping from WMO weather code to description
const WMO_CODES = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Violent rain showers',
  85: 'Snow showers',
  86: 'Snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with hail'
};

export function summarizeDaily(data) {
  const tz = data.timezone || 'local';
  const days = [];
  const dates = data.daily?.time || [];
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const maxTemp = data.daily?.temperature_2m_max?.[i] ?? null;
    const minTemp = data.daily?.temperature_2m_min?.[i] ?? null;
    const precipProb = data.daily?.precipitation_probability_max?.[i] ?? null;
    const wcode = data.daily?.weathercode?.[i] ?? null;
    const windSpeedMax = data.daily?.windspeed_10m_max?.[i] ?? null;
    const uvIndexMax = data.daily?.uv_index_max?.[i] ?? null;
    const sunrise = data.daily?.sunrise?.[i] ?? null;
    const sunset = data.daily?.sunset?.[i] ?? null;
    days.push({
      date,
      timezone: tz,
      tempMax: maxTemp,
      tempMin: minTemp,
      precipProb,
      weatherCode: wcode,
      weatherDesc: wcode != null ? (WMO_CODES[wcode] || `Code ${wcode}`) : null,
      windSpeedMax,
      uvIndexMax,
      sunrise,
      sunset
    });
  }
  return days;
}

export function summarizeHourlyTomorrow(data) {
  // Group hourly arrays by local date string
  const times = data.hourly?.time || [];
  const temp = data.hourly?.temperature_2m || [];
  const humidity = data.hourly?.relative_humidity_2m || [];
  const precip = data.hourly?.precipitation_probability || [];
  const wcode = data.hourly?.weathercode || [];

  const buckets = new Map();
  for (let i = 0; i < times.length; i++) {
    const dateStr = times[i].slice(0, 10); // YYYY-MM-DD
    const arr = buckets.get(dateStr) || [];
    arr.push({ t: temp[i], h: humidity[i], p: precip[i], w: wcode[i] });
    buckets.set(dateStr, arr);
  }
  const result = [];
  for (const [date, arr] of buckets.entries()) {
    if (!arr.length) continue;
    const avg = (xs) => xs.reduce((a, b) => a + (b ?? 0), 0) / xs.length;
    const temps = arr.map(x => x.t ?? 0);
    const hums = arr.map(x => x.h ?? 0);
    const precs = arr.map(x => x.p ?? 0);
    const codes = arr.map(x => x.w).filter(x => x != null);
    // pick modal code
    const mode = codes.length ? codes.sort((a,b)=>
      arr.filter(x=>x.w===a).length - arr.filter(x=>x.w===b).length
    ).pop() : null;
    result.push({
      date,
      tempAvg: Number(avg(temps).toFixed(1)),
      humidityAvg: Math.round(avg(hums)),
      precipProbAvg: Math.round(avg(precs)),
      weatherCode: mode,
      weatherDesc: mode != null ? (WMO_CODES[mode] || `Code ${mode}`) : null,
      alerts: mode && (mode >= 95 || (Math.round(avg(precs)) >= 70)) ? ['Potential storm or heavy rain'] : []
    });
  }
  return result;
}

export async function getThreeDaySummary({ latitude, longitude, timezone = 'auto' }) {
  const data = await fetchOpenMeteoForecast({ latitude, longitude, timezone, days: 3 });
  const daily = summarizeDaily(data);
  const hourlyAgg = summarizeHourlyTomorrow(data);
  // merge hourly aggregates into daily by date
  const byDate = new Map(daily.map(d => [d.date, { ...d }]));
  for (const h of hourlyAgg) {
    const d = byDate.get(h.date);
    if (d) {
      d.tempAvg = h.tempAvg;
      d.humidityAvg = h.humidityAvg;
      d.precipProbAvg = h.precipProbAvg;
      d.weatherDesc = h.weatherDesc || d.weatherDesc;
      d.weatherCode = h.weatherCode ?? d.weatherCode;
      d.alerts = h.alerts || [];
    }
  }
  return Array.from(byDate.values());
}

// Flexible forecast summary for max days
export async function getForecastSummary({ latitude, longitude, timezone = 'auto', days = 16 }) {
  const data = await fetchOpenMeteoForecast({ latitude, longitude, timezone, days });
  const daily = summarizeDaily(data);
  return daily;
}