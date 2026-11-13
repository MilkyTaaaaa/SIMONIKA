import { Search } from 'lucide-react';
import { JABATAN_OPTIONS, STATUS_OPTIONS } from '../../config/presensi.js';

export default function PresensiFilter({ value, onChange }) {
  const set = (k) => (e) => onChange({ ...value, [k]: e.target.value });
  return (
    <div className="filters" role="search">
      <div className="field field--search">
        <label htmlFor="f-search" className="sr-only">Cari nama</label>
        <Search size={15} aria-hidden="true" />
        <input id="f-search" placeholder="Cari nama ..." value={value.search} onChange={set('search')} />
      </div>
      <div className="field"><label htmlFor="f-jabatan" className="sr-only">Jabatan</label>
        <select id="f-jabatan" value={value.jabatan} onChange={set('jabatan')}>
          <option value="">Pilih Semua Jabatan</option>
          {JABATAN_OPTIONS.map((j) => <option key={j} value={j}>{j}</option>)}
        </select></div>
      <div className="field"><label htmlFor="f-status" className="sr-only">Status</label>
        <select id="f-status" value={value.status} onChange={set('status')}>
          <option value="">Semua Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select></div>
      <div className="field"><label htmlFor="f-tanggal" className="sr-only">Tanggal</label>
        <input id="f-tanggal" type="date" value={value.tanggal} onChange={set('tanggal')} /></div>
    </div>
  );
}
