<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PengaturanSistem;
use Illuminate\Http\Request;

class PengaturanSistemController extends Controller
{
    public function show()
    {
        $pengaturan = PengaturanSistem::first() ?? PengaturanSistem::create([
            'jam_masuk_senin_kamis' => '07:30',
            'jam_pulang_senin_kamis' => '15:45',
            'jam_masuk_jumat' => '07:30',
            'jam_pulang_jumat' => '15:30',
            'toleransi_terlambat_menit' => 15,
            'radius_meter' => 5000,
            'latitude_kantor' => -7.800000,  // TODO: ganti koordinat asli kantor
            'longitude_kantor' => 110.200000, // TODO: ganti koordinat asli kantor
            'batas_izin_sakit_per_bulan' => 5,
            'deadline_laporan_malam' => '07:30',
            'max_ukuran_file_mb' => 5,
        ]);

        return response()->json($pengaturan);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'jam_masuk_senin_kamis' => 'sometimes|date_format:H:i',
            'jam_pulang_senin_kamis' => 'sometimes|date_format:H:i',
            'jam_masuk_jumat' => 'sometimes|date_format:H:i',
            'jam_pulang_jumat' => 'sometimes|date_format:H:i',
            'toleransi_terlambat_menit' => 'sometimes|integer|min:0',
            'radius_meter' => 'sometimes|integer|min:1',
            'latitude_kantor' => 'sometimes|numeric',
            'longitude_kantor' => 'sometimes|numeric',
            'batas_izin_sakit_per_bulan' => 'sometimes|integer|min:0',
            'deadline_laporan_malam' => 'sometimes|date_format:H:i',
            'max_ukuran_file_mb' => 'sometimes|integer|min:1',
        ]);

        $pengaturan = PengaturanSistem::firstOrFail();
        $pengaturan->update($validated);

        return response()->json(['message' => 'Pengaturan berhasil diperbarui', 'data' => $pengaturan]);
    }
}