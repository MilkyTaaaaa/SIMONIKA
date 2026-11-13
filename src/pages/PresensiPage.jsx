import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { can } from '../utils/rolePermissions.js';
import PresensiPamongView from '../components/presensi/PresensiPamongView.jsx';
import PresensiMonitoringView from '../components/presensi/PresensiMonitoringView.jsx';

// Satu halaman Presensi; konten mengikuti role dari backend.
// Rekap/pemantauan seluruh Pamong HANYA dirender untuk role dengan izin 'monitoring' (Admin).
export default function PresensiPage() {
  const { user } = useAuth();
  if (can(user.role, 'monitoring')) return <PresensiMonitoringView user={user} />;
  if (can(user.role, 'selfPresensi')) return <PresensiPamongView user={user} />;
  return <Navigate to="/akses-ditolak" replace />;
}
