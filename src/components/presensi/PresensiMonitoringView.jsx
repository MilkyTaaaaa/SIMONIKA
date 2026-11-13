import { useEffect, useState } from 'react';
import StatCard from '../ui/StatCard.jsx';
import { ErrorState, LoadingState } from '../ui/States.jsx';
import PresensiFilter from './PresensiFilter.jsx';
import PresensiTable from './PresensiTable.jsx';
import PresensiDetailModal from './PresensiDetailModal.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { presensiService } from '../../services/presensiService.js';
import { can } from '../../utils/rolePermissions.js';
import { todayIso } from '../../utils/format.js';
import { PER_PAGE } from '../../config/presensi.js';

// Dipakai Lurah dan Admin. Cakupan data & tindakan ditentukan backend.
export default function PresensiMonitoringView({ user }) {
  const [filters, setFilters] = useState({ search: '', jabatan: '', status: '', tanggal: todayIso() });
  const [q, setQ] = useState(filters);
  const [page, setPage] = useState(1);
  const [detailId, setDetailId] = useState(null);

  useEffect(() => { // debounce pencarian
    const t = setTimeout(() => { setQ(filters); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [filters]);

  const summary = useAsync(() => presensiService.getMonitoringSummary({ tanggal: q.tanggal }), [q.tanggal]);
  const list = useAsync(() => presensiService.getMonitoringList({ ...q, page, perPage: PER_PAGE }), [q, page]);

  const d = list.data;
  const pages = d ? Math.max(1, Math.ceil(d.total / d.perPage)) : 1;
  const s = summary.data;

  return (
    <>
      <section className="card header-card header-card--simple">
        <div>
          <h1>Rekap Presensi Harian</h1>
          <p className="muted">Rekapitulasi kehadiran harian dan bulanan pamong kalurahan dengan penguncian geofence 5 km dan toleransi kehadiran 15 menit.</p>
        </div>
      </section>

      <div className="stat-grid">
        <StatCard label="Hadir Tepat Waktu" value={s?.tepatWaktu ?? '–'} unit="Pamong" />
        <StatCard label="Tugas Luar Kedinasan" value={s?.tugasLuar ?? '–'} unit="Pamong" />
        <StatCard label="Izin / Sakit / Cuti" value={s?.izinSakitCuti ?? '–'} unit="Pamong" />
        <StatCard label="Terlambat ( > 07.45)" value={s?.terlambat ?? '–'} unit="Pamong" />
      </div>
      {summary.error && <ErrorState error={summary.error} onRetry={summary.reload} />}

      <section className="card section">
        <h2 className="section__title">Catatan Presensi Harian Pamong Hari Ini</h2>
        <p className="muted section__sub">Data master pegawai, penetapan jabatan, target kegiatan, dan capaian bulanan</p>
        <PresensiFilter value={filters} onChange={setFilters} />

        {list.loading && <LoadingState />}
        {list.error && <ErrorState error={list.error} onRetry={list.reload} />}
        {d && !list.loading && (
          <>
            <PresensiTable items={d.items} showLocation={can(user.role, 'locationColumn')} canDetail={can(user.role, 'detail')} onDetail={setDetailId} />
            <div className="table-foot">
              <p className="muted">Menampilkan {d.items.length} dari {d.total} Aparatur Kalurahan Hargomulyo</p>
              {pages > 1 && (
                <nav className="pager" aria-label="Paginasi">
                  <button type="button" className="btn btn--outline btn--xs" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Sebelumnya</button>
                  <span className="pager__page">Hal {page} dari {pages}</span>
                  <button type="button" className="btn btn--outline btn--xs" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Selanjutnya</button>
                </nav>
              )}
            </div>
          </>
        )}
      </section>
      {detailId && <PresensiDetailModal id={detailId} onClose={() => setDetailId(null)} />}
    </>
  );
}
