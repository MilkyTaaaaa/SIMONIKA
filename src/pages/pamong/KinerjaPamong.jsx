import DashboardLayout from "../../components/DashboardLayout";
import CardLong from "../../components/card/CardLong";

function KinerjaPamong() {
    return (
        <DashboardLayout>
            <div className="kinerja-pamong">
                <CardLong
                    title="Kinerja Pamong"
                    description="Lihat capaian kinerja pamong dalam periode tertentu."

                />
            </div>
        </DashboardLayout>
    );
}

export default KinerjaPamong;