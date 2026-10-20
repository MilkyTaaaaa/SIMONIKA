import DashboardLayout from "../../components/DashboardLayout";
import CardWelcome from "../../components/card/CardWelcome";
import "./dashboardpamong.css";

function PresensiPamong() {
    return (
        <DashboardLayout>
            <div className="presensi-pamong">
                <CardWelcome 
                title="Presensi Mandiri Aparatur Kalurahan"
                description="Kelola kehadiran dan catat aktivitas kedinasan Anda hari ini.Kelola kehadiran dan catat aktivitas kedinasan Anda hari ini."
                time="12:00"
                timezone="WIB"
                date="Jumat, 9 Oktober 2026"
                
                />
            </div>
        </DashboardLayout>
    );
}

export default PresensiPamong;