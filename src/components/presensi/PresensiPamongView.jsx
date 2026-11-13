import { useState } from 'react';
import PresensiHeader from './PresensiHeader.jsx';
import PresensiActions from './PresensiActions.jsx';
import PresensiSummary from './PresensiSummary.jsx';
import PresensiHistory from './PresensiHistory.jsx';
import CaptureModal from './CaptureModal.jsx';
import IzinModal from './IzinModal.jsx';
import TugasLuarModal from './TugasLuarModal.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { useNotify } from '../../context/NotificationContext.jsx';
import PeerStatus from './PeerStatus.jsx';
import { presensiService } from '../../services/presensiService.js';
import { can } from '../../utils/rolePermissions.js';

const TITLES = { datang: 'Presensi Datang', pulang: 'Presensi Pulang', tugas: 'Presensi Tugas Luar', izin: 'Pengajuan Izin' };

export default function PresensiPamongView({ user }) {
  const [modal, setModal] = useState(null);
  const { notify } = useNotify();
  const today = useAsync(() => presensiService.getMyToday(), []);
  const summary = useAsync(() => presensiService.getMySummary(), []);
  const history = useAsync(() => presensiService.getMyHistory({ page: 1, perPage: 20 }), []);
  const showPeers = can(user.role, 'peerStatus'); // Lurah: status rekan, bukan rekap
  const isLurah = user.role === 'lurah';
  const peers = useAsync(() => (showPeers ? presensiService.getPeerStatus() : Promise.resolve(null)), [showPeers]);

  const t = today.data;
  const done = { datang: Boolean(t?.datang), pulang: Boolean(t?.pulang), tugas: Boolean(t?.tugasLuar), izin: Boolean(t?.izin) };

  // Notifikasi hanya muncul setelah backend membalas sukses.
  const onSuccess = (kind) => (res) => {
    setModal(null);
    notify({
      type: 'success',
      title: `${TITLES[kind]} Diterima`,
      message: res?.message || 'Pengajuan telah dikonfirmasi oleh server.',
    });
    today.reload(); summary.reload(); history.reload();
  };
  const close = () => setModal(null);

  return (
    <>
      <PresensiHeader badge={t?.statusLabel} />
      <PresensiActions done={done} onOpen={setModal} title={isLurah ? 'Presensi Saya' : undefined} />
      <PresensiSummary {...summary} onRetry={summary.reload} compact={isLurah} />
      <PresensiHistory {...history} onRetry={history.reload} title={isLurah ? 'Riwayat Presensi Saya' : undefined} />
      {showPeers && <PeerStatus {...peers} onRetry={peers.reload} />}

      {(modal === 'datang' || modal === 'pulang') && <CaptureModal mode={modal} user={user} onClose={close} onSuccess={onSuccess(modal)} />}
      {modal === 'tugas' && <TugasLuarModal user={user} onClose={close} onSuccess={onSuccess('tugas')} />}
      {modal === 'izin' && <IzinModal user={user} onClose={close} onSuccess={onSuccess('izin')} />}
    </>
  );
}
