import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/login";
import DashboardPamong from "./pages/pamong/DashboardPamong";
import DashboardBamuskal from "./pages/bamuskal/DashboardBamuskal";
import DashboardKapanewon from "./pages/kapanewon/DashboardKapanewon";
import DashboardLurah from "./pages/lurah/DashboardLurah";
import "./index.css";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route
                    path="/dashboardpamong"
                    element={<DashboardPamong />}
                />

                <Route
                    path="/dashboardbamuskal"
                    element={<DashboardBamuskal />}
                />

                <Route
                    path="/dashboardkapanewon"
                    element={<DashboardKapanewon />}
                />

                <Route
                    path="/dashboardlurah"
                    element={<DashboardLurah />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;