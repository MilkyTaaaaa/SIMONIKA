import { WORK_HOURS } from '../config/presensi.js';

export function jakartaParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: WORK_HOURS.timeZone,
    hour12: false,
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t)?.value;
  return {
    weekday: get('weekday'),
    hour: Number(get('hour')) % 24,
    minute: Number(get('minute')),
    second: Number(get('second')),
  };
}

export const formatClock = (date) => {
  const p = jakartaParts(date);
  const z = (n) => String(n).padStart(2, '0');
  return `${z(p.hour)}:${z(p.minute)}:${z(p.second)}`;
};

export const formatDateLong = (date) =>
  new Intl.DateTimeFormat('id-ID', {
    timeZone: WORK_HOURS.timeZone,
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);

export const todayIso = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: WORK_HOURS.timeZone }).format(new Date());

export function workEndFor(date) {
  return jakartaParts(date).weekday === 'Friday' ? WORK_HOURS.endFri : WORK_HOURS.endMonThu;
}

// Hanya untuk petunjuk UI (memunculkan kolom alasan). Keputusan akhir ada di backend.
export function isBeforeWorkEnd(date) {
  const p = jakartaParts(date);
  return p.hour * 60 + p.minute < workEndFor(date).minutes;
}
