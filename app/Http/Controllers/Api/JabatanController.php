<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jabatan;
use Illuminate\Http\Request;

class JabatanController extends Controller{
    public function index(){
        return response()->json(['data' => Jabatan::all()]);
    }

    public function update(Request $request, Jabatan $jabatan){
        $validated = $request->validate([
            'nama_lokal' => 'sometimes|string',
            'beban_kerja_minimal_bulanan' => 'sometimes|integer|min:0',
        ]);

        $jabatan->update($validated);
        return response()->json(['message' => 'Jabatan berhasil diperbarui', 'data' => $jabatan]);
    }
}