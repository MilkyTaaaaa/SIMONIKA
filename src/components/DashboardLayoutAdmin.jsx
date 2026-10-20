import SidebarAdmin from "./sidebar/sidebaradmin";
import "./DashboardLayout.css";

function DashboardLayoutAdmin({ children }) {
    return (
        <div className="dashboard-layout">
            <SidebarAdmin />
            <main className="dashboard-content">
                {children}
            </main>
        </div>
    );
}

export default DashboardLayoutAdmin;

