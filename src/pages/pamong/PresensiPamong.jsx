import DashboardLayout from "../../components/DashboardLayout";
import PresensiPamongView from "../../components/presensi/PresensiPamongView";
import { useAuth } from "../../context/AuthContext";
import "../../styles/presensi.css";

function PresensiPamong() {
    const { user } = useAuth() || {};
    const currentUser = user || { name: "Pamong Hargomulyo", role: "pamong", jabatan: "Kasi Kemakmuran" };

    return (
        <DashboardLayout>
            <div className="presensi-integrated-container" style={{ width: "100%", maxWidth: "1480px", margin: "0 auto" }}>
                <PresensiPamongView user={currentUser} />
            </div>
        </DashboardLayout>
    );
}

export default PresensiPamong;