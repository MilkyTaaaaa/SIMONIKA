import { useState } from 'react';
import { CircleAlert, Loader2, Send } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import { presensiService } from '../../services/presensiService.js';
import { errorMessage } from '../../services/apiClient.js';
import { useAsync } from '../../hooks/useAsync.js';
import { todayIso } from '../../utils/format.js';

const JENIS = [{ v: 'sakit', l: 'Sakit' }, { v: 'izin', l: 'Izin' }, { v: 'cuti', l: 'Cuti' }];

export default function IzinModal({ user, onClose, onSuccess }) {
  const quota = useAsync(() => presensiService.getIzinQuota(), []);
  const [jenis, setJenis] = useState('izin');
  const [mulai, setMulai] = useState(todayIso());
  const [selesai, setSelesai] = useState(todayIso());
  const [alasan, setAlasan] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!alasan.trim()) return setError('Alasan dan keterangan wajib diisi.');
    if (!mulai || !selesai) return setError('Tanggal mulai dan selesai wajib diisi.');
    if (selesai < mulai) return setError('Tanggal selesai tidak boleh sebelum tanggal mulai.');
    setBusy(true); setError('');
    try {
      onSuccess(await presensiService.createIzin({ jenis, tanggalMulai: mulai, tanggalSelesai: selesai, alasan: alasan.trim() }));
    } catch (e) { setError(errorMessage(e)); setBusy(false); }
  };

  const q = quota.data;
  return (
    <Modal title="Pengajuan Izin/ Sakit/ Cuti" user={user} onClose={onClose} busy={busy}
      footer={<>
        <button type="button" className="btn btn--danger" onClick={onClose} disabled={busy}>Batal</button>
        <button type="button" className="btn btn--primary" onClick={submit} disabled={busy}>
          {busy ? <Loader2 size={16} className="spin" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />} Kirim Pengajuan Izin
        </button>
      </>}>
      <div className="info info--blue">
        <p className="info__title"><CircleAlert size={16} aria-hidden="true" /> Regulasi Toleransi Kehadiran Hargomulyo
          <span className="chip chip--outline">Maksimal {q?.maksimalPerBulan ?? 5} Hari/ Bulan</span></p>
        <p className="muted">Sesuai regulasi Kalurahan Hargomulyo, izin dan sakit memperoleh batas toleransi <b>maksimal {q?.maksimalPerBulan ?? 5} hari per bulan</b> tanpa memotong kehadiran TUKIN pamong</p>
        <p className="small"><b>Sisa Kuota Izin : {q ? `${q.sisa} Hari` : '—'}</b></p>
      </div>

      <fieldset className="field">
        <legend>Jenis Pengajuan Izin<span className="req">*</span></legend>
        <div className="seg">
          {JENIS.map((j) => (
            <button key={j.v} type="button" className={`seg__btn ${jenis === j.v ? 'is-on' : ''}`} aria-pressed={jenis === j.v} onClick={() => setJenis(j.v)}>{j.l}</button>
          ))}
        </div>
      </fieldset>

      <div className="two-col">
        <div className="field"><label htmlFor="izin-mulai">Tanggal Mulai Izin<span className="req">*</span></label>
          <input id="izin-mulai" type="date" value={mulai} onChange={(e) => setMulai(e.target.value)} /></div>
        <div className="field"><label htmlFor="izin-selesai">Tanggal Selesai Izin<span className="req">*</span></label>
          <input id="izin-selesai" type="date" min={mulai} value={selesai} onChange={(e) => setSelesai(e.target.value)} /></div>
      </div>

      <div className="field"><label htmlFor="izin-alasan">Alasan dan Keterangan Lengkap Pengajuan Izin<span className="req">*</span></label>
        <textarea id="izin-alasan" rows={5} value={alasan} onChange={(e) => setAlasan(e.target.value)} /></div>
      {error && <p className="form-error" role="alert">{error}</p>}
    </Modal>
  );
}
