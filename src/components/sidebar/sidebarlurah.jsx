import { useState } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import logo from "../../assets/login/LOGO UTAMA.png";

function SidebarLurah() {
    const [isOpen, setIsOpen] = useState(false);

    const closeSidebar = () => {
        setIsOpen(false);
    };

    return (
        <>
            <button
                className="hamburger"
                onClick={() => setIsOpen(true)}
                aria-label="Buka menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
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
                        to="/dashboardlurah"
                        className="sidebar-menu"
                        onClick={closeSidebar}
                    >
                        <span className="menu-icon">⊞</span>
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        to="/presensilurah"
                        className="sidebar-menu"
                        onClick={closeSidebar}
                    >
                        <span className="menu-icon">♙</span>
                        <span>Presensi</span>
                    </Link>

                    <Link
                        to="/kinerjapamonglurah"
                        className="sidebar-menu"
                        onClick={closeSidebar}
                    >
                        <span className="menu-icon">▣</span>
                        <span>Kinerja Pamong</span>
                    </Link>

                    <Link
                        to="/feedback"
                        className="sidebar-menu"
                        onClick={closeSidebar}
                    >
                        <span className="menu-icon">↗</span>
                        <span>Feedback</span>
                    </Link>
                    <Link
                        to="/kinerjalurah"
                        className="sidebar-menu"
                        onClick={closeSidebar}
                    >
                        <span className="menu-icon">↗</span>
                        <span>Kinerja Lurah</span>
                    </Link>
                </nav>

                {/* Profil */}
                <div className="sidebar-profile">
                    <div className="profile-icon">
                        ♙
                    </div>

                    <div>
                        <p className="profile-name">
                            Nama Pamong
                        </p>
                        <p className="profile-role">
                            Jabatan Pamong
                        </p>
                    </div>
                </div>


                {/* Kontak */}
                <div className="sidebar-contact">
                    <div className="contact-title">
                        <span>♧ KONTAK & LOKASI</span>
                        <span>●</span>
                    </div>

                    <p className="contact-location">
                        ♧ &nbsp; Balai Kalurahan Hargomulyo
                    </p>

                    <p className="contact-address">
                        Jl. Kokap - Hargorejo KM 2, Kokap,
                        <br />
                        Kulon Progo, DIY 55653
                    </p>

                    <hr />

                    <p>⌕ &nbsp; 0812-3456-7890</p>

                    <p>✉ &nbsp; hargomulyo@kulonprogokab.go.id</p>
                </div>
            </aside>
        </>
    );
}

export default SidebarLurah;