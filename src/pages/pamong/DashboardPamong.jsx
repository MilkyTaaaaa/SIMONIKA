import DashboardLayout from "../../components/DashboardLayout";
import CardLong from "../../components/card/CardLong";
import CardWelcome from "../../components/card/CardWelcome";
import bell from "../../assets/dashboard/bell.svg";
import "./dashboardpamong.css";
import CardLittle from "../../components/card/CardLittle";
import CardTwo from "../../components/card/CardTwo";

function DashboardPamong() {

    return (
        <div>
            <DashboardLayout>
                <div className="dashboard-pamong">
                    <CardWelcome
                        title="Selamat Datang, Nama"
                        description="Monitoring kehadiran aparatur, agenda tugas harian, dan capaian realisasi Kalurahan Hargomulyo Kapanewon Kokap."
                        time="12:00"
                        timezone="WIB"
                        date="Jumat, 9 Oktober 2026"
                    />
                    <CardLong 
                        title="Pengingat Absen Pulang"
                        image={bell}
                        description="Anda belum melakukan presensi pulang hari ini. Gerbang presensi biometrik kepulangan dibuka pukul 15:30 WIB di radius kantor."
                        button="Siapkan Presensi Pulang"
                    />
                    <div className="presensi-dashboard">
                    <CardLittle
                        title="Judul Card Little"
                        image={bell}
                        description="Deskripsi card little"
                        more="Informasi tambahan"
                        button="Tombol"
                    />
                    <CardLittle
                        title="Judul Card Little"
                        image={bell}
                        description="Deskripsi card little"
                        more="Informasi tambahan"
                        button="Tombol"
                    />
                    <CardLittle
                        title="Judul Card Little"
                        image={bell}
                        description="Deskripsi card little"
                        more="Informasi tambahan"
                        button="Tombol"
                    />
                    </div>
                    <div className="kegiatan-dashboard-pamong">
                        <CardTwo
                        title="Judul Card Two"
                        description="Deskripsi card two"
                        button="Tombol"
                    >
                        <p>Konten tambahan di dalam Card Two</p>
                    </CardTwo>
                    <CardTwo
                        title="Judul Card Two"
                        description="Deskripsi card two"
                        button="Tombol"
                    >
                        <p>Konten tambahan di dalam Card Two</p>
                    </CardTwo>
                    </div>
                    
                </div>         
            </DashboardLayout>
                
        </div>
    );
}

export default DashboardPamong;