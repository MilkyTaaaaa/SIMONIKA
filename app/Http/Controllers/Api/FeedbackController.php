<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Models\LaporanHarian;
use App\Models\User;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'pamong_ids' => 'required|array|min:1',
            'pamong_ids.*' => 'required|integer|distinct|exists:users,id',
            'catatan' => 'required|string|max:2000',
            'laporan_harian_id' => 'nullable|integer|exists:laporan_harian,id',
            'bulan' => 'sometimes|date_format:Y-m',
        ]);

        // Pastikan semua ID yang dikirim benar-benar ber-role pamong
        $validPamongCount = User::whereIn('id', $validated['pamong_ids'])
            ->where('role', 'pamong')
            ->count();

        if ($validPamongCount !== count($validated['pamong_ids'])) {
            return response()->json([
                'message' => 'Feedback hanya dapat dikirimkan kepada user dengan role pamong',
            ], 422);
        }

        // Jika menautkan laporan_harian_id, pastikan hanya untuk 1 pamong pemilik laporan tersebut
        $bulan = $validated['bulan'] ?? now()->format('Y-m');
        if (!empty($validated['laporan_harian_id'])) {
            $laporan = LaporanHarian::findOrFail($validated['laporan_harian_id']);
            if (count($validated['pamong_ids']) > 1 || $validated['pamong_ids'][0] !== $laporan->user_id) {
                return response()->json([
                    'message' => 'Laporan harian yang dipilih tidak sesuai dengan pamong tujuan',
                ], 422);
            }
            $bulan = $laporan->date->format('Y-m');
        }

        $lurah = $request->user();
        $created = [];

        foreach ($validated['pamong_ids'] as $pamongId) {
            $created[] = Feedback::create([
                'lurah_id' => $lurah->id,
                'pamong_id' => $pamongId,
                'laporan_harian_id' => $validated['laporan_harian_id'] ?? null,
                'bulan' => $bulan,
                'catatan' => $validated['catatan'],
            ]);
        }

        $jumlah = count($created);

        return response()->json([
            'message' => "Feedback berhasil dikirim ke {$jumlah} pamong",
            'jumlah_dikirim' => $jumlah,
        ], 201);
    }

    public function index(Request $request)
    {
        $request->validate([
            'bulan' => 'sometimes|date_format:Y-m',
            'pamong_id' => 'sometimes|integer|exists:users,id',
        ]);

        $user = $request->user();
        $bulan = $request->input('bulan', now()->format('Y-m'));

        $query = Feedback::with([
            'pamong:id,name,jabatan_id',
            'lurah:id,name',
            'laporanHarian:id,date,realisasi_kegiatan',
        ])->where('bulan', $bulan)->orderByDesc('created_at');

        // Pamong hanya bisa melihat feedback untuk dirinya sendiri
        if ($user->role === 'pamong') {
            $query->where('pamong_id', $user->id);
        } elseif ($request->filled('pamong_id')) {
            $query->where('pamong_id', $request->pamong_id);
        }

        $data = $query->get()->map(fn ($f) => [
            'id' => $f->id,
            'pamong_id' => $f->pamong_id,
            'nama_pamong' => $f->pamong?->name,
            'lurah_id' => $f->lurah_id,
            'nama_lurah' => $f->lurah?->name,
            'bulan' => $f->bulan,
            'catatan' => $f->catatan,
            'laporan_harian_id' => $f->laporan_harian_id,
            'ringkasan_laporan' => $f->laporanHarian?->realisasi_kegiatan,
            'created_at' => $f->created_at?->toIso8601String(),
        ]);

        $jumlahBulanIni = Feedback::where('bulan', $bulan)->count();

        return response()->json([
            'bulan' => $bulan,
            'jumlah_bulan_ini' => $jumlahBulanIni,
            'data' => $data,
        ]);
    }
}