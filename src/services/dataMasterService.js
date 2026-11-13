import { ENDPOINTS, USE_MOCK_DATA_MASTER } from '../config/api.js';
import { ApiError, request } from './apiClient.js';
import { mockDataMasterService } from '../mocks/dataMasterMock.js';
import { JABATAN_OPTIONS } from '../config/presensi.js';

const E = ENDPOINTS.master;

// ---------------------------------------------------------------------------
// Adapter ke backend Laravel (terverifikasi pada routes/api.php + uji runtime).
//   GET    /users            -> { data: [user] }  (tanpa pagination/pencarian; filter ?role & ?jabatan_id)
//   POST   /users            -> 201 { message, data }
//   PUT    /users/{id}       -> { message }       (hanya name, jabatan_id, padukuhan, pagu_tukin, password)
//   DELETE /users/{id}       -> { message }
//   GET    /jabatan          -> { data: [{ id, kode_standar, nama_lokal, beban_kerja_minimal_bulanan }] }
// Semua endpoint di atas khusus role admin.
//
// Pemetaan UI -> backend:
//   nama -> name | wilayah -> padukuhan | paguTukin -> pagu_tukin | jabatan (Carik/Kasi/..) -> jabatan_id
//   targetKegiatan -> TURUNAN dari jabatan.beban_kerja_minimal_bulanan (bukan field per-user)
//   nip, capaian, status -> tidak ada di backend (lihat docs/BACKEND_REQUIREMENTS.md)
// ---------------------------------------------------------------------------

export const DATA_MASTER_CAPS = USE_MOCK_DATA_MASTER
  ? { nip: true, editIdentity: true, targetPerUser: true }
  : { nip: false, editIdentity: false, targetPerUser: false };

const kodeToLabel = (kode) => JABATAN_OPTIONS.find((j) => j.toLowerCase() === String(kode).toLowerCase()) || kode;
const FIELD_MAP = { name: 'nama', padukuhan: 'wilayah', pagu_tukin: 'paguTukin', jabatan_id: 'jabatan' };

async function fetchJabatan() {
  const res = await request(E.jabatan);
  return (res?.data ?? []).map((j) => ({
    id: j.id,
    jabatan: kodeToLabel(j.kode_standar),
    target: j.beban_kerja_minimal_bulanan,
  }));
}

const toRow = (u, jabatanById) => {
  const jab = jabatanById.get(u.jabatan_id);
  const jabatan = jab?.jabatan ?? '';
  return {
    id: u.id,
    nama: u.name,
    role: u.role,
    jabatan,
    jabatanLabel: jabatan ? (u.padukuhan ? `${jabatan} (${u.padukuhan})` : jabatan) : '-',
    nip: '',
    wilayah: u.padukuhan ?? '',
    username: u.username,
    targetKegiatan: jab?.target ?? 0,
    capaian: null, // backend belum menyediakan capaian
    paguTukin: u.pagu_tukin ?? 0,
    status: 'aktif', // backend belum punya status akun; akun yang ada dapat login
  };
};

// Ubah galat validasi 422 backend ({errors:{name:[..]}}) ke nama field pada form.
const remapErrors = (err) => {
  if (err instanceof ApiError && err.data?.errors) {
    const errors = Object.fromEntries(Object.entries(err.data.errors).map(([k, v]) => [FIELD_MAP[k] || k, v]));
    throw new ApiError(err.status, err.message, { ...err.data, errors });
  }
  throw err;
};

const resolveJabatanId = async (nama) => {
  const found = (await fetchJabatan()).find((j) => j.jabatan === nama);
  if (!found) {
    throw new ApiError(422, 'Jabatan tidak ditemukan di server.', { errors: { jabatan: 'Jabatan tidak tersedia di backend.' } });
  }
  return found.id;
};

const realDataMasterService = {
  async getJabatan() {
    return fetchJabatan();
  },

  // Backend mengembalikan seluruh data; pencarian & paginasi dilakukan di sini agar UI tetap sama.
  async list({ page = 1, perPage = 8, search = '' } = {}) {
    const [users, jabatan] = await Promise.all([request(E.users), fetchJabatan()]);
    const byId = new Map(jabatan.map((j) => [j.id, j]));
    const q = search.trim().toLowerCase();
    const all = (users?.data ?? [])
      .filter((u) => u.role !== 'admin') // halaman ini mengelola aparatur (pamong/lurah)
      .map((u) => toRow(u, byId))
      .filter((r) => !q || [r.nama, r.jabatanLabel, r.username].some((v) => String(v).toLowerCase().includes(q)));
    const start = (page - 1) * perPage;
    return { items: all.slice(start, start + perPage), total: all.length, page, perPage };
  },

  async create(p) {
    try {
      const body = {
        username: p.username, password: p.password, name: p.nama, role: p.role,
        jabatan_id: await resolveJabatanId(p.jabatan),
        padukuhan: p.wilayah || null, pagu_tukin: p.paguTukin,
      };
      return await request(E.users, { method: 'POST', body });
    } catch (e) { return remapErrors(e); }
  },

  // `original` = baris yang sedang diubah. Hanya field yang berubah dikirim (backend memakai `sometimes`).
  async update(id, p, original = {}) {
    try {
      const body = {};
      if (p.nama !== original.nama) body.name = p.nama;
      if ((p.wilayah || '') !== (original.wilayah || '')) body.padukuhan = p.wilayah || null;
      if (Number(p.paguTukin) !== Number(original.paguTukin)) body.pagu_tukin = p.paguTukin;
      if (p.jabatan !== original.jabatan) body.jabatan_id = await resolveJabatanId(p.jabatan);
      if (p.password) body.password = p.password;
      if (!Object.keys(body).length) return { message: 'Tidak ada perubahan yang dikirim.' };
      return await request(E.user(id), { method: 'PUT', body });
    } catch (e) { return remapErrors(e); }
  },

  remove: (id) => request(E.user(id), { method: 'DELETE' }),
};

export const dataMasterService = USE_MOCK_DATA_MASTER ? mockDataMasterService : realDataMasterService;
