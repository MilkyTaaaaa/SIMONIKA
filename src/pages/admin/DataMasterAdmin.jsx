import DashboardLayoutAdmin from "../../components/DashboardLayoutAdmin";
import DataMasterPage from "../DataMasterPage";
import "../../styles/presensi.css";

export default function DataMasterAdmin() {
    return (
        <DashboardLayoutAdmin>
            <div className="content" style={{ maxWidth: "100%", padding: 0 }}>
                <DataMasterPage />
            </div>
        </DashboardLayoutAdmin>
    );
}
