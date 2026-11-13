import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";
import logo from "../../assets/login/LOGO UTAMA.png";
import dashboardicon from "../../assets/dashboard/dashboard.svg";
import kinerjaicon from "../../assets/dashboard/chart_data.svg";
import presensiicon from "../../assets/dashboard/person.svg";
import kegiatanicon from "../../assets/dashboard/event_note.svg";
import servericon from "../../assets/dashboard/Container.svg";
import mailicon from "../../assets/dashboard/mail.svg";
import callicon from "../../assets/dashboard/call.svg";
import marginicon from "../../assets/dashboard/margin.svg";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const auth = useAuth();
    const user = auth?.user;

    const closeSidebar = () => {
        setIsOpen(false);
    };

    const isActive = (path) => {
        const p = location.pathname.toLowerCase();
        if (path === '/dashboard') return p === '/dashboard' || p === '/dashboardpamong';
        if (path === '/presensi') return p.startsWith('/presensi');
        if (path === '/kegiatan') return p.startsWith('/kegiatan');
        if (path === '/kinerja') return p.startsWith('/kinerja');
        return p === path;
    };

    const displayName = user?.name || "Nama Pamong";
    const displayRole = user?.jabatan || "Jabatan Pamong";

    return (
        <>
            {/* Hamburger khusus mobile */}
            <button
                className="hamburger"
                onClick={() => setIsOpen(true)}
                aria-label="Buka menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Overlay mobile */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
                {/* Logo */}
                <div className="sidebar-header">
                    <img
                        src={logo}
                        alt="Logo Hargomulyo"
                    />

                    <div>
                        <h1>SIMONIKA</h1>
                        <p>Kalurahan Hargomulyo</p>
                    </div>
                </div>

                {/* Wilayah Kerja */}
                <div className="work-area">
                    <h3>WILAYAH KERJA</h3>

                    <p className="government">
                        Pemerintah Kalurahan
                        <br />
                        Hargomulyo
                    </p>

                    <p className="location">
                        Kapanewon Kokap, DIY
                    </p>
                </div>

                {/* Navigasi */}
                <nav className="sidebar-navigation">
                    <p className="navigation-title">
                        Navigasi Utama
                    </p>

                    <Link
                        to="/dashboardpamong"
                        className={`sidebar-menu ${isActive('/dashboard') ? 'active' : ''}`}
                        onClick={closeSidebar}
                    >
                        <span className="menu-icon">
                            <img src={dashboardicon} alt="Dashboard" />
                        </span>
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        to="/presensipamong"
                        className={`sidebar-menu ${isActive('/presensi') ? 'active' : ''}`}
                        onClick={closeSidebar}
                    >
                        <span className="menu-icon">
                            <img src={presensiicon} alt="Presensi" />
                        </span>
                        <span>Presensi</span>
                    </Link>

                    <Link
                        to="/kegiatanpamong"
                        className={`sidebar-menu ${isActive('/kegiatan') ? 'active' : ''}`}
                        onClick={closeSidebar}
                    >
                        <span className="menu-icon">
                            <img src={kegiatanicon} alt="Kegiatan" />
                        </span>
                        <span>Kegiatan</span>
                    </Link>

                    <Link
                        to="/kinerjapamong"
                        className={`sidebar-menu ${isActive('/kinerja') ? 'active' : ''}`}
                        onClick={closeSidebar}
                    >
                        <span className="menu-icon">
                            <img src={kinerjaicon} alt="Kinerja" />
                        </span>
                        <span>Kinerja</span>
                    </Link>
                </nav>

                {/* Profil */}
                <div className="sidebar-profile">
                    <div className="profile-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>

                    <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <p className="profile-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {displayName}
                        </p>
                        <p className="profile-role" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {displayRole}
                        </p>
                    </div>
                </div>

                {/* Kontak */}
                <div className="sidebar-contact">
                    <div className="contact-title">
                        <span><img src={servericon} alt="" /> KONTAK & LOKASI</span>
                        <span>●</span>
                    </div>

                    <p className="contact-location">
                        <img src={marginicon} alt="" /> &nbsp; Balai Kalurahan Hargomulyo
                    </p>

                    <p className="contact-address">
                        Jl. Kokap - Hargorejo KM 2, Kokap,
                        <br />
                        Kulon Progo, DIY 55653
                    </p>

                    <hr />

                    <p><img src={callicon} alt="" /> &nbsp; 0812-3456-7890</p>

                    <p><img src={mailicon} alt="" /> &nbsp; hargomulyo@kulonprogokab.go.id</p>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;