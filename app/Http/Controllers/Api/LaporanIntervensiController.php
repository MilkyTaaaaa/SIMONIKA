<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LaporanIntervensi;
use Illuminate\Http\Request;

class LaporanIntervensiController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'bulan' => 'required|date_format:Y-m',
            'narasi' => 'required|string|max:5000',
        ]);

        $laporan = LaporanIntervensi::updateOrCreate(
            ['bulan' => $validated['bulan']],
            [
                'lurah_id' => $request->user()->id,
                'narasi' => $validated['narasi'],
            ]
        );

        return response()->json([
            'message' => 'Laporan intervensi tersimpan',
            'data' => [
                'id' => $laporan->id,
                'lurah_id' => $laporan->lurah_id,
                'bulan' => $laporan->bulan,
                'narasi' => $laporan->narasi,
                'updated_at' => $laporan->updated_at?->toIso8601String(),
            ],
        ], 201);
    }

    public function show(Request $request)
    {
        $request->validate([
            'bulan' => 'sometimes|date_format:Y-m',
        ]);

        $bulan = $request->input('bulan', now()->format('Y-m'));
        $laporan = LaporanIntervensi::with('lurah:id,name')
            ->where('bulan', $bulan)
            ->first();

        return response()->json([
            'bulan' => $bulan,
            'data' => $laporan ? [
                'id' => $laporan->id,
                'lurah_id' => $laporan->lurah_id,
                'nama_lurah' => $laporan->lurah?->name,
                'bulan' => $laporan->bulan,
                'narasi' => $laporan->narasi,
                'updated_at' => $laporan->updated_at?->toIso8601String(),
            ] : null,
        ]);
    }
}