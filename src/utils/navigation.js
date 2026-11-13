import { Database, User } from 'lucide-react';
import { can } from './rolePermissions.js';

// Menu hanya yang termasuk ruang lingkup Presensi. permission: null = semua role.
export const NAV_ITEMS = [
  { to: '/data-master', label: 'Data Master', icon: Database, permission: 'dataMaster' },
  { to: '/presensi', label: 'Presensi', icon: User, permission: null },
];

// Halaman awal setelah login = menu pertama yang boleh diakses role (Admin: Data Master).
export const homeFor = (role) => navFor(role)[0]?.to || '/presensi';

export const navFor = (role) => NAV_ITEMS.filter((i) => !i.permission || can(role, i.permission));
