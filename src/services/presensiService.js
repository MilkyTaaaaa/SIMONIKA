import { ENDPOINTS, USE_MOCK_PRESENSI } from '../config/api.js';
import { request } from './apiClient.js';
import { mockPresensiService } from '../mocks/presensiMock.js';

const E = ENDPOINTS.presensi;

const toForm = (payload) => {
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    fd.append(k, v instanceof Blob ? v : String(v), v instanceof Blob ? `${k}.jpg` : undefined);
  });
  return fd;
};

// BLOCKED: backend BELUM memiliki endpoint presensi. Path & payload di bawah adalah USULAN
// (docs/BACKEND_REQUIREMENTS.md). Selama itu, modul Presensi berjalan dengan mock (VITE_USE_MOCK_PRESENSI=true).
const realPresensiService = {
  getMyToday: () => request(E.today),
  getPeerStatus: () => request(E.peerStatus),
  getMySummary: () => request(E.summary),
  getMyHistory: (params) => request(E.history, { params }),
  getIzinQuota: () => request(E.izinQuota),
  createPresensiMasuk: (p) => request(E.masuk, { method: 'POST', body: toForm(p) }),
  createPresensiPulang: (p) => request(E.pulang, { method: 'POST', body: toForm(p) }),
  createTugasLuar: (p) => request(E.tugasLuar, { method: 'POST', body: toForm(p) }),
  createIzin: (p) => request(E.izin, { method: 'POST', body: p }),
  getMonitoringSummary: (params) => request(E.monitoringSummary, { params }),
  getMonitoringList: (params) => request(E.monitoringList, { params }),
  getPresensiDetail: (id) => request(E.detail(id)),
};

export const presensiService = USE_MOCK_PRESENSI ? mockPresensiService : realPresensiService;
