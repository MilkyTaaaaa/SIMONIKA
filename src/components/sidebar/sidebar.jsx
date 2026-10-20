import { useState } from "react";
import { Link } from "react-router-dom";
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


function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const closeSidebar = () => {
        setIsOpen(false);
    };

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
                        className="sidebar-menu"
                        onClick={closeSidebar}
                    >
                        <span className="menu-icon">
                            <img src={dashboardicon} alt="Dashboard" />
                        </span>
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        to="/presensipamong"
                        className="sidebar-menu"
                        onClick={closeSidebar}
                    >
                        <span className="menu-icon">
                            <img src={presensiicon} alt="Presensi" />
                        </span>
                        <span>Presensi</span>
                    </Link>

                    <Link
                        to="/kegiatanpamong"
                        className="sidebar-menu"
                        onClick={closeSidebar}
                    >
                        <span className="menu-icon">
                            <img src={kegiatanicon} alt="Kegiatan" />
                        </span>
                        <span>Kegiatan</span>
                    </Link>

                    <Link
                        to="/kinerjapamong"
                        className="sidebar-menu"
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