import { useState, useRef } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { 
    Plus, 
    ArrowLeft, 
    UploadCloud, 
    FileText, 
    CheckCircle2, 
    Lock, 
    Pencil, 
    Trash2, 
    Send, 
    X,
    Camera
} from 'lucide-react';
import './kegiatanpamong.css';

const INITIAL_ACTIVITIES = [
    {
        id: 1,
        tanggal: '24 Okt 2024',
        nama: 'Pemeriksaan Kelengkapan SPJ BKK Kalurahan Hargomulyo Tahap II',
        lokasi: 'Balai Kalurahan Hargomulyo',
        kategori: 'Penatausahaan Keuangan',
        deskripsi: 'Verifikasi register kuitansi dan faktur belanja fisik barang padukuhan.',
        bukti: 'draft_spj_tahap2.pdf (1.2 MB)',
        status: 'terkirim', // 'terkirim' | 'draft'
        disetujui: false,
        isMalam: false,
    },
    {
        id: 2,
        tanggal: '23 Okt 2024',
        nama: 'Penyusunan Berita Acara Rapat Pembahasan RKP Kalurahan TA 2027',
        lokasi: 'Ruang Rapat Kalurahan',
        kategori: 'Fasilitasi BPKal',
        deskripsi: 'Dokumen notula dan kesepakatan pagu indikatif bersama BPKal Hargomulyo.',
        bukti: 'BA_Muskal_2025.pdf • Disetujui Lurah',
        status: 'terkirim',
        disetujui: true,
        isMalam: false,
    },
    {
        id: 3,
        tanggal: '22 Okt 2024',
        nama: 'Musyawarah Padukuhan & Ronda Kamtibmas di Padukuhan Pripih',
        lokasi: 'Padukuhan Pripih',
        kategori: 'Keamanan Lingkungan',
        deskripsi: 'Sosialisasi kebersihan lingkungan dan pencegahan DBD bersama Dukuh & Karang Taruna.',
        bukti: 'Foto dokumentasi warga tervalidasi geotag',
        status: 'terkirim',
        disetujui: false,
        isMalam: true,
    },
    {
        id: 4,
        tanggal: '21 Okt 2024',
        nama: 'Verifikasi Fisik Lapangan Proyek Saluran Irigasi Sambeng',
        lokasi: 'Padukuhan Sambeng',
        kategori: 'Pembangunan Fisik',
        deskripsi: 'Pengukuran dimensi talud dan kesesuaian spesifikasi RAB bersama Tim Pelaksana.',
        bukti: 'Dokumentasi_Irigasi_Sambeng.pdf',
        status: 'terkirim',
        disetujui: true,
        isMalam: false,
    },
    {
        id: 5,
        tanggal: '18 Okt 2024',
        nama: 'Koordinasi Pelayanan Administrasi Pertanahan Kalurahan',
        lokasi: 'Kapanewon Kokap',
        kategori: 'Pelayanan Publik',
        deskripsi: 'Konsultasi berkas sertifikasi tanah kas kalurahan dengan instansi terkait.',
        bukti: 'Notula_Koordinasi_Tanah.pdf',
        status: 'terkirim',
        disetujui: true,
        isMalam: false,
    },
    {
        id: 6,
        tanggal: '17 Okt 2024',
        nama: 'Pendampingan Penyaluran Bantuan Sosial Kalurahan',
        lokasi: 'Balai Kalurahan',
        kategori: 'Sosial Kemasyarakatan',
        deskripsi: 'Distribusi dan verifikasi data KPM bansos tahap berjalan.',
        bukti: 'Berita_Acara_Penyaluran.pdf',
        status: 'terkirim',
        disetujui: true,
        isMalam: false,
    }
];

