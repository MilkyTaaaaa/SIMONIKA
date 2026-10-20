import DashboardLayout from "../../components/DashboardLayout";
import CardLong from "../../components/card/CardLong";

function KegiatanPamong() {
    return (
        <DashboardLayout>
            <div className="kegiatan-pamong">
                <CardLong
                    title="Rencana & Laporan Kegiatan"
                    description="Input dan kelola rencana kerja bulanan serta laporan realisasi harian."
                    button="+ Tambah Kegiatan"
                />
            </div>
        </DashboardLayout>
    );
}

export default KegiatanPamong;