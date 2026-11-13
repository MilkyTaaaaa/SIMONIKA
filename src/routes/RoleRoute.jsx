import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { can } from '../utils/rolePermissions.js';

// Pembatasan akses halaman per kemampuan (UX saja; backend tetap memvalidasi).
export default function RoleRoute({ permission }) {
  const { user } = useAuth();
  return can(user?.role, permission) ? <Outlet /> : <Navigate to="/akses-ditolak" replace />;
}
