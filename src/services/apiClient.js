import { API_BASE_URL } from '../config/api.js';

const TOKEN_KEY = 'simonika_token';
let unauthorizedHandler = null;

// Hanya token sesi yang disimpan (sessionStorage). Password TIDAK PERNAH disimpan.
export const tokenStore = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (t) => (t ? sessionStorage.setItem(TOKEN_KEY, t) : sessionStorage.removeItem(TOKEN_KEY)),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
};

export const setUnauthorizedHandler = (fn) => {
  unauthorizedHandler = fn;
};

export class ApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const DEFAULT_MESSAGES = {
  0: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda lalu coba lagi.',
  401: 'Sesi Anda berakhir. Silakan masuk kembali.',
  403: 'Anda tidak memiliki izin untuk tindakan ini.',
  404: 'Data yang diminta tidak ditemukan.',
  422: 'Data yang dikirim belum sesuai. Periksa kembali isian Anda.',
  500: 'Terjadi gangguan pada server. Coba lagi beberapa saat lagi.',
};

export const errorMessage = (err) =>
  err instanceof ApiError ? err.message : 'Terjadi kesalahan. Coba lagi.';

export async function request(path, { method = 'GET', body, params, signal } = {}) {
  const url = new URL(API_BASE_URL.replace(/\/$/, '') + path, window.location.origin);
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  });

  const headers = { Accept: 'application/json' };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body && !isForm) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
      signal,
    });
  } catch {
    throw new ApiError(0, DEFAULT_MESSAGES[0]);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* respons bukan JSON */
  }

  if (!res.ok) {
    if (res.status === 401 && unauthorizedHandler) unauthorizedHandler();
    // Pesan dari backend dipakai bila ada, KECUALI 5xx (bisa memuat detail SQL/debug): pakai pesan umum.
    const msg = (res.status < 500 && data?.message) || DEFAULT_MESSAGES[res.status] || DEFAULT_MESSAGES[500];
    throw new ApiError(res.status, msg, data);
  }
  return data;
}