function KegiatanPamong() {
    const [viewMode, setViewMode] = useState('rekap'); // 'rekap' | 'form'
    const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Form fields state
    const [tipeEntri, setTipeEntri] = useState('Rencana Harian');
    const [tanggal, setTanggal] = useState('2024-10-24');
    const [deskripsi, setDeskripsi] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [editingId, setEditingId] = useState(null);

    // Toast notification state
    const [toast, setToast] = useState(null); // { title, message }

    const fileInputRef = useRef(null);

    const showToast = (title, message) => {
        setToast({ title, message });
        setTimeout(() => {
            setToast(null);
        }, 4000);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file.name);
        }
    };

    const handleSaveDraft = () => {
        const descText = deskripsi.trim() || 'Pemeriksaan Kelengkapan SPJ BKK Kalurahan Hargomulyo Tahap II';
        const newAct = {
            id: editingId || Date.now(),
            tanggal: '24 Okt 2024',
            nama: descText.length > 50 ? descText.slice(0, 50) + '...' : descText,
            lokasi: 'Balai Kalurahan Hargomulyo',
            kategori: 'Penatausahaan Keuangan',
            deskripsi: descText,
            bukti: uploadedFile || 'draft_spj_tahap2.pdf (1.2 MB)',
            status: 'draft',
            disetujui: false,
            isMalam: false,
        };

        if (editingId) {
            setActivities(prev => prev.map(a => a.id === editingId ? newAct : a));
            setEditingId(null);
        } else {
            setActivities(prev => [newAct, ...prev]);
        }

        setDeskripsi('');
        setUploadedFile(null);
        showToast('Draft Berhasil Disimpan', 'Laporan Kegiatan berhasil disimpan dalam draft');
    };

    const handleSaveSubmit = () => {
        const descText = deskripsi.trim() || 'Pemeriksaan Kelengkapan SPJ BKK Kalurahan Hargomulyo Tahap II';
        const newAct = {
            id: editingId || Date.now(),
            tanggal: '24 Okt 2024',
            nama: descText.length > 50 ? descText.slice(0, 50) + '...' : descText,
            lokasi: 'Balai Kalurahan Hargomulyo',
            kategori: 'Penatausahaan Keuangan',
            deskripsi: descText,
            bukti: uploadedFile || 'draft_spj_tahap2.pdf (1.2 MB)',
            status: 'terkirim',
            disetujui: false,
            isMalam: false,
        };

        if (editingId) {
            setActivities(prev => prev.map(a => a.id === editingId ? newAct : a));
            setEditingId(null);
        } else {
            setActivities(prev => [newAct, ...prev]);
        }

        setDeskripsi('');
        setUploadedFile(null);
        showToast('Laporan Berhasil Terkirim', 'Laporan Kegiatan berhasil terkirim dan tercatat');
    };

    const handleEditDraft = (item) => {
        setEditingId(item.id);
        setDeskripsi(item.deskripsi || item.nama);
        setUploadedFile(item.bukti);
    };

    const handleDeleteDraft = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
            setActivities(prev => prev.filter(a => a.id !== id));
            showToast('Laporan Dihapus', 'Draft laporan kegiatan berhasil dihapus');
        }
    };

    const handleSendDraft = (id) => {
        setActivities(prev => prev.map(a => a.id === id ? { ...a, status: 'terkirim' } : a));
        showToast('Laporan Berhasil Terkirim', 'Laporan Kegiatan berhasil terkirim dan tercatat');
    };

    const totalTercatat = activities.length + 16; // 22 in screenshot
    const realisasiSelesai = activities.filter(a => a.status === 'terkirim').length + 12; // 18 in screenshot
    const targetBulanan = 30;
    const progressPercent = Math.min(100, Math.round((realisasiSelesai / targetBulanan) * 100));

    // Pagination for table
    const itemsPerPage = 6;
    const displayedActivities = activities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <DashboardLayout>
            <div className="kegiatan-container">
                {/* Custom Toast Notification matching PNGs */}
                {toast && (
                    <div className="custom-png-toast" role="status" aria-live="polite">
                        <div className="custom-toast-icon">
                            <CheckCircle2 size={18} color="#ffffff" />
                        </div>
                        <div className="custom-toast-content">
                            <p className="custom-toast-title">{toast.title}</p>
                            <p className="custom-toast-desc">{toast.message}</p>
                        </div>
                        <button 
                            type="button" 
                            className="custom-toast-close"
                            onClick={() => setToast(null)}
                            aria-label="Tutup notifikasi"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* View Mode 1: Rekapitulasi View (Image 1) */}
                {viewMode === 'rekap' ? (
                    <>
                        {/* Header */}
                        <div className="kegiatan-header-card">
                            <div>
                                <h1 className="kegiatan-title">Rencana & Laporan Kegiatan</h1>
                                <p className="kegiatan-subtitle">Input dan kelola rencana kerja bulanan serta laporan realisasi harian.</p>
                            </div>
                            <button 
                                className="btn-primary-teal" 
                                onClick={() => setViewMode('form')}
                            >
                                <Plus size={18} />
                                <span>+ Tambah Kegiatan</span>
                            </button>
                        </div>

                        {/* 4 Stats Cards */}
                        <div className="kegiatan-stats-grid">
                            <div className="kegiatan-stat-card">
                                <p className="kegiatan-stat-label">TOTAL KEGIATAN TERCATAT</p>
                                <h2 className="kegiatan-stat-value">{totalTercatat} Kegiatan</h2>
                            </div>
                            <div className="kegiatan-stat-card">
                                <p className="kegiatan-stat-label">REALISASI SELESAI & SAH</p>
                                <h2 className="kegiatan-stat-value">{realisasiSelesai} Kegiatan</h2>
                            </div>
                            <div className="kegiatan-stat-card">
                                <p className="kegiatan-stat-label">SEDANG BERJALAN</p>
                                <h2 className="kegiatan-stat-value">2 Kegiatan</h2>
                            </div>
                            <div className="kegiatan-stat-card">
                                <p className="kegiatan-stat-label">SISA TARGET BULANAN</p>
                                <h2 className="kegiatan-stat-value">{targetBulanan - realisasiSelesai} Kegiatan</h2>
                                <span className="kegiatan-stat-sub">Batas akhir: 31 Oktober 2024</span>
                            </div>
                        </div>

                        {/* Progress Card */}
                        <div className="kegiatan-progress-card">
                            <div className="kegiatan-progress-top">
                                <h3 className="kegiatan-progress-title">Progres Pemenuhan Beban Kerja SOTK Kasi Kemakmuran</h3>
                                <div className="kegiatan-progress-counts">
                                    <span>{realisasiSelesai} / {targetBulanan} Kegiatan</span>
                                    <span className="kegiatan-badge-teal">{progressPercent}%</span>
                                </div>
                            </div>
                            <div className="kegiatan-progress-bar-bg">
                                <div 
                                    className="kegiatan-progress-bar-fill" 
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <div className="kegiatan-note-box">
                                <strong>Ketentuan SIMONIKA:</strong> Setiap laporan kegiatan dengan bukti terunggah otomatis sah terhitung ke beban kerja tanpa menunggu tombol persetujuan Lurah. Kegiatan kedinasan akhir pekan atau malam hari diakui sah secara sistem sesuai regulasi Kalurahan Hargomulyo.
                            </div>
                        </div>

                        {/* Table Card */}
                        <div className="kegiatan-table-card">
                            <div className="kegiatan-table-head">
                                <h3 className="kegiatan-table-title">Rekapitulasi Kegiatan Pamong</h3>
                                <p className="kegiatan-table-sub">Daftar rekam jejak pelaksanaan tugas kedinasan bulan berjalan</p>
                            </div>

                            <div className="table-responsive">
                                <table className="rekap-table">
                                    <thead>
                                        <tr>
                                            <th>TANGGAL</th>
                                            <th>NAMA KEGIATAN</th>
                                            <th>LOKASI KEDINASAN</th>
                                            <th>BUKTI DOKUMEN</th>
                                            <th>STATUS REALISASI</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedActivities.map((act) => (
                                            <tr key={act.id}>
                                                <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{act.tanggal}</td>
                                                <td>{act.nama}</td>
                                                <td>{act.lokasi}</td>
                                                <td>
                                                    <span style={{ color: '#008eaa', cursor: 'pointer', fontWeight: 500 }}>
                                                        BuktiDokumen
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="badge-status-selesai">Selesai</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Pagination */}
                            <div className="table-pagination-row">
                                <span>Menampilkan 1 - {displayedActivities.length} dari {totalTercatat} kegiatan (Oktober 2024)</span>
                                <div className="pagination-controls">
                                    <button 
                                        className="page-btn"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    >
                                        Sebelumnya
                                    </button>
                                    <button 
                                        className={`page-btn ${currentPage === 1 ? 'active' : ''}`}
                                        onClick={() => setCurrentPage(1)}
                                    >
                                        1
                                    </button>
                                    <button 
                                        className={`page-btn ${currentPage === 2 ? 'active' : ''}`}
                                        onClick={() => setCurrentPage(2)}
                                    >
                                        2
                                    </button>
                                    <button 
                                        className={`page-btn ${currentPage === 3 ? 'active' : ''}`}
                                        onClick={() => setCurrentPage(3)}
                                    >
                                        3
                                    </button>
                                    <button 
                                        className="page-btn"
                                        disabled={currentPage === 3}
                                        onClick={() => setCurrentPage(p => Math.min(3, p + 1))}
                                    >
                                        Selanjutnya
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* View Mode 2: Form View (Images 2, 4, 5, 7) */
                    <>
                        {/* Header */}
                        <div className="kegiatan-header-card">
                            <div>
                                <span className="kegiatan-tag">KEGIATAN</span>
                                <h1 className="kegiatan-title">Form Rencana & Laporan Kegiatan</h1>
                                <p className="kegiatan-subtitle">Input dan kelola rencana kerja bulanan serta laporan realisasi harian.</p>
                            </div>
                            <button 
                                className="btn-primary-teal" 
                                onClick={() => setViewMode('rekap')}
                            >
                                <ArrowLeft size={16} />
                                <span>← Kembali ke Rekap Kegiatan</span>
                            </button>
                        </div>

                        {/* Two Columns Grid */}
                        <div className="form-two-column-layout">
                            {/* Left Column: Form Entry */}
                            <div className="form-panel-card">
                                <div className="panel-header-row">
                                    <h3 className="panel-header-title">Entri Kegiatan Pamong</h3>
                                    <span className="badge-point-green">+1 Poin Langsung</span>
                                </div>

                                <div className="input-two-cols">
                                    <div className="form-field-group">
                                        <label className="form-field-label">Tipe Entri</label>
                                        <select 
                                            className="form-select-custom"
                                            value={tipeEntri}
                                            onChange={(e) => setTipeEntri(e.target.value)}
                                        >
                                            <option value="Pilih Tipe Rencana">Pilih Tipe Rencana</option>
                                            <option value="Rencana Harian">Rencana Harian</option>
                                            <option value="Rencana Bulanan">Rencana Bulanan</option>
                                            <option value="Kegiatan Tambahan">Kegiatan Tambahan</option>
                                        </select>
                                    </div>
                                    <div className="form-field-group">
                                        <label className="form-field-label">Tanggal Kegiatan</label>
                                        <input 
                                            type="text" 
                                            className="form-input-custom"
                                            value={tanggal}
                                            onChange={(e) => setTanggal(e.target.value)}
                                            placeholder="24/10/2024"
                                        />
                                    </div>
                                </div>

                                <div className="form-field-group">
                                    <label className="form-field-label">Deskripsi Laporan</label>
                                    <textarea 
                                        className="form-textarea-custom"
                                        rows={4}
                                        placeholder="Verifikasi berkas SPJ BKK Sarpras Padukuhan Sambeng dan pen..."
                                        value={deskripsi}
                                        onChange={(e) => setDeskripsi(e.target.value)}
                                    />
                                </div>

                                <div className="form-field-group">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <label className="form-field-label">Bukti Fisik (Foto / PDF maks 5 MB)</label>
                                        <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>Tanpa Format Video</span>
                                    </div>
                                    
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        style={{ display: 'none' }}
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={handleFileUpload}
                                    />

                                    <div 
                                        className="upload-dropzone"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {uploadedFile ? (
                                            <>
                                                <FileText size={32} color="#008eaa" />
                                                <p className="upload-dropzone-main" style={{ color: '#008eaa' }}>
                                                    File : {uploadedFile} Terunggah!
                                                </p>
                                                <p className="upload-dropzone-sub">
                                                    Maksimal 5 MB (Atau gunakan laporan teks langsung di atas)
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <UploadCloud size={32} className="upload-dropzone-icon" />
                                                <p className="upload-dropzone-main">
                                                    Klik untuk unggah Foto (.JPG/.PNG) atau Dokumen (.PDF)
                                                </p>
                                                <p className="upload-dropzone-sub">
                                                    Maksimal 5 MB (Atau gunakan laporan teks langsung di atas)
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="form-buttons-row">
                                    <button 
                                        type="button" 
                                        className="btn-outline-teal"
                                        onClick={handleSaveDraft}
                                    >
                                        Simpan Draft
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn-primary-teal"
                                        onClick={handleSaveSubmit}
                                    >
                                        <CheckCircle2 size={16} />
                                        <span>Simpan (+1 Poin)</span>
                                    </button>
                                </div>
                            </div>

                            {/* Right Column: Daftar Laporan Bulan Ini */}
                            <div className="form-panel-card">
                                <div className="panel-header-row">
                                    <h3 className="panel-header-title">Daftar Laporan Kegiatan Bulan Ini</h3>
                                    <span className="badge-count-blue">{activities.length} Kegiatan Tercatat</span>
                                </div>
                                <p className="form-subtext">
                                    Laporan berstatus Draft masih dapat diedit/dihapus, status Sudah Terkirim terkunci.
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {activities.map((item) => (
                                        <div key={item.id} className="activity-card-item">
                                            <div className="activity-card-header">
                                                {item.status === 'draft' ? (
                                                    <span className="badge-pill-amber">Draft</span>
                                                ) : (
                                                    <span className="badge-pill-success">Sudah Terkirim</span>
                                                )}
                                                {item.isMalam && (
                                                    <span className="badge-pill-orange">Kegiatan Malam</span>
                                                )}
                                                <span>{item.tanggal} • {item.kategori}</span>
                                            </div>

                                            <h4 className="activity-card-title">{item.nama}</h4>
                                            <p className="activity-card-body">{item.deskripsi}</p>

                                            <div className="activity-card-file">
                                                {item.isMalam ? (
                                                    <Camera size={14} color="#008eaa" />
                                                ) : (
                                                    <CheckCircle2 size={14} color="#15803d" />
                                                )}
                                                <span>Bukti terlampir: {item.bukti}</span>
                                            </div>

                                            <div className="activity-card-footer">
                                                {item.status === 'draft' ? (
                                                    <>
                                                        <span>Status belum diverifikasi Lurah</span>
                                                        <div className="draft-actions-group">
                                                            <button 
                                                                type="button" 
                                                                className="btn-draft-edit"
                                                                onClick={() => handleEditDraft(item)}
                                                            >
                                                                <Pencil size={13} />
                                                                <span>Edit</span>
                                                            </button>
                                                            <button 
                                                                type="button" 
                                                                className="btn-draft-delete"
                                                                onClick={() => handleDeleteDraft(item.id)}
                                                            >
                                                                <Trash2 size={13} />
                                                                <span>Hapus</span>
                                                            </button>
                                                            <button 
                                                                type="button" 
                                                                className="btn-draft-submit"
                                                                onClick={() => handleSendDraft(item.id)}
                                                            >
                                                                <Send size={13} />
                                                                <span>Kirim</span>
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Laporan telah dikirim dan terkunci</span>
                                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                            <Lock size={13} /> Terkunci (Sistem)
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}

export default KegiatanPamong;
