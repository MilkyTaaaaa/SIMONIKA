<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PengaturanSistem;
use App\Models\Presensi;
use App\Models\User;
use App\Services\GeoService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            'data' => [
                'id' => $presensi->id,
                'date' => $presensi->date->toDateString(),
                'time' => $presensi->time,
                'type' => $presensi->type,
                'jarak_meter' => $presensi->jarak_meter,
                'is_in_radius' => $presensi->is_in_radius,
                'is_terlambat' => $presensi->is_terlambat,
            ],
        ], 201);
    }

    public function izin(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date_format:Y-m-d|after_or_equal:today',
            'keterangan' => 'required|string|max:255',
        ]);

        $tanggal = Carbon::parse($validated['date']);

        if ($tanggal->isWeekend()) {
            return response()->json(['message' => 'Izin hanya bisa diajukan untuk hari kerja (Senin-Jumat)'], 422);
        }

        $user = $request->user();

        $sudahAda = Presensi::where('user_id', $user->id)
            ->whereDate('date', $tanggal->toDateString())
            ->whereIn('type', ['datang', 'tugas_luar', 'izin'])
            ->exists();

        if ($sudahAda) {
            return response()->json(['message' => 'Sudah ada presensi/izin pada tanggal tersebut'], 409);
        }

        $presensi = Presensi::create([
            'user_id' => $user->id,
            'date' => $tanggal->toDateString(),
            'time' => now()->format('H:i:s'),
            'type' => 'izin',
            'keterangan' => $validated['keterangan'],
        ]);

        return response()->json([
            'message' => 'Izin berhasil diajukan',
            'data' => [
                'id' => $presensi->id,
                'date' => $presensi->date->toDateString(),
                'type' => $presensi->type,
                'keterangan' => $presensi->keterangan,
            ],
        ], 201);
    }

    public function pulangAwal(Request $request)
    {
        $validated = $request->validate([
            'keterangan' => 'required|string|max:255',
        ]);

        $pengaturan = PengaturanSistem::first();
        if (!$pengaturan) {
            return response()->json(['message' => 'Pengaturan sistem belum tersedia'], 500);
        }

        $user = $request->user();
        $now = now();

        $hadirHariIni = Presensi::where('user_id', $user->id)
            ->whereDate('date', $now->toDateString())
            ->whereIn('type', ['datang', 'tugas_luar'])
            ->exists();

        if (!$hadirHariIni) {
            return response()->json(['message' => 'Anda belum presensi datang hari ini'], 422);
        }

        $sudahPulang = Presensi::where('user_id', $user->id)
            ->whereDate('date', $now->toDateString())
            ->where('type', 'pulang')
            ->exists();

        if ($sudahPulang) {
            return response()->json(['message' => 'Presensi pulang hari ini sudah tercatat'], 409);
        }

        $jamPulang = $now->isFriday()
            ? $pengaturan->jam_pulang_jumat
            : ($now->isWeekday() ? $pengaturan->jam_pulang_senin_kamis : null);

        if ($jamPulang && $now->gte($now->copy()->setTimeFromTimeString($jamPulang))) {
            return response()->json([
                'message' => 'Jam pulang resmi sudah lewat, pulang awal tidak diperlukan',
            ], 422);
        }

        $presensi = Presensi::create([
            'user_id' => $user->id,
            'date' => $now->toDateString(),
            'time' => $now->format('H:i:s'),
            'type' => 'pulang',
            'keterangan' => $validated['keterangan'],
            'is_auto_generated' => false,
        ]);

        return response()->json([
            'message' => 'Pulang awal berhasil dicatat',
            'data' => [
                'id' => $presensi->id,
                'date' => $presensi->date->toDateString(),
                'time' => $presensi->time,
                'type' => $presensi->type,
                'keterangan' => $presensi->keterangan,
            ],
        ], 201);
    }

    public function hariIni()
    {
        $hariIni = now()->toDateString();

        $presensiHariIni = Presensi::whereDate('date', $hariIni)
            ->whereIn('type', ['datang', 'tugas_luar', 'izin'])
            ->get()
            ->keyBy('user_id');

        $data = User::with('jabatan')
            ->where('role', 'pamong')
            ->orderBy('name')
            ->get()
            ->map(function ($u) use ($presensiHariIni) {
                $p = $presensiHariIni->get($u->id);

                return [
                    'user_id' => $u->id,
                    'nama' => $u->name,
                    'jabatan' => $u->jabatan?->nama_lokal,
                    'padukuhan' => $u->padukuhan,
                    'status' => match ($p?->type) {
                        'datang' => 'Hadir di Kantor',
                        'tugas_luar' => 'Tugas Luar',
                        'izin' => 'Izin',
                        default => 'Belum Presensi',
                    },
                    'jam_presensi' => ($p && $p->type !== 'izin') ? $p->time : null,
                    'lokasi_kegiatan' => $p?->type === 'tugas_luar' ? $p->keterangan : null,
                ];
            });

        return response()->json(['tanggal' => $hariIni, 'data' => $data]);
    }

    public function index(Request $request)
    {
        $request->validate([
            'user_id' => 'sometimes|integer|exists:users,id',
            'bulan' => 'sometimes|date_format:Y-m',
            'date_from' => 'sometimes|date_format:Y-m-d',
            'date_to' => 'sometimes|date_format:Y-m-d|after_or_equal:date_from',
            'per_page' => 'sometimes|integer|min:1|max:100',
        ]);

        $user = $request->user();
        $query = Presensi::with('user:id,name')->orderByDesc('date')->orderByDesc('time');

        if ($user->role === 'pamong') {
            $query->where('user_id', $user->id); // pamong: selalu miliknya sendiri
        } elseif ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('bulan')) {
            $awal = Carbon::parse($request->bulan . '-01')->startOfMonth();
            $query->whereBetween('date', [$awal->toDateString(), $awal->copy()->endOfMonth()->toDateString()]);
        }
        if ($request->filled('date_from')) {
            $query->whereDate('date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('date', '<=', $request->date_to);
        }

        $hasil = $query->paginate($request->integer('per_page', 31))->through(fn ($p) => [
            'id' => $p->id,
            'user_id' => $p->user_id,
            'nama' => $p->user->name,
            'date' => $p->date->toDateString(),
            'time' => $p->time,
            'type' => $p->type,
            'latitude' => $p->latitude,
            'longitude' => $p->longitude,
            'jarak_meter' => $p->jarak_meter,
            'is_in_radius' => $p->is_in_radius,
            'is_terlambat' => $p->is_terlambat,
            'bukti_type' => $p->bukti_type,
            'keterangan' => $p->keterangan,
            'is_auto_generated' => $p->is_auto_generated,
            'bukti_url' => $p->bukti_path ? url("/api/presensi/{$p->id}/bukti") : null,
        ]);

        return response()->json($hasil);
    }

    public function bukti(Request $request, Presensi $presensi)
    {
        $user = $request->user();

        if ($user->role === 'pamong' && $presensi->user_id !== $user->id) {
            return response()->json(['message' => 'Anda tidak memiliki akses'], 403);
        }

        if (!$presensi->bukti_path || !Storage::exists($presensi->bukti_path)) {
            return response()->json(['message' => 'Bukti tidak ditemukan'], 404);
        }

        return Storage::response($presensi->bukti_path, null, ['X-Content-Type-Options' => 'nosniff']);
    }
}