export const ROLES = ['pamong', 'lurah', 'admin'];
export const ROLE_LABEL = { pamong: 'Pamong', lurah: 'Lurah', admin: 'Admin' };

export const isValidRole = (role) => ROLES.includes(role);

// Hanya mengatur TAMPILAN/NAVIGASI. Backend tetap wajib memvalidasi izin pada setiap request.
const PERMISSIONS = {
  pamong: { selfPresensi: true },
  // Lurah: presensi pribadi + status kehadiran rekan. TIDAK ada rekap/laporan absensi Pamong.
  lurah: { selfPresensi: true, peerStatus: true },
  admin: { monitoring: true, detail: true, locationColumn: true, dataMaster: true },
};

export const can = (role, key) => Boolean(PERMISSIONS[role]?.[key]);
