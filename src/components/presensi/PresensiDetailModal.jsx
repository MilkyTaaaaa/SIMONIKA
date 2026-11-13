import Modal from '../ui/Modal.jsx';
import StatusBadge from '../ui/StatusBadge.jsx';
import { LoadingState, ErrorState } from '../ui/States.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { presensiService } from '../../services/presensiService.js';

export default function PresensiDetailModal({ id, onClose }) {
  const { data, loading, error, reload } = useAsync(() => presensiService.getPresensiDetail(id), [id]);
  const rows = data && [
    ['Nama', data.nama], ['Jabatan', data.jabatan], ['Jenis Presensi', data.jenisPresensi],
    ['Jam Masuk', data.jamMasuk], ['Jam Pulang', data.jamPulang || '-'], ['Metode', data.metode],
    ['Lokasi', data.lokasi || '-'], ['Keterangan', data.keterangan || '-'],
  ];
  return (
    <Modal title="Detail Presensi" onClose={onClose}
      footer={<button type="button" className="btn btn--outline" onClick={onClose}>Tutup</button>}>
      {loading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={reload} />}
      {data && (
        <dl className="detail">
          {rows.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
          <div><dt>Status</dt><dd><StatusBadge status={data.status} label={data.statusLabel} /></dd></div>
        </dl>
      )}
    </Modal>
  );
}
