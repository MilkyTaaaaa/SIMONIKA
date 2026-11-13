const num = (v) => (v === undefined || v === '' ? null : Number(v));

// Geofencing. Koordinat sengaja kosong sampai data resmi Balai Kalurahan diberikan.
export const GEOFENCE = {
  name: 'Balai Kalurahan Hargomulyo, Kokap, Kulon Progo',
  lat: num(import.meta.env.VITE_GEOFENCE_LAT),
  lng: num(import.meta.env.VITE_GEOFENCE_LNG),
  radiusM: num(import.meta.env.VITE_GEOFENCE_RADIUS_M) ?? 5000,
  maxAccuracyM: num(import.meta.env.VITE_GEOFENCE_MAX_ACCURACY_M) ?? 100,
};

// Jam kerja untuk TAMPILAN, diambil dari teks desain. Penentuan status dilakukan backend.
export const WORK_HOURS = {
  timeZone: 'Asia/Jakarta',
  start: '07.30',
  tolerance: '07.45',
  endMonThu: { label: '15.45', minutes: 15 * 60 + 45 },
  endFri: { label: '15.30', minutes: 15 * 60 + 30 },
};

export const PER_PAGE = 6;
export const JABATAN_OPTIONS = ['Carik', 'Kasi', 'Kaur', 'Dukuh'];
export const STATUS_OPTIONS = [
  { value: 'tepat_waktu', label: 'Tepat Waktu' },
  { value: 'terlambat', label: 'Terlambat' },
  { value: 'tugas_luar', label: 'Tugas Luar' },
  { value: 'izin', label: 'Izin / Sakit / Cuti' },
];
export const MAX_UPLOAD_MB = 5;
