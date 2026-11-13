import { CircleCheck, History } from 'lucide-react';
import { LoadingState, ErrorState, EmptyState } from '../ui/States.jsx';

export default function PresensiHistory({ data, loading, error, onRetry, title = 'Riwayat Presensi Pamong' }) {
  const items = data?.items || [];
  return (
    <section className="card section section--flush">
      <h2 className="section__title section__title--pad"><History size={18} aria-hidden="true" /> {title}</h2>
      {loading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={onRetry} />}
      {data && items.length === 0 && <EmptyState title="Belum ada riwayat presensi" />}
      {items.length > 0 && (
        <div className="table-wrap table-wrap--scroll">
          <table className="table">
            <caption className="sr-only">Riwayat presensi</caption>
            <thead>
              <tr><th>TANGGAL &amp; HARI</th><th>JAM MASUK</th><th>JAM PULANG</th><th>STATUS PRESENSI</th><th>LAMPIRAN BUKTI</th><th>STATUS VERIFIKASI</th></tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td><b>{r.tanggal}</b></td>
                  <td className="t-green">{r.jamMasuk || '--:-- WIB'}</td>
                  <td className={r.jamPulang ? 't-red' : 't-red t-dashed'}>{r.jamPulang || '--:-- WIB'}</td>
                  <td><b>{r.jenis}</b>{r.detail && <small className="block muted">{r.detail}</small>}</td>
                  <td>{r.lampiran?.url ? <a href={r.lampiran.url} target="_blank" rel="noreferrer">{r.lampiran.label}</a> : <span className="t-teal">{r.lampiran?.label || '-'}</span>}</td>
                  <td><span className="badge badge--green"><CircleCheck size={12} aria-hidden="true" /> {r.verifikasi}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
