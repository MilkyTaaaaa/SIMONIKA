import { useState } from 'react';
import { CircleAlert, Loader2, Send, UploadCloud } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import CameraCapture from './CameraCapture.jsx';
import { presensiService } from '../../services/presensiService.js';
import { errorMessage } from '../../services/apiClient.js';
import { MAX_UPLOAD_MB } from '../../config/presensi.js';

const OK_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

export default function TugasLuarModal({ user, onClose, onSuccess }) {
  const [f, setF] = useState({ instansi: '', nomorSpt: '', keterangan: '' });
  const [metode, setMetode] = useState('dokumen_spt');
  const [file, setFile] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (e) => setF((s) => ({ ...s, [e.target.name]: e.target.value }));

  const pick = (e) => {
    const x = e.target.files?.[0];
    if (!x) return;
    if (!OK_TYPES.includes(x.type)) return setError('Format berkas harus PDF, JPG, atau PNG.');
    if (x.size > MAX_UPLOAD_MB * 1024 * 1024) return setError(`Ukuran berkas maksimal ${MAX_UPLOAD_MB} MB.`);
    setError(''); setFile(x);
  };

  const submit = async () => {
    if (!f.instansi.trim()) return setError('Nama instansi / padukuhan lokasi tugas wajib diisi.');
    if (!f.keterangan.trim()) return setError('Keterangan agenda tugas luar wajib diisi.');
    if (metode === 'dokumen_spt' && !file) return setError('Unggah dokumen SPT terlebih dahulu.');
    if (metode === 'live_selfie' && !photo) return setError('Ambil dan gunakan foto selfie terlebih dahulu.');
    setBusy(true); setError('');
    try {
      onSuccess(await presensiService.createTugasLuar({
        instansi: f.instansi.trim(), nomorSpt: f.nomorSpt.trim(), keterangan: f.keterangan.trim(),
        metodeVerifikasi: metode, dokumen: metode === 'dokumen_spt' ? file : undefined, foto: metode === 'live_selfie' ? photo : undefined,
      }));
    } catch (e) { setError(errorMessage(e)); setBusy(false); }
  };

  return (
    <Modal title="Presensi Tugas Luar" user={user} onClose={onClose} busy={busy}
      footer={<>
        <button type="button" className="btn btn--danger" onClick={onClose} disabled={busy}>Batal</button>
        <button type="button" className="btn btn--primary" onClick={submit} disabled={busy}>
          {busy ? <Loader2 size={16} className="spin" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />} Kirim Tugas Luar
        </button>
      </>}>
      <div className="info info--blue">
        <p className="info__title"><CircleAlert size={16} aria-hidden="true" /> Ketentuan Tugas Luar</p>
        <p className="muted">Sesuai regulasi Kalurahan Hargomulyo, tugas kedinasan luar kantor lokasi penugasan dimana pun diakui sah 100% dan tetap memperoleh poin kehadiran penuh tanpa memotong TUKIN.</p>
      </div>
      <div className="field"><label htmlFor="tl-instansi">Nama Instansi / Padukuhan Lokasi Tugas</label>
        <input id="tl-instansi" name="instansi" placeholder="nama instansi" value={f.instansi} onChange={set} /></div>
      <div className="field"><label htmlFor="tl-spt">Nomor Surat Tugas (SPT) <span className="muted">- Opsional</span></label>
        <input id="tl-spt" name="nomorSpt" placeholder="nomor spt" value={f.nomorSpt} onChange={set} /></div>
      <div className="field"><label htmlFor="tl-ket">Keterangan Agenda Tugas Luar &amp; Target Capaian</label>
        <textarea id="tl-ket" name="keterangan" rows={4} value={f.keterangan} onChange={set} /></div>

      <fieldset className="field">
        <legend>Metode Verifikasi</legend>
        <div className="two-col">
          <button type="button" className={`choice ${metode === 'live_selfie' ? 'is-on' : ''}`} aria-pressed={metode === 'live_selfie'} onClick={() => setMetode('live_selfie')}><b>Live Selfie</b><small>Selfie langsung di lokasi</small></button>
          <button type="button" className={`choice ${metode === 'dokumen_spt' ? 'is-on' : ''}`} aria-pressed={metode === 'dokumen_spt'} onClick={() => setMetode('dokumen_spt')}><b>Dokumen SPT</b><small>Surat Tugas (PDF/JPG/PNG)</small></button>
        </div>
      </fieldset>

      {metode === 'live_selfie' ? (
        <CameraCapture compact onConfirm={setPhoto} label={`${user.name} (${user.jabatan})`} />
      ) : (
        <label className="upload" htmlFor="tl-file">
          <UploadCloud size={56} strokeWidth={1.6} aria-hidden="true" />
          <b>{file ? file.name : 'Klik untuk unggah Dokumen (.PDF)'}</b>
          <span className="muted">Maksimal {MAX_UPLOAD_MB} MB</span>
          <input id="tl-file" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={pick} className="sr-only" />
        </label>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
    </Modal>
  );
}
