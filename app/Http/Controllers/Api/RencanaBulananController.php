<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RencanaBulanan;
use Illuminate\Http\Request;

class RencanaBulananController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'bulan' => 'required|date_format:Y-m',
            'rencana_kegiatan' => 'required|string|max:2000',
        ]);

        $user = $request->user();

        $sudahAda = RencanaBulanan::where('user_id', $user->id)
            ->where('bulan', $validated['bulan'])
            ->exists();

        if ($sudahAda) {
            return response()->json([
                'message' => 'Rencana bulan ini sudah diisi',
            ], 409);
        }

        $rencana = RencanaBulanan::create([
            'user_id' => $user->id,
            'bulan' => $validated['bulan'],
            'rencana_kegiatan' => $validated['rencana_kegiatan'],
        ]);

        return response()->json([
            'message' => 'Rencana bulanan tersimpan',
            'data' => [
                'id' => $rencana->id,
                'user_id' => $rencana->user_id,
                'bulan' => $rencana->bulan,
                'rencana_kegiatan' => $rencana->rencana_kegiatan,
            ],
        ], 201);
    }

    public function show(Request $request)
    {
        $request->validate([
            'bulan' => 'sometimes|date_format:Y-m',
            'user_id' => 'sometimes|integer|exists:users,id',
        ]);

        $user = $request->user();
        $bulan = $request->input('bulan', now()->format('Y-m'));

        // Pamong hanya bisa melihat rencananya sendiri; Lurah/Admin bisa filter user_id
        $targetUserId = ($user->role === 'pamong')
            ? $user->id
            : $request->integer('user_id', $user->id);

        $rencana = RencanaBulanan::with('user:id,name,role')
            ->where('user_id', $targetUserId)
            ->where('bulan', $bulan)
            ->first();

        return response()->json([
            'user_id' => $targetUserId,
            'bulan' => $bulan,
            'rencana_kegiatan' => $rencana?->rencana_kegiatan,
        ]);
    }
}