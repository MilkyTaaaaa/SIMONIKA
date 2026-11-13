// Konfigurasi API. Seluruh nilai dapat diubah lewat file .env (lihat .env.example).
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Mock hanya untuk pengembangan UI. VITE_USE_MOCK=false memakai backend untuk semua modul.
// Setiap modul dapat di-override: VITE_USE_MOCK_AUTH, VITE_USE_MOCK_DATA_MASTER, VITE_USE_MOCK_PRESENSI.
// Contoh: backend sudah punya auth + users tetapi belum punya presensi -> MOCK=false, MOCK_PRESENSI=true.
const flag = (v, fallback) => (v === undefined || v === '' ? fallback : String(v) === 'true');
const GLOBAL_MOCK = flag(import.meta.env.VITE_USE_MOCK, true);
export const USE_MOCK_AUTH = flag(import.meta.env.VITE_USE_MOCK_AUTH, GLOBAL_MOCK);
export const USE_MOCK_DATA_MASTER = flag(import.meta.env.VITE_USE_MOCK_DATA_MASTER, GLOBAL_MOCK);
export const USE_MOCK_PRESENSI = flag(import.meta.env.VITE_USE_MOCK_PRESENSI, GLOBAL_MOCK);
export const MOCK_MODULES = [
  USE_MOCK_AUTH && 'login',
  USE_MOCK_DATA_MASTER && 'Data Master',
  USE_MOCK_PRESENSI && 'Presensi',
].filter(Boolean);

// Endpoint auth & master di bawah SUDAH ADA di backend (routes/api.php, terverifikasi).
// Endpoint presensi masih USULAN: belum ada di backend (lihat docs/API_INTEGRATION.md).
export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    me: '/me',
    logout: '/auth/logout',
  },
  master: {
    users: '/users',
    user: (id) => `/users/${id}`,
    jabatan: '/jabatan',
  },
  presensi: {
    today: '/presensi/saya/hari-ini',
    peerStatus: '/presensi/rekan/status-hari-ini', // status kehadiran rekan (BUKAN rekap)
    summary: '/presensi/saya/rekap',
    history: '/presensi/saya/riwayat',
    izinQuota: '/presensi/saya/kuota-izin',
    masuk: '/presensi/masuk',
    pulang: '/presensi/pulang',
    tugasLuar: '/presensi/tugas-luar',
    izin: '/presensi/izin',
    monitoringSummary: '/presensi/pemantauan/rekap',
    monitoringList: '/presensi/pemantauan',
    detail: (id) => `/presensi/${id}`,
  },
};
