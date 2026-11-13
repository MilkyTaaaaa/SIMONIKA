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
            'latitude_kantor' => -7.800000,
            'longitude_kantor' => 110.200000,
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
            'toleransi_terlambat_menit' => 'sometimes|integer|min:0|max:180',
            'radius_meter' => 'sometimes|integer|min:10|max:50000',
            'latitude_kantor' => 'sometimes|numeric|between:-90,90',
            'longitude_kantor' => 'sometimes|numeric|between:-180,180',
            'batas_izin_sakit_per_bulan' => 'sometimes|integer|min:0|max:31',
            'deadline_laporan_malam' => 'sometimes|date_format:H:i',
            'max_ukuran_file_mb' => 'sometimes|integer|min:1|max:20',
        ]);

        $pengaturan = PengaturanSistem::firstOrFail();

        $masukSeninKamis = substr($validated['jam_masuk_senin_kamis'] ?? $pengaturan->jam_masuk_senin_kamis, 0, 5);
        $pulangSeninKamis = substr($validated['jam_pulang_senin_kamis'] ?? $pengaturan->jam_pulang_senin_kamis, 0, 5);
        if ($pulangSeninKamis <= $masukSeninKamis) {
            return response()->json([
                'message' => 'Jam pulang Senin-Kamis harus lebih besar dari jam masuk Senin-Kamis',
            ], 422);
        }

        $masukJumat = substr($validated['jam_masuk_jumat'] ?? $pengaturan->jam_masuk_jumat, 0, 5);
        $pulangJumat = substr($validated['jam_pulang_jumat'] ?? $pengaturan->jam_pulang_jumat, 0, 5);
        if ($pulangJumat <= $masukJumat) {
            return response()->json([
                'message' => 'Jam pulang Jumat harus lebih besar dari jam masuk Jumat',
            ], 422);
        }

        $pengaturan->update($validated);

        return response()->json([
            'message' => 'Pengaturan berhasil diperbarui',
            'data' => $pengaturan,
        ]);
    }
}