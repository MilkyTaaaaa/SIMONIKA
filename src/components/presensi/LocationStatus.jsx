import { useState } from 'react';
import { MapPin, RefreshCw } from 'lucide-react';
import { GEOFENCE } from '../../config/presensi.js';

const GEO_MSG = {
  idle: ['neutral', 'Lokasi belum diperiksa.'],
  loading: ['neutral', 'Mengambil lokasi Anda…'],
  denied: ['red', 'Izin lokasi diperlukan. Aktifkan izin lokasi pada browser, lalu sinkronkan ulang.'],
  unavailable: ['red', 'Lokasi tidak tersedia pada perangkat ini. Aktifkan GPS lalu coba lagi.'],
  timeout: ['red', 'Pengambilan lokasi melebihi batas waktu. Coba sinkronkan ulang.'],
  error: ['red', 'Terjadi kesalahan saat mengambil lokasi. Coba lagi.'],
};

export function describeLocation(geo, fence) {
  if (geo.status !== 'success') return GEO_MSG[geo.status] || GEO_MSG.error;
  const acc = Math.round(geo.position.accuracy);
  switch (fence.state) {
    case 'inside': return ['green', `Di dalam area presensi (jarak ±${Math.round(fence.distance)} m, akurasi ±${acc} m).`];
    case 'outside': return ['red', `Di luar area presensi (jarak ±${Math.round(fence.distance)} m dari Balai Kalurahan).`];
    case 'poor_accuracy': return ['amber', `Akurasi lokasi kurang memadai (±${acc} m). Pindah ke tempat terbuka lalu sinkronkan ulang.`];
    default: return ['amber', `Lokasi diperoleh (akurasi ±${acc} m). Area presensi belum dikonfigurasi; pemeriksaan area dilakukan server.`];
  }
}

export default function LocationStatus({ geo, fence }) {
  const [help, setHelp] = useState(false);
  const [tone, text] = describeLocation(geo, fence);
  return (
    <div className={`loc loc--${tone}`}>
      <div className="loc__row">
        <MapPin size={18} aria-hidden="true" />
        <div className="loc__text">
          <b>{GEOFENCE.name}</b>
          <p role="status">{text}</p>
        </div>
        <button type="button" className="btn btn--outline btn--xs" onClick={geo.refresh} disabled={geo.status === 'loading'}>
          <RefreshCw size={12} className={geo.status === 'loading' ? 'spin' : ''} aria-hidden="true" /> Sinkronisasi GPS
        </button>
      </div>
      <button type="button" className="link-btn" onClick={() => setHelp((h) => !h)} aria-expanded={help}>Terdapat Kendala ?</button>
      {help && <p className="loc__help">Pastikan izin lokasi browser aktif, GPS menyala, dan Anda berada di area terbuka. Lokasi di browser tidak sepenuhnya akurat; validasi akhir dilakukan oleh server.</p>}
    </div>
  );
}
