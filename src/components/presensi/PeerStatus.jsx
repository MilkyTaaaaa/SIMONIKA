import { Users } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge.jsx';
import { LoadingState, ErrorState, EmptyState } from '../ui/States.jsx';
import { USE_MOCK_PRESENSI } from '../../config/api.js';

const TONE = { hadir: 'green', tugas_luar: 'amber', izin: 'blue', sakit: 'blue', cuti: 'blue' };

// Hanya status kehadiran HARI INI. Bukan rekap, statistik, atau riwayat absensi Pamong.
export default function PeerStatus({ data, loading, error, onRetry }) {
  const items = data?.items || [];
  return (
    <section className="card section section--flush">
      <h2 className="section__title section__title--pad"><Users size={18} aria-hidden="true" /> Status Kehadiran Rekan Pamong</h2>
      <p className="muted section__sub section__sub--pad">
        Informasi kehadiran rekan Pamong untuk hari ini{USE_MOCK_PRESENSI ? ' (Ilustrasi/simulasi)' : ''}.
      </p>
      {loading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={onRetry} />}
      {data && items.length === 0 && <EmptyState title="Belum ada data kehadiran hari ini" />}
      {items.length > 0 && (
        <div className="table-wrap table-wrap--scroll">
          <table className="table">
            <caption className="sr-only">Status kehadiran rekan Pamong hari ini</caption>
            <thead><tr><th>NAMA PAMONG</th><th>JABATAN</th><th>STATUS</th><th>DATANG</th><th>LOKASI</th><th>AGENDA HARIAN</th></tr></thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td><b>{r.nama}</b></td>
                  <td>{r.jabatan}</td>
                  <td><StatusBadge status={r.status} label={r.statusLabel} tone={TONE[r.status]} /></td>
                  <td>{r.jamDatang ? <b className="t-green">{r.jamDatang}</b> : <span className="t-red">—</span>}</td>
                  <td>{r.lokasi || '—'}</td>
                  <td>{r.agenda || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
