import { useEffect, useRef, useState } from 'react';
import { Camera, Check, RefreshCw, User } from 'lucide-react';

export default function CameraCapture({ label, onConfirm, compact = false }) {
  const [phase, setPhase] = useState('idle'); // idle | live | captured
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const blobRef = useRef(null);

  const stop = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };
  useEffect(() => () => { stop(); }, []);
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const open = async () => {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Kamera tidak didukung pada browser/perangkat ini (butuh HTTPS atau localhost).');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      setPhase('live');
      requestAnimationFrame(() => { if (videoRef.current) videoRef.current.srcObject = stream; });
    } catch (e) {
      setError(e.name === 'NotAllowedError' ? 'Izin kamera ditolak. Aktifkan izin kamera pada browser lalu coba lagi.' : 'Kamera tidak dapat dibuka. Pastikan kamera tersedia dan tidak dipakai aplikasi lain.');
    }
  };

  const snap = () => {
    const v = videoRef.current;
    if (!v?.videoWidth) return;
    const c = document.createElement('canvas');
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    c.toBlob((b) => {
      if (!b) { setError('Gagal mengambil foto. Coba lagi.'); return; }
      blobRef.current = b;
      setPreview(URL.createObjectURL(b));
      stop();
      setPhase('captured');
    }, 'image/jpeg', 0.85);
  };

  const retry = () => {
    blobRef.current = null; setPreview(null); setConfirmed(false); onConfirm(null); setPhase('idle'); open();
  };
  const use = () => { setConfirmed(true); onConfirm(blobRef.current); };

  return (
    <div className={`camera ${compact ? 'camera--compact' : ''}`}>
      {phase === 'idle' && (
        <>
          <Camera size={compact ? 44 : 72} strokeWidth={1.6} aria-hidden="true" />
          <p className="camera__title">Nyalakan Kamera Anda Untuk Presensi</p>
          <button type="button" className="btn btn--outline" onClick={open}>Buka Kamera</button>
        </>
      )}
      {phase === 'live' && (
        <>
          <video ref={videoRef} autoPlay playsInline muted className="camera__video" aria-label="Pratinjau kamera" />
          <button type="button" className="btn btn--primary" onClick={snap}><Camera size={16} aria-hidden="true" /> Ambil Foto</button>
        </>
      )}
      {phase === 'captured' && (
        <>
          {preview ? <img src={preview} alt="Hasil foto presensi" className="camera__video" /> : <User size={72} aria-hidden="true" />}
          {label && <p className="camera__title">{label}</p>}
          <div className="camera__actions">
            <button type="button" className="btn btn--outline" onClick={retry}><RefreshCw size={16} aria-hidden="true" /> Coba Lagi</button>
            <button type="button" className={`btn ${confirmed ? 'btn--success-solid' : 'btn--success'}`} onClick={use} disabled={confirmed}>
              <Check size={16} aria-hidden="true" /> {confirmed ? 'Foto Digunakan' : 'Gunakan Foto Ini'}
            </button>
          </div>
        </>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}
