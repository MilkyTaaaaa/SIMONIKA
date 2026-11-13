import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { 
    Calendar, 
    CheckCircle2, 
    Lock, 
    Eye, 
    X 
} from 'lucide-react';
import './kinerjapamong.css';

const RIWAYAT_KINERJA = [
    { id: 1, periode: 'Bulan 2026', target: 30, realisasi: 18, capaian: '60%', tukin: '66,54%' },
    { id: 2, periode: 'Bulan 2026', target: 30, realisasi: 18, capaian: '60%', tukin: '66,54%' },
    { id: 3, periode: 'Bulan 2026', target: 30, realisasi: 18, capaian: '60%', tukin: '66,54%' },
    { id: 4, periode: 'Bulan 2026', target: 30, realisasi: 18, capaian: '60%', tukin: '66,54%' },
    { id: 5, periode: 'Bulan 2026', target: 30, realisasi: 18, capaian: '60%', tukin: '66,54%' },
];

const REALISASI_LIST = [
    { id: 1, tgl: '2 Oktober', nama: 'Nama Kegiatan', status: 'Selesai' },
    { id: 2, tgl: '5 Oktober', nama: 'Nama Kegiatan', status: 'Selesai' },
    { id: 3, tgl: '8 Oktober', nama: 'Nama Kegiatan', status: 'Selesai' },
    { id: 4, tgl: '10 Oktober', nama: 'Nama Kegiatan', status: 'Selesai' },
    { id: 5, tgl: '14 Oktober', nama: 'Nama Kegiatan', status: 'Selesai' },
    { id: 6, tgl: '18 Oktober', nama: 'Nama Kegiatan', status: 'Selesai' },
    { id: 7, tgl: '24 Oktober', nama: 'Nama Kegiatan', status: 'Selesai' },
];

