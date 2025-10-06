// Google Calendar API utility: loads gapi + GIS, handles auth, lists events
// Uses Vite env vars: VITE_GOOGLE_API_KEY, VITE_GOOGLE_CLIENT_ID

let gapiLoaded = false;
let gisLoaded = false;
let clientInitialized = false;
let accessToken = null;
let tokenClient = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(new Error(`Failed to load ${src}: ${e?.message || 'unknown error'}`));
    document.head.appendChild(script);
  });
}

export async function loadGoogleApis() {
  // Load gapi client and Google Identity Services
  await loadScript('https://apis.google.com/js/api.js');
  gapiLoaded = true;
  await loadScript('https://accounts.google.com/gsi/client');
  gisLoaded = true;
}

export async function initGapiClient({ apiKey }) {
  if (!gapiLoaded) throw new Error('gapi not loaded');
  if (clientInitialized) return;
  await new Promise((resolve) => {
    // gapi is a global injected by api.js
    // eslint-disable-next-line no-undef
    gapi.load('client', resolve);
  });
  // eslint-disable-next-line no-undef
  await gapi.client.init({
    apiKey,
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  });
  clientInitialized = true;
}

export function setupTokenClient({ clientId, scope = 'https://www.googleapis.com/auth/calendar.readonly' }) {
  if (!gisLoaded) throw new Error('GIS not loaded');
  if (tokenClient) return tokenClient;
  // google is a global injected by gsi/client
  // eslint-disable-next-line no-undef
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope,
    prompt: 'consent',
    callback: (resp) => {
      if (resp && resp.access_token) {
        accessToken = resp.access_token;
        // eslint-disable-next-line no-undef
        gapi.client.setToken({ access_token: accessToken });
      }
    },
  });
  return tokenClient;
}

export async function ensureAuth({ apiKey, clientId, scope }) {
  await loadGoogleApis();
  await initGapiClient({ apiKey });
  setupTokenClient({ clientId, scope });
  if (!accessToken) {
    await new Promise((resolve, reject) => {
      try {
        tokenClient.requestAccessToken();
        // Poll for token availability
        const start = Date.now();
        const timer = setInterval(() => {
          if (accessToken) {
            clearInterval(timer);
            resolve();
          } else if (Date.now() - start > 15000) {
            clearInterval(timer);
            reject(new Error('Timed out waiting for access token'));
          }
        }, 100);
      } catch (e) {
        reject(e);
      }
    });
  }
}

export function isAuthed() {
  return !!accessToken;
}

export async function listEvents({ calendarId = 'primary', timeMin, timeMax, showDeleted = false }) {
  // eslint-disable-next-line no-undef
  const resp = await gapi.client.calendar.events.list({
    calendarId,
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: 'startTime',
    showDeleted,
    maxResults: 2500,
  });
  const result = resp.result || resp;
  return result.items || [];
}

export function signOut() {
  accessToken = null;
  // eslint-disable-next-line no-undef
  if (gapi?.client) {
    // Clear token in gapi client
    // eslint-disable-next-line no-undef
    gapi.client.setToken(null);
  }
}

// ---------------------------------------------
// Public calendars (India holidays & festivals) via API key only
// ---------------------------------------------

// Known Google public calendar IDs relevant to India
export const INDIA_CALENDARS = [
  // Official Holidays in India (country-specific)
  'en.indian#holiday@group.v.calendar.google.com',
  // Religious festival calendars (global, includes India-relevant festivals)
  'en.hinduism#holiday@group.v.calendar.google.com',
  'en.islamic#holiday@group.v.calendar.google.com',
  'en.sikhism#holiday@group.v.calendar.google.com',
  'en.christian#holiday@group.v.calendar.google.com',
  'en.buddhist#holiday@group.v.calendar.google.com',
];

export const CALENDAR_LABELS = {
  'en.indian#holiday@group.v.calendar.google.com': 'Indian Public Holidays',
  'en.hinduism#holiday@group.v.calendar.google.com': 'Hindu Festivals',
  'en.islamic#holiday@group.v.calendar.google.com': 'Islamic Festivals',
  'en.sikhism#holiday@group.v.calendar.google.com': 'Sikh Festivals',
  'en.christian#holiday@group.v.calendar.google.com': 'Christian Festivals',
  'en.buddhist#holiday@group.v.calendar.google.com': 'Buddhist Festivals',
};

function buildEventsUrl({ calendarId, apiKey, timeMin, timeMax, showDeleted = false }) {
  const base = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
  const params = new URLSearchParams({
    key: apiKey,
    timeMin,
    timeMax,
    singleEvents: 'true',
    orderBy: 'startTime',
    showDeleted: showDeleted ? 'true' : 'false',
    maxResults: '2500',
  });
  return `${base}?${params.toString()}`;
}

export async function listPublicEvents({ calendarId, apiKey, timeMin, timeMax, showDeleted = false }) {
  if (!apiKey) throw new Error('Missing Google API key');
  const url = buildEventsUrl({ calendarId, apiKey, timeMin, timeMax, showDeleted });
  const resp = await fetch(url);
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`Calendar API error (${resp.status}): ${text}`);
  }
  const data = await resp.json();
  const items = Array.isArray(data.items) ? data.items : [];
  // Attach calendarId for downstream labeling
  return items.map((ev) => ({ ...ev, __calendarId: calendarId }));
}

export async function fetchIndiaHolidayEvents({ apiKey, timeMin, timeMax }) {
  const all = await Promise.all(
    INDIA_CALENDARS.map((calId) =>
      listPublicEvents({ calendarId: calId, apiKey, timeMin, timeMax }).catch((e) => {
        console.warn(`Failed fetching ${calId}:`, e);
        return [];
      })
    )
  );
  // Flatten and sort by start time
  const merged = all.flat();
  merged.sort((a, b) => {
    const aStart = a.start?.dateTime || a.start?.date || '';
    const bStart = b.start?.dateTime || b.start?.date || '';
    return aStart.localeCompare(bStart);
  });
  return merged;
}