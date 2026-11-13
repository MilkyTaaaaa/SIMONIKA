import { useEffect, useState } from 'react';
import { AlertTriangle, Clock, Loader2, Send } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import LocationStatus from './LocationStatus.jsx';
import CameraCapture from './CameraCapture.jsx';
import { useGeolocation } from '../../hooks/useGeolocation.js';
import { useClock } from '../../hooks/useClock.js';
import { evaluateGeofence } from '../../utils/geofencing.js';
import { formatClock, isBeforeWorkEnd, workEndFor } from '../../utils/format.js';
import { GEOFENCE, WORK_HOURS } from '../../config/presensi.js';
import { presensiService } from '../../services/presensiService.js';
import { errorMessage } from '../../services/apiClient.js';

// mode: 'datang' | 'pulang'. Lokasi hanya dikirim saat tombol kirim ditekan.
export default function CaptureModal({ mode, user, onClose, onSuccess }) {
  const isPulang = mode === 'pulang';
  const now = useClock();
  const geo = useGeolocation();
  const [photo, setPhoto] = useState(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { geo.refresh(); /* eslint-disable-next-line */ }, []);

  const fence = evaluateGeofence(geo.position, GEOFENCE);
  const early = isPulang && isBeforeWorkEnd(now);
  const end = workEndFor(now).label;
  const blockedByArea = fence.state === 'outside';
  const canSend = photo && geo.position && !blockedByArea && (!early || reason.trim()) && !busy;

  const submit = async () => {
    setBusy(true); setError('');
    try {
      const payload = { foto: photo, ...geo.position, alasanPulangAwal: early ? reason.trim() : undefined };
      const res = await (isPulang ? presensiService.createPresensiPulang(payload) : presensiService.createPresensiMasuk(payload));
      onSuccess(res);
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
    }
  };

  return (
    <Modal title={isPulang ? 'Presensi Pulang' : 'Presensi Datang'} user={user} onClose={onClose} busy={busy}
      footer={<>
        <button type="button" className="btn btn--danger" onClick={onClose} disabled={busy}>Batal</button>
        <button type="button" className="btn btn--primary" onClick={submit} disabled={!canSend}>
          {busy ? <Loader2 size={16} className="spin" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
          {busy ? 'Mengirim…' : isPulang ? 'Kirim Presensi Pulang' : 'Kirim Presensi Datang'}
        </button>
      </>}>
      <div className="info info--blue">
        <p className="info__title"><Clock size={16} aria-hidden="true" /> Jam Kerja Resmi Kalurahan : {WORK_HOURS.start.replace('.', ':')} - {end.replace('.', ':')} WIB
          {!isPulang && <span className="chip chip--outline">Toleransi s.d {WORK_HOURS.tolerance} WIB</span>}</p>
        <p className="muted">Waktu sekarang (perangkat): <b>{formatClock(now)} WIB</b></p>
        {early && (
          <div className="info info--amber">
            <p className="info__title t-red"><AlertTriangle size={15} aria-hidden="true" /> Perhatian : Kepulangan Sebelum Jam Kerja Berakhir</p>
            <p className="t-red small">Anda mengajukan presensi pulang sebelum waktu jam kerja berakhir. Sertakan dan jelaskan alasan kepulangan di bawah.</p>
            <label htmlFor="alasan-pulang" className="small"><b>Keterangan Alasan Pulang Lebih Awal :</b></label>
            <input id="alasan-pulang" value={reason} onChange={(e) => setReason(e.target.value)} required />
          </div>
        )}
      </div>

      <LocationStatus geo={geo} fence={fence} />
      <CameraCapture label={`${user.name} (${user.jabatan})`} onConfirm={setPhoto} />

      {blockedByArea && <p className="form-error" role="alert">Anda berada di luar area presensi, sehingga pengiriman tidak dapat dilakukan dari lokasi ini.</p>}
      {!geo.position && geo.status !== 'loading' && <p className="form-error" role="alert">Lokasi diperlukan untuk mengirim presensi.</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
    </Modal>
  );
}
