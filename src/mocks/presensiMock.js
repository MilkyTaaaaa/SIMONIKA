// ============================================================================
// MOCK SERVICE - DATA SIMULASI UNTUK PENGEMBANGAN UI.
// Bukan backend, bukan autentikasi sungguhan, tidak tersimpan ke database.
// Aktif hanya jika VITE_USE_MOCK=true. Jangan dipakai di produksi.
// ============================================================================
import { ApiError, tokenStore } from '../services/apiClient.js';
import { todayIso } from '../utils/format.js';

const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms));

const MOCK_USERS = {
  pamong: { id: 'mock-1', name: 'Pamong Contoh', jabatan: 'Kaur (Tata Laksana)', role: 'pamong' },
  lurah: { id: 'mock-2', name: 'Lurah Contoh', jabatan: 'Lurah', role: 'lurah' },
  admin: { id: 'mock-3', name: 'Admin Contoh', jabatan: 'Admin Presensi', role: 'admin' },
};

export const mockAuthService = {
  async login({ username, password }) {
    await delay();
    const cleanUser = String(username || '').trim().toLowerCase();
    let user = MOCK_USERS[cleanUser];
    if (!user) {
      if (cleanUser.includes('admin')) {
        user = { ...MOCK_USERS.admin, name: username || MOCK_USERS.admin.name };
      } else if (cleanUser.includes('lurah')) {
        user = { ...MOCK_USERS.lurah, name: username || MOCK_USERS.lurah.name };
      } else {
        user = {
          id: 'mock-1',
          name: username || 'Nama Pamong',
          jabatan: 'Kasi Kemakmuran',
          role: 'pamong',
        };
      }
    }
    tokenStore.set(`mock-${user.role}`);
    return user;
  },
  async getCurrentUser() {
    await delay(100);
    const t = tokenStore.get() || '';
    const roleKey = t.replace('mock-', '');
    const user = MOCK_USERS[roleKey] || MOCK_USERS.pamong;
    return user;
  },
  async logout() {
    tokenStore.clear();
  },
};

// ---------- data pribadi (Pamong) ----------
const myState = {
  today: { datang: null, pulang: null, tugasLuar: null, izin: null, statusLabel: null },
  history: [
    { id: 'h1', tanggal: 'Kamis, 24 Okt 2024', jamMasuk: '07:32 WIB', jamPulang: '15:30 WIB', jenis: 'Datang', lampiran: { label: 'Swafoto Wajah' }, verifikasi: 'Tervalidasi', detail: 'Radius 18m • Geofence Valid' },
    { id: 'h2', tanggal: 'Rabu, 23 Okt 2024', jamMasuk: '07:32 WIB', jamPulang: '15:30 WIB', jenis: 'Izin Sakit', lampiran: { label: 'Alasan' }, verifikasi: 'Tervalidasi' },
    { id: 'h3', tanggal: 'Selasa, 22 Okt 2024', jamMasuk: '07:32 WIB', jamPulang: '15:30 WIB', jenis: 'Tugas Luar', lampiran: { label: 'Alasan' }, verifikasi: 'Tervalidasi' },
    { id: 'h4', tanggal: 'Senin, 21 Okt 2024', jamMasuk: '07:30 WIB', jamPulang: '15:45 WIB', jenis: 'Datang', lampiran: { label: 'Swafoto Wajah' }, verifikasi: 'Tervalidasi' },
  ],
  quota: 4,
};

const nowLabel = () =>
  new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' })
    .format(new Date())
    .replace('.', ':');

// ---------- data pemantauan (Lurah/Admin) ----------
const JENIS = ['Presensi Datang', 'Tugas Luar', 'Presensi Datang', 'Izin Sakit', 'Presensi Datang', 'Presensi Datang'];
const META = { 'Presensi Datang': 'SWAFOTO', 'Tugas Luar': 'DOKUMEN', 'Izin Sakit': 'ALASAN' };
const STAT = { 'Presensi Datang': 'tepat_waktu', 'Tugas Luar': 'tugas_luar', 'Izin Sakit': 'izin' };
const LABEL = { tepat_waktu: 'Tepat Waktu', tugas_luar: 'Tugas Luar', izin: 'Izin', terlambat: 'Terlambat' };
const JABATAN = [
  'Carik (Sekretaris Kalurahan)', 'Kaur (Danarta)', 'Kasi (Jagabaya)', 'Kaur (Pangripta)',
  'Kasi (Kamituwa)', 'Kaur (Tata Laksana)', 'Kasi (Ulu-Ulu)',
  ...Array.from({ length: 9 }, (_, i) => `Dukuh (Padukuhan ${i + 1})`),
];
const APARATUR = JABATAN.map((jabatan, i) => {
  const jenis = JENIS[i % JENIS.length];
  let status = STAT[jenis];
  let jam = '07:00:00 WIB';
  if (i === 2) { status = 'terlambat'; jam = '07:45:00 WIB'; }
  return {
    id: `a${i + 1}`,
    nama: `Pamong Contoh ${String(i + 1).padStart(2, '0')}`,
    jabatan, jenisPresensi: jenis, jamMasuk: jam, jamPulang: null,
    metode: META[jenis], status, statusLabel: LABEL[status],
    lokasi: jenis === 'Presensi Datang' ? 'Balai Kalurahan (radius 18 m)' : 'Di luar kantor',
    keterangan: jenis === 'Presensi Datang' ? '' : 'Data simulasi',
  };
});

