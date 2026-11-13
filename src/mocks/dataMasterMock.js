// MOCK / SIMULASI untuk pengembangan UI. Perubahan hanya di memori browser (hilang saat refresh)
// dan TIDAK tersimpan ke database. Aktif hanya jika VITE_USE_MOCK_DATA_MASTER=true (atau VITE_USE_MOCK=true).
import { ApiError } from '../services/apiClient.js';

const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms));
const base = (id, nama, jabatan, jabatanLabel, username, target, capaian) => ({
  id: `m${id}`, nama, role: 'pamong', jabatan, jabatanLabel, nip: '', wilayah: '', username,
  targetKegiatan: target, capaian, paguTukin: 2200000, status: 'aktif',
});
let rows = [
  base(1, 'Aparatur Contoh 01', 'Carik', 'Carik (Sekretaris Kalurahan)', 'carik_hargomulyo', 30, 29),
  base(2, 'Aparatur Contoh 02', 'Kasi', 'Kasi (Jagabaya)', 'jagabaya_santoso', 30, 27),
  base(3, 'Aparatur Contoh 03', 'Kasi', 'Kasi (Ulu-Ulu)', 'uluulu_bambang', 30, 31),
  base(4, 'Aparatur Contoh 04', 'Kasi', 'Kasi (Kamituwa)', 'kamituwa_siti', 30, 28),
  base(5, 'Aparatur Contoh 05', 'Kaur', 'Kaur (Danarta)', 'danarta_rudi', 30, 30),
  base(6, 'Aparatur Contoh 06', 'Dukuh', 'Dukuh Padukuhan Contoh 1', 'dukuh_contoh1', 24, 23),
  base(7, 'Aparatur Contoh 07', 'Dukuh', 'Dukuh Padukuhan Contoh 2', 'dukuh_contoh2', 24, 21),
  base(8, 'Aparatur Contoh 08', 'Dukuh', 'Dukuh Padukuhan Contoh 3', 'dukuh_contoh3', 24, 24),
  ...Array.from({ length: 8 }, (_, i) =>
    base(9 + i, `Aparatur Contoh ${String(9 + i).padStart(2, '0')}`, 'Dukuh', `Dukuh Padukuhan Contoh ${4 + i}`, `dukuh_contoh${4 + i}`, 24, 20 + (i % 5))),
];

const usernameTaken = (u, exceptId) => rows.some((r) => r.username.toLowerCase() === u.toLowerCase() && r.id !== exceptId);
const label = (p) => (p.wilayah ? `${p.jabatan} (${p.wilayah})` : p.jabatan);

export const mockDataMasterService = {
  async getJabatan() {
    return [{ jabatan: 'Carik', target: 30 }, { jabatan: 'Kasi', target: 30 }, { jabatan: 'Kaur', target: 30 }, { jabatan: 'Dukuh', target: 24 }];
  },
  async list({ page = 1, perPage = 8, search = '' } = {}) {
    await delay();
    const q = search.trim().toLowerCase();
    const all = rows.filter((r) => !q || r.nama.toLowerCase().includes(q) || r.jabatanLabel.toLowerCase().includes(q) || r.username.toLowerCase().includes(q));
    const start = (page - 1) * perPage;
    return { items: structuredClone(all.slice(start, start + perPage)), total: all.length, page, perPage };
  },
  async create(p) {
    await delay(800);
    if (usernameTaken(p.username)) throw new ApiError(422, 'Data tidak valid.', { errors: { username: 'Username sudah digunakan.' } });
    const { password: _pw, ...rest } = p;
    rows.push({ ...rest, id: `m${Date.now()}`, jabatanLabel: label(p), capaian: 0, status: 'aktif' });
    return { simulated: true, message: 'Respons simulasi: data hanya ada di memori dan tidak tersimpan ke database.' };
  },
  async update(id, p) {
    await delay(800);
    if (usernameTaken(p.username, id)) throw new ApiError(422, 'Data tidak valid.', { errors: { username: 'Username sudah digunakan.' } });
    const { password: _pw, ...rest } = p;
    rows = rows.map((r) => (r.id === id ? { ...r, ...rest, jabatanLabel: label(p) } : r));
    return { simulated: true, message: 'Respons simulasi: perubahan tidak tersimpan ke database.' };
  },
  async remove(id) {
    await delay(600);
    rows = rows.filter((r) => r.id !== id);
    return { simulated: true, message: 'Respons simulasi: penghapusan tidak tersimpan ke database.' };
  },
};
