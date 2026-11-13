import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

import Login from "./pages/auth/login";
import DashboardPamong from "./pages/pamong/DashboardPamong";
import PresensiPamong from "./pages/pamong/PresensiPamong";
import KegiatanPamong from "./pages/pamong/KegiatanPamong";
import KinerjaPamong from "./pages/pamong/KinerjaPamong";

import DashboardLurah from "./pages/lurah/DashboardLurah";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import DataMasterAdmin from "./pages/admin/DataMasterAdmin";
import PresensiAdmin from "./pages/admin/PresensiAdmin";
import AccessDeniedPage from "./pages/AccessDeniedPage";

import "./index.css";
import "./styles/presensi.css";

function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Auth */}
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />

                        {/* Pamong */}
                        <Route path="/dashboardpamong" element={<DashboardPamong />} />
                        <Route path="/dashboard" element={<DashboardPamong />} />
                        <Route path="/presensipamong" element={<PresensiPamong />} />
                        <Route path="/presensi" element={<PresensiPamong />} />
                        <Route path="/kegiatanpamong" element={<KegiatanPamong />} />
                        <Route path="/kegiatan" element={<KegiatanPamong />} />
                        <Route path="/kinerjapamong" element={<KinerjaPamong />} />
                        <Route path="/kinerja" element={<KinerjaPamong />} />

                        {/* Admin */}
                        <Route path="/dashboardadmin" element={<DashboardAdmin />} />
                        <Route path="/datamasteradmin" element={<DataMasterAdmin />} />
                        <Route path="/data-master" element={<DataMasterAdmin />} />
                        <Route path="/presensiadmin" element={<PresensiAdmin />} />

                        {/* Lurah */}
                        <Route path="/dashboardlurah" element={<DashboardLurah />} />

                        {/* Utility */}
                        <Route path="/akses-ditolak" element={<AccessDeniedPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;
