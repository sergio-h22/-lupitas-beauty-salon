import { HOURS } from './business';
import { serviceById } from './services';

export type Appointment = {
  id: string;
  serviceId: string;
  specialistId: string;
  /** YYYY-MM-DD in salon-local time. */
  date: string;
  /** HH:MM 24h. */
  time: string;
  minutes: number;
  name: string;
  phone: string;
  email: string;
  notes: string;
  status: 'pending' | 'approved' | 'cancelled';
  createdAt: string;
};

const STORE_KEY = 'lbs-appointments';
const BLOCKS_KEY = 'lbs-blocked';

/**
 * Demo persistence. Swap these four functions for API routes backed by a real
 * database and the rest of the booking UI keeps working unchanged.
 */
export function loadAppointments(): Appointment[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveAppointment(a: Appointment) {
  const all = loadAppointments();
  all.push(a);
  window.localStorage.setItem(STORE_KEY, JSON.stringify(all));
}

export function updateAppointment(id: string, patch: Partial<Appointment>) {
  const all = loadAppointments().map((a) => (a.id === id ? { ...a, ...patch } : a));
  window.localStorage.setItem(STORE_KEY, JSON.stringify(all));
  return all;
}

export function loadBlocked(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(BLOCKS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveBlocked(keys: string[]) {
  window.localStorage.setItem(BLOCKS_KEY, JSON.stringify(keys));
}

export function blockKey(date: string, time: string) {
  return `${date}T${time}`;
}

const SLOT_STEP_MIN = 30;

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function toHHMM(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Parses YYYY-MM-DD as a local date, avoiding the UTC shift of `new Date(str)`. */
export function parseLocalDate(date: string) {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Times a service can start on a given date: inside opening hours, long enough
 * to finish before close, not already taken by the same specialist, not blocked
 * by the owner, and not in the past.
 */
export function availableSlots(
  date: string,
  serviceId: string,
  specialistId: string,
  appointments: Appointment[],
  blocked: string[],
): string[] {
  const service = serviceById(serviceId);
  if (!service) return [];

  const day = parseLocalDate(date).getDay();
  const hours = HOURS.find((h) => h.day === day);
  if (!hours?.open || !hours.close) return [];

  const open = toMinutes(hours.open);
  const close = toMinutes(hours.close);
  const now = new Date();
  const isToday = date === formatDateKey(now);
  const nowMins = now.getHours() * 60 + now.getMinutes();

  const taken = appointments.filter(
    (a) => a.date === date && a.status !== 'cancelled' && (specialistId === 'any' || a.specialistId === specialistId),
  );

  const slots: string[] = [];
  for (let t = open; t + service.minutes <= close; t += SLOT_STEP_MIN) {
    if (isToday && t <= nowMins + 60) continue;
    if (blocked.includes(blockKey(date, toHHMM(t)))) continue;

    const overlaps = taken.some((a) => {
      const start = toMinutes(a.time);
      return t < start + a.minutes && start < t + service.minutes;
    });
    if (!overlaps) slots.push(toHHMM(t));
  }
  return slots;
}

export function formatTime(hhmm: string, lang: 'en' | 'es') {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date(2000, 0, 1, h, m);
  return d.toLocaleTimeString(lang === 'es' ? 'es-US' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatDuration(minutes: number, lang: 'en' | 'es') {
  if (minutes < 60) return `${minutes} min`;
  const h = minutes / 60;
  const label = lang === 'es' ? 'h' : h === 1 ? 'hr' : 'hrs';
  return `${Number.isInteger(h) ? h : h.toFixed(1)} ${label}`;
}

/** Google Calendar template link — works without any backend. */
export function calendarUrl(a: Appointment, title: string, location: string) {
  const start = parseLocalDate(a.date);
  const [h, m] = a.time.split(':').map(Number);
  start.setHours(h, m, 0, 0);
  const end = new Date(start.getTime() + a.minutes * 60000);
  const fmt = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}T${String(
      d.getHours(),
    ).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}00`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
