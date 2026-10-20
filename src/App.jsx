import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/login";
import DashboardPamong from "./pages/pamong/DashboardPamong";
import PresensiPamong from "./pages/pamong/PresensiPamong";
import KegiatanPamong from "./pages/pamong/KegiatanPamong";
import KinerjaPamong from "./pages/pamong/KinerjaPamong";
import DashboardLurah from "./pages/lurah/DashboardLurah";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import "./index.css";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
{/* pamoing */}
                {/* Pamong */}
                <Route
                    path="/dashboardpamong"
                    element={<DashboardPamong />}
                />
                <Route
                    path="/presensipamong"
                    element={<PresensiPamong />}
                />
                <Route
                    path="/kegiatanpamong"
                    element={<KegiatanPamong />}
                />
                <Route
                    path="/kinerjapamong"
                    element={<KinerjaPamong />}
                />

                {/* Lurah */}
                <Route
                    path="/dashboardlurah"
                    element={<DashboardLurah />}
                />
{/* lurah */}
                <Route
                    path="/dashboardlurah"
                    element={<DashboardLurah />}
                />
{/* admin */}
                 <Route
                    path="/dashboardadmin"
                    element={<DashboardAdmin />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;