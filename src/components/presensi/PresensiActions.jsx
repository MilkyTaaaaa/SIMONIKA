import { BarChart3, Check } from 'lucide-react';

const ACTIONS = [
  { key: 'datang', title: 'Presensi Datang', desc: 'Catat waktu kedatangan dan lokasi Anda saat mulai bekerja di kantor.', cta: 'Ajukan Presensi Datang' },
  { key: 'pulang', title: 'Presensi Pulang', desc: 'Catat waktu kepulangan dan lokasi Anda saat sudah selesai bekerja.', cta: 'Ajukan Presensi Pulang' },
  { key: 'tugas', title: 'Tugas Luar', desc: 'Catat waktu kedatangan dan lokasi Anda saat mulai bekerja di luar kantor.', cta: 'Ajukan Tugas Luar' },
  { key: 'izin', title: 'Izin/ Sakit/ Cuti', desc: 'Ajukan izin tidak masuk kerja dengan memilih jenis izin dan alasan pendukung.', cta: 'Ajukan Izin' },
];

// done[key] hanya true jika backend sudah mengonfirmasi (dari getMyToday).
export default function PresensiActions({ done = {}, onOpen, title = 'Aksi Pilihan Presensi' }) {
  return (
    <section className="card section">
      <h2 className="section__title"><BarChart3 size={18} aria-hidden="true" /> {title}</h2>
      <p className="muted section__sub">Pilih presensi sesuai dengan kegiatan yang sedang dilakukan saat ini.</p>
      <div className="action-grid">
        {ACTIONS.map((a) => (
          <article key={a.key} className="action">
            <h3>{a.title}</h3>
            <p>{a.desc}</p>
            {done[a.key] ? (
              <button type="button" className="btn btn--primary btn--block" disabled>
                <Check size={16} aria-hidden="true" /> Pengajuan Berhasil
              </button>
            ) : (
              <button type="button" className="btn btn--outline btn--block" onClick={() => onOpen(a.key)}>{a.cta}</button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
