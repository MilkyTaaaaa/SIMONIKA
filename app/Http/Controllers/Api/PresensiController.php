<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PengaturanSistem;
use App\Models\Presensi;
use App\Services\GeoService;
use Illuminate\Http\Request;

class PresensiController extends Controller
{
    public function datang(Request $request)
    {
        $pengaturan = PengaturanSistem::first();
        if (!$pengaturan) {
            return response()->json(['message' => 'Pengaturan sistem belum tersedia'], 500);
        }

        // jenis file yang boleh tergantung jenis bukti
        $buktiInput = $request->input('type') === 'tugas_luar' ? $request->input('bukti_type') : 'selfie';
        $mimes = $buktiInput === 'surat_tugas' ? 'jpg,jpeg,png,pdf' : 'jpg,jpeg,png';
        $maxKb = $pengaturan->max_ukuran_file_mb * 1024;

        $validated = $request->validate([
            'type' => 'required|in:datang,tugas_luar',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'bukti_type' => 'required_if:type,tugas_luar|in:selfie,surat_tugas',
            'bukti' => "required|file|mimes:{$mimes}|max:{$maxKb}",
            'keterangan' => 'nullable|string|max:255',
        ]);

        $user = $request->user(); // user dari token, BUKAN dari input client
        $now = now();

        $sudahAda = Presensi::where('user_id', $user->id)
            ->whereDate('date', $now->toDateString())
            ->whereIn('type', ['datang', 'tugas_luar', 'izin'])
            ->exists();

        if ($sudahAda) {
            return response()->json(['message' => 'Anda sudah melakukan presensi datang/tugas luar/izin hari ini'], 409);
        }

        $jarak = GeoService::jarakMeter(
            (float) $validated['latitude'], (float) $validated['longitude'],
            (float) $pengaturan->latitude_kantor, (float) $pengaturan->longitude_kantor
        );
        $isInRadius = $jarak <= $pengaturan->radius_meter;

        if ($validated['type'] === 'datang' && !$isInRadius) {
            return response()->json([
                'message' => 'Lokasi diluar radius kantor yang diizinkan',
                'jarak_meter' => (int) round($jarak),
                'radius_meter' => $pengaturan->radius_meter,
            ], 422);
        }

        $isTerlambat = false;
        if ($validated['type'] === 'datang') {
            $jamMasuk = $now->isFriday()
                ? $pengaturan->jam_masuk_jumat
                : ($now->isWeekday() ? $pengaturan->jam_masuk_senin_kamis : null);

            if ($jamMasuk) {
                $batas = $now->copy()->setTimeFromTimeString($jamMasuk)
                    ->addMinutes($pengaturan->toleransi_terlambat_menit);
                $isTerlambat = $now->gt($batas);
            }
        }

        // simpan file hanya setelah semua validasi lolos; disk default = private
        $path = $request->file('bukti')->store("presensi/{$user->id}");

        $presensi = Presensi::create([
            'user_id' => $user->id,
            'date' => $now->toDateString(),
            'time' => $now->format('H:i:s'),
            'type' => $validated['type'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'jarak_meter' => (int) round($jarak),
            'is_in_radius' => $isInRadius,
            'is_terlambat' => $isTerlambat,
            'bukti_type' => $validated['type'] === 'datang' ? 'selfie' : $validated['bukti_type'],
            'bukti_path' => $path,
            'keterangan' => $validated['keterangan'] ?? null,
        ]);

        return response()->json([
            'message' => 'Presensi berhasil disimpan',
            'data' => $presensi->only(['id', 'date', 'time', 'type', 'jarak_meter', 'is_in_radius', 'is_terlambat']),
        ], 201);
    }
}