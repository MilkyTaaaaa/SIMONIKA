import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { isValidRole } from '../utils/rolePermissions.js';
import { LoadingState } from '../components/ui/States.jsx';

// Proteksi route hanya untuk pengalaman pengguna; backend tetap memvalidasi izin.
export default function ProtectedRoute() {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <LoadingState fullscreen label="Memeriksa sesi…" />;
  if (status !== 'authenticated') return <Navigate to="/" replace state={{ from: location }} />;
  if (!isValidRole(user?.role)) return <Navigate to="/akses-ditolak" replace />;
  return <Outlet />;
}
