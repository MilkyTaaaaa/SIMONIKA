<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Models\LaporanHarian;
use App\Models\LaporanIntervensi;
use App\Models\PengaturanSistem;
use App\Models\Presensi;
use App\Models\RencanaBulanan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardMonitoringController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'bulan' => 'sometimes|date_format:Y-m',
        ]);

        $bulan = $request->input('bulan', now()->format('Y-m'));
        $awal = Carbon::parse($bulan . '-01')->startOfMonth();
        $akhir = $awal->copy()->endOfMonth();

        // Hitung hari kerja efektif (Senin-Jumat)
        $hariKerja = 0;
        for ($d = $awal->copy(); $d->lte($akhir); $d->addDay()) {
            if ($d->isWeekday()) {
                $hariKerja++;
            }
        }

        $pengaturan = PengaturanSistem::first();
        $batasIzin = $pengaturan ? $pengaturan->batas_izin_sakit_per_bulan : 5;

        $pamongs = User::with('jabatan')
            ->where('role', 'pamong')
            ->orderBy('name')
            ->get();

        $pamongIds = $pamongs->pluck('id');

        $presensiBulan = Presensi::whereBetween('date', [$awal->toDateString(), $akhir->toDateString()])
            ->whereIn('user_id', $pamongIds)
            ->get()
            ->groupBy('user_id');

        $laporanCount = LaporanHarian::whereBetween('date', [$awal->toDateString(), $akhir->toDateString()])
            ->whereIn('user_id', $pamongIds)
            ->selectRaw('user_id, count(*) as total')
            ->groupBy('user_id')
            ->pluck('total', 'user_id');

        $rencanaBulan = RencanaBulanan::where('bulan', $bulan)
            ->whereIn('user_id', $pamongIds)
            ->pluck('rencana_kegiatan', 'user_id');

        $feedbackCountPerPamong = Feedback::where('bulan', $bulan)
            ->whereIn('pamong_id', $pamongIds)
            ->selectRaw('pamong_id, count(*) as total')
            ->groupBy('pamong_id')
            ->pluck('total', 'pamong_id');

        $rekapPamong = $pamongs->map(function ($u) use (
            $presensiBulan, $laporanCount, $rencanaBulan, $feedbackCountPerPamong, $hariKerja, $batasIzin
        ) {
            $records = $presensiBulan->get($u->id, collect());
            $hadir = $records->whereIn('type', ['datang', 'tugas_luar'])->count();
            $izin = $records->where('type', 'izin')->count();
            $terlambat = $records->where('is_terlambat', true)->count();

            $izinDiakui = min($izin, $batasIzin);
            $hariEfektif = min($hariKerja, $hadir + $izinDiakui);
            $persenPresensi = $hariKerja > 0 ? (int) round(($hariEfektif / $hariKerja) * 100) : 0;

            $targetKinerja = (int) ($u->jabatan?->beban_kerja_minimal_bulanan ?? 0);
            $realisasiKinerja = (int) ($laporanCount->get($u->id, 0));
            $persenKinerja = $targetKinerja > 0
                ? (int) min(100, round(($realisasiKinerja / $targetKinerja) * 100))
                : 0;

            // Estimasi skor sementara (30% presensi + 70% kinerja)
            $skorSementara = (int) round(($persenPresensi * 0.30) + ($persenKinerja * 0.70));

            return [
                'user_id' => $u->id,
                'nama' => $u->name,
                'jabatan' => $u->jabatan?->nama_lokal,
                'padukuhan' => $u->padukuhan,
                'sudah_isi_rencana' => $rencanaBulan->has($u->id),
                'jumlah_hadir' => $hadir,
                'izin' => $izin,
                'terlambat' => $terlambat,
                'persentase_kehadiran' => $persenPresensi,
                'target_kegiatan' => $targetKinerja,
                'realisasi_kegiatan' => $realisasiKinerja,
                'persentase_kinerja' => $persenKinerja,
                'skor_sementara' => $skorSementara,
                'jumlah_feedback_diterima' => (int) $feedbackCountPerPamong->get($u->id, 0),
                'perlu_pembinaan' => $skorSementara < 70,
            ];
        });

        $totalFeedbackLurah = Feedback::where('bulan', $bulan)->count();
        $sudahIntervensi = LaporanIntervensi::where('bulan', $bulan)->exists();

        return response()->json([
            'bulan' => $bulan,
            'ringkasan' => [
                'total_pamong' => $pamongs->count(),
                'hari_kerja_efektif' => $hariKerja,
                'rata_rata_kehadiran' => (int) round($rekapPamong->avg('persentase_kehadiran') ?? 0),
                'rata_rata_kinerja' => (int) round($rekapPamong->avg('persentase_kinerja') ?? 0),
                'pamong_perlu_pembinaan' => $rekapPamong->where('perlu_pembinaan', true)->count(),
                'total_feedback_lurah_bulan_ini' => $totalFeedbackLurah,
                'target_minimal_feedback_lurah' => 5,
                'sudah_buat_laporan_intervensi' => $sudahIntervensi,
            ],
            'data' => $rekapPamong,
        ]);
    }
}