const filterAparatur = ({ search, jabatan, status } = {}) =>
  APARATUR.filter(
    (a) =>
      (!search || a.nama.toLowerCase().includes(search.toLowerCase())) &&
      (!jabatan || a.jabatan.startsWith(jabatan)) &&
      (!status || a.status === status || (status === 'izin' && a.status === 'izin'))
  );

export const mockPresensiService = {
  async getPeerStatus() {
    await delay();
    return { items: [
      { id: 'p1', nama: 'Budi Santoso', jabatan: 'Kasi Pemerintahan', status: 'hadir', statusLabel: 'Hadir', jamDatang: '07:30 WIB', lokasi: 'Balai Kalurahan', agenda: 'Rapat koordinasi kebersihan lingkungan' },
      { id: 'p2', nama: 'Rina Widyastuti', jabatan: 'Kasi Kesejahteraan', status: 'tugas_luar', statusLabel: 'Tugas Luar', jamDatang: '07:15 WIB', lokasi: 'Lapangan Hargomulyo', agenda: 'Pengawasan kegiatan PKK dan posyandu' },
      { id: 'p3', nama: 'Andi Pratama', jabatan: 'Kasi Pelayanan', status: 'izin', statusLabel: 'Izin', jamDatang: null, lokasi: null, agenda: 'Izin cuti tahunan (Ilustrasi)' },
    ] };
  },
  async getMyToday() { await delay(); return structuredClone(myState.today); },
  async getMySummary() {
    await delay();
    return { periodeLabel: 'Oktober 2024', totalHariKerja: 22, totalHadir: 18, tepatWaktu: 17, terlambat: 1, izin: 0, tugasLuar: 1, catatanTerlambat: '07:47 WIB pada 04 Okt (Toleransi)' };
  },
  async getMyHistory() { await delay(); return { items: structuredClone(myState.history), total: myState.history.length }; },
  async getIzinQuota() { await delay(200); return { maksimalPerBulan: 5, sisa: myState.quota }; },

  async createPresensiMasuk() {
    await delay(900);
    myState.today.datang = { waktu: nowLabel(), status: 'tepat_waktu' };
    myState.today.statusLabel = 'Hadir (simulasi)';
    return { simulated: true, message: 'Respons simulasi: tidak tersimpan ke database.' };
  },
  async createPresensiPulang() {
    await delay(900);
    myState.today.pulang = { waktu: nowLabel() };
    return { simulated: true, message: 'Respons simulasi: tidak tersimpan ke database.' };
  },
  async createTugasLuar() {
    await delay(900);
    myState.today.tugasLuar = { status: 'terverifikasi' };
    myState.today.statusLabel = 'Tugas Luar Terverifikasi (simulasi)';
    return { simulated: true, message: 'Respons simulasi: tidak tersimpan ke database.' };
  },
  async createIzin() {
    await delay(900);
    myState.today.izin = { status: 'diajukan' };
    return { simulated: true, message: 'Respons simulasi: tidak tersimpan ke database.' };
  },

  async getMonitoringSummary() {
    await delay();
    const c = (s) => APARATUR.filter((a) => a.status === s).length;
    return { tepatWaktu: c('tepat_waktu'), tugasLuar: c('tugas_luar'), izinSakitCuti: c('izin'), terlambat: c('terlambat') };
  },
  async getMonitoringList({ page = 1, perPage = 6, ...f } = {}) {
    await delay();
    const all = filterAparatur(f);
    const start = (page - 1) * perPage;
    return { items: all.slice(start, start + perPage), total: all.length, page, perPage, totalAparatur: APARATUR.length, tanggal: f.tanggal || todayIso() };
  },
  async getPresensiDetail(id) {
    await delay(300);
    const row = APARATUR.find((a) => a.id === id);
    if (!row) throw new ApiError(404, 'Data presensi tidak ditemukan.');
    return structuredClone(row);
  },
};
