<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LaporanHarian;
use App\Models\PengaturanSistem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LaporanHarianController extends Controller
{
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
        $query = LaporanHarian::with('user:id,name,jabatan_id')
            ->orderByDesc('date')
            ->orderByDesc('id');

        if ($user->role === 'pamong') {
            $query->where('user_id', $user->id);
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

        $hasil = $query->paginate($request->integer('per_page', 31))->through(fn ($l) => [
            'id' => $l->id,
            'user_id' => $l->user_id,
            'nama' => $l->user->name,
            'date' => $l->date->toDateString(),
            'realisasi_kegiatan' => $l->realisasi_kegiatan,
            'is_luar_jam_kerja' => $l->is_luar_jam_kerja,
            'bukti_url' => $l->bukti_path ? url("/api/laporan-harian/{$l->id}/bukti") : null,
            'created_at' => $l->created_at?->toIso8601String(),
        ]);

        return response()->json($hasil);
    }

    public function store(Request $request)
    {
        $pengaturan = PengaturanSistem::first();
        if (!$pengaturan) {
            return response()->json(['message' => 'Pengaturan sistem belum tersedia'], 500);
        }

        $maxKb = $pengaturan->max_ukuran_file_mb * 1024;

        $validated = $request->validate([
            'date' => 'required|date_format:Y-m-d|before_or_equal:today',
            'realisasi_kegiatan' => 'required|string|max:2000',
            'is_luar_jam_kerja' => 'sometimes|in:true,false,1,0',
            'bukti' => "nullable|file|mimes:jpg,jpeg,png,pdf|max:{$maxKb}",
        ]);

        $now = now();
        $tanggalLaporan = Carbon::createFromFormat('Y-m-d', $validated['date'])->startOfDay();
        $isLuarJamKerja = $request->boolean('is_luar_jam_kerja');

        // Hitung batas waktu pelaporan:
        // Reguler: akhir hari H (23:59:59). Luar jam kerja (malam): H+1 pukul deadline_laporan_malam (07:30)
        $deadlineJam = substr($pengaturan->deadline_laporan_malam, 0, 5);
        $batasWaktu = $isLuarJamKerja
            ? $tanggalLaporan->copy()->addDay()->setTimeFromTimeString($pengaturan->deadline_laporan_malam)
            : $tanggalLaporan->copy()->endOfDay();

        if ($now->gt($batasWaktu)) {
            return response()->json([
                'message' => "Sudah melewati batas waktu pelaporan (H+1 {$deadlineJam})",
            ], 422);
        }

        $user = $request->user();
        $path = $request->hasFile('bukti')
            ? $request->file('bukti')->store("laporan/{$user->id}")
            : null;

        $laporan = LaporanHarian::create([
            'user_id' => $user->id,
            'date' => $tanggalLaporan->toDateString(),
            'realisasi_kegiatan' => $validated['realisasi_kegiatan'],
            'is_luar_jam_kerja' => $isLuarJamKerja,
            'bukti_path' => $path,
        ]);

        return response()->json([
            'message' => 'Laporan harian tersimpan',
            'data' => [
                'id' => $laporan->id,
                'date' => $laporan->date->toDateString(),
                'realisasi_kegiatan' => $laporan->realisasi_kegiatan,
                'is_luar_jam_kerja' => $laporan->is_luar_jam_kerja,
                'bukti_url' => $laporan->bukti_path ? url("/api/laporan-harian/{$laporan->id}/bukti") : null,
            ],
        ], 201);
    }

    public function update(Request $request, LaporanHarian $laporanHarian)
    {
        $user = $request->user();

        if ($laporanHarian->user_id !== $user->id) {
            return response()->json(['message' => 'Anda tidak memiliki akses'], 403);
        }

        if ($laporanHarian->date->format('Y-m') < now()->format('Y-m')) {
            return response()->json([
                'message' => 'Laporan dari periode bulan yang sudah lewat tidak dapat diubah',
            ], 422);
        }

        $validated = $request->validate([
            'realisasi_kegiatan' => 'sometimes|required|string|max:2000',
            'is_luar_jam_kerja' => 'sometimes|boolean',
        ]);

        $laporanHarian->update($validated);

        return response()->json([
            'message' => 'Laporan berhasil diperbarui',
            'data' => [
                'id' => $laporanHarian->id,
                'date' => $laporanHarian->date->toDateString(),
                'realisasi_kegiatan' => $laporanHarian->realisasi_kegiatan,
                'is_luar_jam_kerja' => $laporanHarian->is_luar_jam_kerja,
            ],
        ]);
    }

    public function destroy(Request $request, LaporanHarian $laporanHarian)
    {
        $user = $request->user();

        if ($user->role !== 'admin' && $laporanHarian->user_id !== $user->id) {
            return response()->json(['message' => 'Anda tidak memiliki akses'], 403);
        }

        if ($user->role !== 'admin' && $laporanHarian->date->format('Y-m') < now()->format('Y-m')) {
            return response()->json([
                'message' => 'Laporan dari periode bulan yang sudah lewat tidak dapat dihapus',
            ], 422);
        }

        if ($laporanHarian->bukti_path && Storage::exists($laporanHarian->bukti_path)) {
            Storage::delete($laporanHarian->bukti_path);
        }

        $laporanHarian->delete();

        return response()->json(['message' => 'Laporan berhasil dihapus']);
    }

    public function bukti(Request $request, LaporanHarian $laporanHarian)
    {
        $user = $request->user();

        if ($user->role === 'pamong' && $laporanHarian->user_id !== $user->id) {
            return response()->json(['message' => 'Anda tidak memiliki akses'], 403);
        }

        if (!$laporanHarian->bukti_path || !Storage::exists($laporanHarian->bukti_path)) {
            return response()->json(['message' => 'Bukti tidak ditemukan'], 404);
        }

        return Storage::response($laporanHarian->bukti_path, null, ['X-Content-Type-Options' => 'nosniff']);
    }
}