function KinerjaPamong() {
    const [selectedModalItem, setSelectedModalItem] = useState(null);
    const [tahun, setTahun] = useState('2026');

    return (
        <DashboardLayout>
            <div className="kinerja-container">
                {/* Header */}
                <div className="kinerja-header-card">
                    <h1 className="kinerja-title">Rekapitulasi Kinerja & TUKIN Pamong</h1>
                    <p className="kinerja-subtitle">Rekapitulasi kinerja dan TUKIN Anda berdasarkan integrasi presensi dan capaian target SOTK.</p>
                </div>

                {/* 3 Summary Cards */}
                <div className="kinerja-top-grid">
                    <div className="kinerja-summary-card">
                        <p className="kinerja-summary-label">REKAP PRESENSI</p>
                        <h2 className="kinerja-summary-value">18 / 22 Hari Hadir</h2>
                        <div className="progress-bar-small-bg">
                            <div className="progress-bar-small-fill" style={{ width: '81.8%' }}></div>
                        </div>
                    </div>

                    <div className="kinerja-summary-card">
                        <p className="kinerja-summary-label">REKAP KEGIATAN</p>
                        <h2 className="kinerja-summary-value">18 / 30 Kegiatan</h2>
                        <div className="progress-bar-small-bg">
                            <div className="progress-bar-small-fill" style={{ width: '60%' }}></div>
                        </div>
                    </div>

                    <div className="kinerja-summary-card">
                        <p className="kinerja-summary-label">ESTIMASI SKOR TUKIN AKHIR</p>
                        <h2 className="kinerja-summary-value">86.56%</h2>
                        <div className="progress-bar-small-bg">
                            <div className="progress-bar-small-fill" style={{ width: '86.56%', backgroundColor: '#008eaa' }}></div>
                        </div>
                    </div>
                </div>

                {/* Middle 2 Cards */}
                <div className="kinerja-middle-grid">
                    {/* Card Left: REKAP PRESENSI */}
                    <div className="kinerja-panel-card">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <h3 className="panel-title-with-icon">
                                <Calendar size={18} color="#008eaa" />
                                <span>REKAP PRESENSI</span>
                            </h3>
                            <p className="panel-title-sub">
                                Ringkasan kepatuhan absensi mandiri dan dinas Pamong pada periode aktif.
                            </p>
                        </div>

                        <div className="presensi-three-boxes">
                            <div className="presensi-sub-box">
                                <p className="presensi-sub-label">Hadir</p>
                                <p className="presensi-sub-value teal-highlight">18 hari</p>
                            </div>
                            <div className="presensi-sub-box">
                                <p className="presensi-sub-label">Izin / Sakit</p>
                                <p className="presensi-sub-value">2 hari</p>
                            </div>
                            <div className="presensi-sub-box">
                                <p className="presensi-sub-label">Tugas Luar</p>
                                <p className="presensi-sub-value">2 hari</p>
                            </div>
                        </div>
                    </div>

                    {/* Card Right: REKAP KEGIATAN */}
                    <div className="kinerja-panel-card">
                        <h3 className="panel-title-with-icon">
                            <CheckCircle2 size={18} color="#008eaa" />
                            <span>REKAP KEGIATAN</span>
                        </h3>

                        <div className="kegiatan-three-stats">
                            <div className="kegiatan-sub-stat">
                                <p className="kegiatan-sub-stat-title">Target SOTK</p>
                                <p className="kegiatan-sub-stat-sub">(per kegiatan)</p>
                                <p className="kegiatan-sub-stat-num">30</p>
                            </div>
                            <div className="kegiatan-sub-stat">
                                <p className="kegiatan-sub-stat-title">Realisasi</p>
                                <p className="kegiatan-sub-stat-sub">(per kegiatan)</p>
                                <p className="kegiatan-sub-stat-num">18</p>
                            </div>
                            <div className="kegiatan-sub-stat">
                                <p className="kegiatan-sub-stat-title">Sisa Target</p>
                                <p className="kegiatan-sub-stat-sub">(per kegiatan)</p>
                                <p className="kegiatan-sub-stat-num">12</p>
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
                                <span>Pemenuhan Beban Tugas</span>
                                <span style={{ fontWeight: 700, color: '#0f172a' }}>60%</span>
                            </div>
                            <div className="progress-bar-small-bg">
                                <div className="progress-bar-small-fill" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tukin Pamong Card */}
                <div className="tukin-card">
                    <div className="tukin-header-row">
                        <div className="tukin-header-left">
                            <h3>Tukin Pamong</h3>
                            <p>Kalkulasi berdasarkan presensi dan kinerja</p>
                        </div>
                        <span className="badge-locked-system">
                            <Lock size={13} />
                            <span>Perhitungan Terkunci Sistem (Read-only)</span>
                        </span>
                    </div>

                    {/* Formula Banner */}
                    <div className="formula-banner">
                        <div className="sigma-circle">Σ</div>
                        <p className="formula-text">
                            Skor Akhir TUKIN = (Skor Presensi × 30%) + (Skor Kinerja × 70%)
                        </p>
                    </div>

                    {/* 3 Columns Calculation */}
                    <div className="tukin-three-columns">
                        {/* Col 1 */}
                        <div className="tukin-calc-box">
                            <div>
                                <p className="tukin-calc-title">KOMPONEN PRESENSI</p>
                                <h4 className="tukin-calc-value">81,8%</h4>
                                <p className="tukin-calc-desc">Tingkat kehadiran Pamong</p>
                            </div>
                            <div>
                                <div className="tukin-calc-meta-row">
                                    <span>Bobot:</span>
                                    <span style={{ fontWeight: 600 }}>30%</span>
                                </div>
                                <div className="tukin-calc-meta-row" style={{ borderTop: 'none', paddingTop: '4px' }}>
                                    <span>Kontribusi nilai:</span>
                                    <span style={{ fontWeight: 600 }}>24,54%</span>
                                </div>
                            </div>
                        </div>

                        {/* Col 2 */}
                        <div className="tukin-calc-box">
                            <div>
                                <p className="tukin-calc-title">KOMPONEN KINERJA</p>
                                <h4 className="tukin-calc-value">60%</h4>
                                <p className="tukin-calc-desc">Capaian realisasi kegiatan</p>
                            </div>
                            <div>
                                <div className="tukin-calc-meta-row">
                                    <span>Bobot:</span>
                                    <span style={{ fontWeight: 600 }}>70%</span>
                                </div>
                                <div className="tukin-calc-meta-row" style={{ borderTop: 'none', paddingTop: '4px' }}>
                                    <span>Kontribusi nilai:</span>
                                    <span style={{ fontWeight: 600 }}>42%</span>
                                </div>
                            </div>
                        </div>

                        {/* Col 3 */}
                        <div className="tukin-calc-box result-box">
                            <div>
                                <p className="tukin-calc-title">HASIL AKUMULASI</p>
                                <p className="tukin-calc-desc" style={{ marginTop: '4px' }}>Skor Akhir TUKIN:</p>
                                <h4 className="tukin-calc-value large-result">66,54%</h4>
                            </div>
                            <div>
                                <p className="tukin-calc-formula-note">Formula resmi: 24,54% + 42,00%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Riwayat Kinerja Table */}
                <div className="riwayat-table-card">
                    <div className="riwayat-header-row">
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px 0' }}>Riwayat Kinerja</h3>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Riwayat capaian kinerja dan TUKIN bulanan Anda.</p>
                        </div>
                        <select 
                            className="year-select-dropdown"
                            value={tahun}
                            onChange={(e) => setTahun(e.target.value)}
                        >
                            <option value="2026">Tahun 2026</option>
                            <option value="2025">Tahun 2025</option>
                            <option value="2024">Tahun 2024</option>
                        </select>
                    </div>

                    <div className="table-responsive">
                        <table className="rekap-table">
                            <thead>
                                <tr>
                                    <th>PERIODE</th>
                                    <th>TARGET</th>
                                    <th>REALISASI</th>
                                    <th>CAPAIAN</th>
                                    <th>SKOR TUKIN</th>
                                    <th>AKSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {RIWAYAT_KINERJA.map((row) => (
                                    <tr key={row.id}>
                                        <td style={{ fontWeight: 500 }}>{row.periode}</td>
                                        <td>{row.target}</td>
                                        <td>{row.realisasi}</td>
                                        <td>{row.capaian}</td>
                                        <td style={{ fontWeight: 600 }}>{row.tukin}</td>
                                        <td>
                                            <button 
                                                type="button"
                                                className="btn-view-pill"
                                                onClick={() => setSelectedModalItem(row)}
                                            >
                                                <Eye size={14} />
                                                <span>Lihat</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal Detail Kinerja Bulan (Image 6) */}
                {selectedModalItem && (
                    <div className="modal-detail-overlay" onClick={() => setSelectedModalItem(null)}>
                        <div className="modal-detail-dialog" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-detail-header">
                                <div>
                                    <h3 className="modal-detail-title">Detail Kinerja Bulan Oktober 2026</h3>
                                    <p className="modal-detail-subtitle">Rincian pemenuhan capaian dan kalkulasi TUKIN</p>
                                </div>
                                <button 
                                    type="button" 
                                    className="modal-detail-close-btn"
                                    onClick={() => setSelectedModalItem(null)}
                                    aria-label="Tutup"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="modal-detail-body">
                                {/* Section 1: Rangkuman Performa */}
                                <div>
                                    <h4 className="modal-section-title">Rangkuman Performa</h4>
                                    <div className="modal-performa-card">
                                        <div className="performa-item">
                                            <p className="performa-label">Target</p>
                                            <p className="performa-value">30 Kegiatan</p>
                                        </div>
                                        <div className="performa-item">
                                            <p className="performa-label">Realisasi</p>
                                            <p className="performa-value">18 Kegiatan</p>
                                        </div>
                                        <div className="performa-item">
                                            <p className="performa-label">Capaian</p>
                                            <p className="performa-value">
                                                <span>60%</span>
                                                <span className="badge-sangat-baik">Sangat Baik</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: DETAIL TUKIN */}
                                <div>
                                    <h4 className="modal-section-title">DETAIL TUKIN</h4>
                                    <div className="modal-tukin-box">
                                        <div className="modal-tukin-row">
                                            <span>Presensi : <strong>81,8%</strong> (Bobot 30%)</span>
                                            <span>Kontribusi : <strong>24,54%</strong></span>
                                        </div>
                                        <div className="modal-tukin-row">
                                            <span>Kinerja : <strong>60%</strong> (Bobot 70%)</span>
                                            <span>Kontribusi : <strong>42%</strong></span>
                                        </div>
                                        <hr className="modal-tukin-divider" />
                                        <div className="modal-tukin-total-row">
                                            <span>Skor Akhir TUKIN</span>
                                            <span style={{ fontSize: '18px', color: '#008eaa' }}>66,54%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: REALISASI KEGIATAN */}
                                <div>
                                    <h4 className="modal-section-title">REALISASI KEGIATAN</h4>
                                    <div className="modal-realisasi-list">
                                        {REALISASI_LIST.map((act) => (
                                            <div key={act.id} className="modal-realisasi-row">
                                                <div style={{ display: 'flex', gap: '20px' }}>
                                                    <span style={{ fontWeight: 600, minWidth: '85px' }}>{act.tgl}</span>
                                                    <span>{act.nama}</span>
                                                </div>
                                                <span className="badge-status-selesai" style={{ padding: '2px 12px', fontSize: '11px' }}>
                                                    {act.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default KinerjaPamong;
