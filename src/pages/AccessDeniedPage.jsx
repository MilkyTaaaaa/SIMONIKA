import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { isValidRole } from '../utils/rolePermissions.js';

export default function AccessDeniedPage() {
  const { logout, status, user } = useAuth();
  return (
    <div className="center-page">
      <div className="auth-card">
        <ShieldAlert size={36} aria-hidden="true" className="auth-card__icon" />
        <h1>Akses ditolak</h1>
        <p>Akun Anda tidak memiliki peran yang dikenali untuk membuka halaman Presensi. Hubungi administrator.</p>
        {status === 'authenticated' ? (
          <>
            {isValidRole(user?.role) && <Link className="btn btn--outline" to="/presensi">Kembali ke Presensi</Link>}
            <button type="button" className="btn btn--primary" onClick={logout}>Keluar</button>
          </>
        ) : (
          <Link className="btn btn--primary" to="/">Kembali ke halaman masuk</Link>
        )}
      </div>
    </div>
  );
}
