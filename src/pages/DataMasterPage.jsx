import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import AparaturTable from '../components/datamaster/AparaturTable.jsx';
import AparaturFormModal from '../components/datamaster/AparaturFormModal.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import { ErrorState, LoadingState } from '../components/ui/States.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { useNotify } from '../context/NotificationContext.jsx';
import { dataMasterService } from '../services/dataMasterService.js';
import { errorMessage } from '../services/apiClient.js';

const PER_PAGE = 8;

// Halaman khusus Admin (dibatasi RoleRoute + sidebar; backend wajib memvalidasi role).
export default function DataMasterPage() {
  const { notify } = useNotify();
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(null); // null | { item: null | aparatur }
  const [del, setDel] = useState(null);
  const [delBusy, setDelBusy] = useState(false);
  const [delError, setDelError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => { setQ(search); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const list = useAsync(() => dataMasterService.list({ search: q, page, perPage: PER_PAGE }), [q, page]);
  const d = list.data;
  const pages = d ? Math.max(1, Math.ceil(d.total / d.perPage)) : 1;

  const onSaved = (res, editing) => {
    setForm(null);
    notify({ type: 'success', title: editing ? 'Data Aparatur Diperbarui' : 'Data Aparatur Ditambahkan', message: res?.message || 'Perubahan telah dikonfirmasi oleh server.' });
    list.reload();
  };

  const confirmDelete = async () => {
    setDelBusy(true); setDelError('');
    try {
      const res = await dataMasterService.remove(del.id);
      notify({ type: 'success', title: 'Data Aparatur Dihapus', message: res?.message || 'Penghapusan telah dikonfirmasi oleh server.' });
      if (d.items.length === 1 && page > 1) setPage((p) => p - 1); else list.reload();
      setDel(null);
    } catch (e) { setDelError(errorMessage(e)); }
    finally { setDelBusy(false); }
  };

  return (
    <>
      <section className="card header-card header-card--simple">
        <div>
          <h1>Data Master</h1>
          <p className="muted">Pengelolaan master jabatan, konfigurasi target beban minimal kegiatan per jabatan, dan akun aparatur kalurahan.</p>
        </div>
      </section>

      <section className="card section">
        <h2 className="section__title">Daftar Nama Jabatan &amp; Aparatur Pemerintah Kalurahan</h2>
        <p className="muted section__sub">Data master pegawai, penetapan jabatan, target kegiatan, dan capaian bulanan</p>
        <div className="filters">
          <div className="field field--search">
            <label htmlFor="dm-search" className="sr-only">Cari nama atau jabatan</label>
            <Search size={15} aria-hidden="true" />
            <input id="dm-search" placeholder="Cari nama atau jabatan..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button type="button" className="btn btn--primary btn--sm" onClick={() => setForm({ item: null })}><Plus size={16} aria-hidden="true" /> Tambah Pamong</button>
        </div>

        {list.loading && <LoadingState />}
        {list.error && <ErrorState error={list.error} onRetry={list.reload} />}
        {d && !list.loading && (
          <>
            <AparaturTable items={d.items} onEdit={(item) => setForm({ item })} onDelete={(item) => { setDelError(''); setDel(item); }} />
            <div className="table-foot">
              <p className="muted">Menampilkan {d.items.length} dari {d.total} Aparatur SOTK Kalurahan Hargomulyo</p>
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

      {form && <AparaturFormModal item={form.item} onClose={() => setForm(null)} onSuccess={onSaved} />}
      {del && (
        <ConfirmDialog title="Hapus Data Aparatur" busy={delBusy} error={delError}
          message={`Hapus data "${del.nama}" (${del.jabatanLabel || del.jabatan})? Tindakan ini mengikuti kebijakan backend dan tidak dapat dibatalkan dari layar ini.`}
          onConfirm={confirmDelete} onCancel={() => setDel(null)} />
      )}
    </>
  );
}
