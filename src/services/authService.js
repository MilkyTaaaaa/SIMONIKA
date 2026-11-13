import { ENDPOINTS, USE_MOCK_AUTH } from '../config/api.js';
import { ApiError, request, tokenStore } from './apiClient.js';
import { mockAuthService } from '../mocks/presensiMock.js';
import { ROLE_LABEL } from '../utils/rolePermissions.js';

// Backend: Laravel Sanctum personal access token.
//   POST /auth/login  { username, password } -> { message, token, user: { id, name, role, jabatan_id } }
//   GET  /me          -> objek user (tanpa pembungkus)
//   POST /auth/logout -> { message }
// Backend belum mengirim nama jabatan (hanya jabatan_id), maka tampilan memakai label role sebagai
// pengganti sampai backend menambahkan relasi `jabatan` pada /me (USULAN, lihat docs).
const normalizeUser = (u) => ({
  id: u.id,
  name: u.name,
  username: u.username,
  role: u.role,
  jabatanId: u.jabatan_id ?? null,
  jabatan: u.jabatan?.nama_lokal || ROLE_LABEL[u.role] || u.role,
});

const realAuthService = {
  async login(credentials) {
    const res = await request(ENDPOINTS.auth.login, { method: 'POST', body: credentials });
    if (!res?.token || !res?.user) throw new ApiError(500, 'Respons login dari server tidak sesuai.');
    tokenStore.set(res.token);
    return normalizeUser(res.user);
  },
  async getCurrentUser() {
    // Tanpa token tidak perlu memanggil server.
    if (!tokenStore.get()) throw new ApiError(401, 'Belum masuk.');
    return normalizeUser(await request(ENDPOINTS.auth.me));
  },
  async logout() {
    try {
      await request(ENDPOINTS.auth.logout, { method: 'POST' });
    } finally {
      tokenStore.clear();
    }
  },
};

export const authService = USE_MOCK_AUTH ? mockAuthService : realAuthService;
