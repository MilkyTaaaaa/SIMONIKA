import { Pencil, Trash2 } from 'lucide-react';
import { EmptyState } from '../ui/States.jsx';

export default function AparaturTable({ items, onEdit, onDelete }) {
  if (!items.length) return <EmptyState title="Data aparatur tidak ditemukan" message="Ubah kata kunci pencarian atau tambahkan data baru." />;
  return (
    <div className="table-wrap">
      <table className="table table--head-blue">
        <caption className="sr-only">Daftar nama jabatan dan aparatur pemerintah kalurahan</caption>
        <thead>
          <tr><th>NAMA LENGKAP</th><th>JABATAN SOTK</th><th>USERNAME SISTEM</th><th>TARGET KEGIATAN</th><th>CAPAIAN BULAN INI</th><th>STATUS AKUN</th><th>AKSI MANAJEMEN</th></tr>
        </thead>
        <tbody>
          {items.map((r) => {
            const noCapaian = r.capaian === null || r.capaian === undefined; // backend belum menyediakan capaian
            const pct = !noCapaian && r.targetKegiatan ? Math.min(100, Math.round((r.capaian / r.targetKegiatan) * 100)) : 0;
            const aktif = r.status === 'aktif';
            return (
              <tr key={r.id}>
                <td><b>{r.nama}</b></td>
                <td className="small">{r.jabatanLabel || r.jabatan}</td>
                <td><b className="small">{r.username}</b></td>
                <td className="td-center"><b>{r.targetKegiatan}</b></td>
                <td>
                  {noCapaian ? <span className="muted small">Belum tersedia</span> : <div className="progress-row">
                    <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Capaian ${r.capaian} dari ${r.targetKegiatan}`}><span style={{ width: `${pct}%` }} /></div>
                    <b className="small t-green">{r.capaian} / {r.targetKegiatan}</b>
                  </div>}
                </td>
                <td><span className={`badge ${aktif ? 'badge--green' : 'badge--grey'}`}>{aktif ? 'Aktif' : 'Nonaktif'}</span></td>
                <td>
                  <div className="row-actions">
                    <button type="button" className="icon-btn icon-btn--edit" onClick={() => onEdit(r)} aria-label={`Ubah data ${r.nama}`} title="Ubah"><Pencil size={17} aria-hidden="true" /></button>
                    <button type="button" className="icon-btn icon-btn--del" onClick={() => onDelete(r)} aria-label={`Hapus data ${r.nama}`} title="Hapus"><Trash2 size={17} aria-hidden="true" /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
