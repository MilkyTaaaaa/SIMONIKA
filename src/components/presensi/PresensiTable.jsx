import StatusBadge from '../ui/StatusBadge.jsx';
import { EmptyState } from '../ui/States.jsx';

export default function PresensiTable({ items, showLocation, canDetail, onDetail }) {
  if (!items.length) return <EmptyState title="Tidak ada data presensi" message="Ubah kata kunci atau filter pencarian." />;
  return (
    <div className="table-wrap">
      <table className="table table--head-blue">
        <caption className="sr-only">Catatan presensi harian pamong</caption>
        <thead>
          <tr>
            <th>NAMA PAMONG</th><th>JABATAN SOTK</th><th>JENIS PRESENSI</th><th>JAM MASUK</th><th>METODE PRESENSI</th><th>STATUS PRESENSI</th>
            {showLocation && <th>LOKASI</th>}{canDetail && <th>AKSI</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id}>
              <td><b>{r.nama}</b></td>
              <td className="t-teal">{r.jabatan}</td>
              <td><b className="small">{r.jenisPresensi}</b></td>
              <td><b>{r.jamMasuk}</b></td>
              <td><b className="tiny">{r.metode}</b></td>
              <td><StatusBadge status={r.status} label={r.statusLabel} /></td>
              {showLocation && <td className="small">{r.lokasi || '-'}</td>}
              {canDetail && <td><button type="button" className="btn btn--outline btn--xs" onClick={() => onDetail(r.id)}>Detail</button></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
