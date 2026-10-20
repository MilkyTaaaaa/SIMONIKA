import SidebarLurah from "./sidebar/sidebarlurah";
import "./DashboardLayout.css";

function DashboardLayoutLurah({ children }) {
    return (
        <div className="dashboard-layout">
            <SidebarLurah />
            <main className="dashboard-content">
                {children}
            </main>
        </div>
    );
}

export default DashboardLayoutLurah;

