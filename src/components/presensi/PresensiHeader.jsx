import { CircleCheck, Clock } from 'lucide-react';
import { useClock } from '../../hooks/useClock.js';
import { formatClock, formatDateLong } from '../../utils/format.js';
import { WORK_HOURS } from '../../config/presensi.js';

export default function PresensiHeader({ badge }) {
  const now = useClock();
  return (
    <section className="card header-card">
      <div>
        {badge && <p className="chip chip--green"><CircleCheck size={13} aria-hidden="true" /> {badge}</p>}
        <h1>Presensi Mandiri Aparatur Kalurahan</h1>
        <p className="muted">Kelola kehadiran dan catat aktivitas kedinasan Anda hari ini.</p>
        <p className="muted header-card__hours">
          Jam Kerja: Senin-Kamis {WORK_HOURS.start} - {WORK_HOURS.endMonThu.label} WIB | Jumat {WORK_HOURS.start} - {WORK_HOURS.endFri.label} WIB.
        </p>
      </div>
      <div className="clock" aria-label="Waktu presensi">
        <div className="clock__top"><span>WAKTU PRESENSI SIMONIKA</span><span className="clock__icon"><Clock size={18} aria-hidden="true" /></span></div>
        <p className="clock__time">{formatClock(now)} <small>WIB</small></p>
        <p className="muted">{formatDateLong(now)}</p>
      </div>
    </section>
  );
}
