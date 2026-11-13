import { BarChart3 } from 'lucide-react';
import StatCard from '../ui/StatCard.jsx';
import { LoadingState, ErrorState } from '../ui/States.jsx';

export default function PresensiSummary({ data, loading, error, onRetry, compact = false }) {
  return (
    <section className="card section">
      <h2 className="section__title"><BarChart3 size={18} aria-hidden="true" /> Rekap Kehadiran Bulanan</h2>
      {loading && <LoadingState />}
      {error && <ErrorState error={error} onRetry={onRetry} />}
      {data && (
        <>
          <p className="muted section__sub">Periode: <b>{data.periodeLabel}</b> (Total Hari Kerja: {data.totalHariKerja} Hari)</p>
          <div className="summary-grid">
            {compact ? (
              <>
                <StatCard label="TOTAL HADIR" value={data.totalHadir} unit="Hari" />
                <StatCard label="TEPAT WAKTU" value={data.tepatWaktu} unit="Hari" />
                <StatCard label="TERLAMBAT" value={data.terlambat} unit="Hari" />
                <StatCard label="IZIN / TUGAS LUAR" value={(data.izin ?? 0) + (data.tugasLuar ?? 0)} unit="Hari" />
              </>
            ) : (
              <>
                <StatCard tone="plain" label="TOTAL HADIR" value={data.totalHadir} unit="Hari" note={`Dari ${data.totalHariKerja} target hari kerja efektif`} />
                <StatCard tone="green" label="TEPAT WAKTU" value={data.tepatWaktu} unit="Hari" note="Presensi sebelum toleransi waktu" />
                <StatCard tone="amber" label="TERLAMBAT" value={data.terlambat} unit="Hari" note={data.catatanTerlambat} />
                <StatCard tone="blue" label="IZIN / TUGAS LUAR" value={data.tugasLuar} unit="Tugas Luar" side={`${data.izin} Izin`} />
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
}
