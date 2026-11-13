import DashboardLayoutAdmin from "../../components/DashboardLayoutAdmin";
import PresensiMonitoringView from "../../components/presensi/PresensiMonitoringView";
import { useAuth } from "../../context/AuthContext";
import "../../styles/presensi.css";

export default function PresensiAdmin() {
    const { user } = useAuth() || {};
    return (
        <DashboardLayoutAdmin>
            <div className="content" style={{ maxWidth: "100%", padding: 0 }}>
                <PresensiMonitoringView user={user || { role: "admin", name: "Admin Presensi" }} />
            </div>
        </DashboardLayoutAdmin>
    );
}
