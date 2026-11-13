import { AlertTriangle, BriefcaseBusiness, CircleCheck, FileText } from 'lucide-react';

const MAP = {
  hadir: { tone: 'green', icon: CircleCheck, text: 'Hadir' },
  tepat_waktu: { tone: 'green', icon: CircleCheck, text: 'Tepat Waktu' },
  tugas_luar: { tone: 'green', icon: BriefcaseBusiness, text: 'Tugas Luar' },
  terlambat: { tone: 'amber', icon: AlertTriangle, text: 'Terlambat' },
  izin: { tone: 'green', icon: FileText, text: 'Izin' },
  sakit: { tone: 'green', icon: FileText, text: 'Sakit' },
  cuti: { tone: 'green', icon: FileText, text: 'Cuti' },
  tidak_hadir: { tone: 'red', icon: AlertTriangle, text: 'Tidak Hadir' },
  lokasi_tidak_sesuai: { tone: 'red', icon: AlertTriangle, text: 'Lokasi Tidak Sesuai' },
};

// Status selalu memiliki label teks + ikon, tidak hanya warna.
export default function StatusBadge({ status, label, tone }) {
  const m = MAP[status] || { tone: 'grey', icon: null, text: status || '-' };
  const Icon = m.icon;
  return (
    <span className={`badge badge--${tone || m.tone}`}>
      {Icon && <Icon size={12} aria-hidden="true" />}
      {(label || m.text).toUpperCase()}
    </span>
  );
}
