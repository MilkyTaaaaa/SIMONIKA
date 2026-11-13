<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Models\LaporanHarian;
use App\Models\LaporanIntervensi;
use App\Models\Presensi;
use App\Models\RencanaBulanan;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'role' => 'sometimes|in:pamong,lurah,admin',
            'jabatan_id' => 'sometimes|integer|exists:jabatan,id',
        ]);

        $query = User::with('jabatan:id,kode_standar,nama_lokal,beban_kerja_minimal_bulanan');

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('jabatan_id')) {
            $query->where('jabatan_id', $request->jabatan_id);
        }

        return response()->json(['data' => $query->orderBy('name')->get()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:100|unique:users,username',
            'password' => 'required|string|min:6',
            'name' => 'required|string|max:255',
            'role' => 'required|in:pamong,lurah,admin',
            'jabatan_id' => 'required_if:role,pamong|nullable|exists:jabatan,id',
            'padukuhan' => 'nullable|string|max:100',
            'pagu_tukin' => 'nullable|integer|min:0',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        return response()->json([
            'message' => 'User berhasil dibuat',
            'data' => $user->load('jabatan:id,kode_standar,nama_lokal,beban_kerja_minimal_bulanan'),
        ], 201);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'username' => "sometimes|required|string|max:100|unique:users,username,{$user->id}",
            'name' => 'sometimes|required|string|max:255',
            'role' => 'sometimes|required|in:pamong,lurah,admin',
            'jabatan_id' => 'nullable|exists:jabatan,id',
            'padukuhan' => 'nullable|string|max:100',
            'pagu_tukin' => 'nullable|integer|min:0',
            'password' => 'sometimes|required|string|min:6',
        ]);

        $targetRole = $validated['role'] ?? $user->role;
        $targetJabatan = array_key_exists('jabatan_id', $validated) ? $validated['jabatan_id'] : $user->jabatan_id;

        if ($targetRole === 'pamong' && empty($targetJabatan)) {
            return response()->json([
                'message' => 'User dengan role pamong wajib memiliki jabatan_id',
                'errors' => ['jabatan_id' => ['Jabatan wajib diisi untuk role pamong.']],
            ], 422);
        }

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User berhasil diperbarui',
            'data' => $user->fresh('jabatan:id,kode_standar,nama_lokal,beban_kerja_minimal_bulanan'),
        ]);
    }

    public function destroy(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif',
            ], 422);
        }

        $punyaRiwayat = Presensi::where('user_id', $user->id)->exists()
            || RencanaBulanan::where('user_id', $user->id)->exists()
            || LaporanHarian::where('user_id', $user->id)->exists()
            || Feedback::where('pamong_id', $user->id)->orWhere('lurah_id', $user->id)->exists()
            || LaporanIntervensi::where('lurah_id', $user->id)->exists();

        if ($punyaRiwayat) {
            return response()->json([
                'message' => 'User tidak dapat dihapus karena sudah memiliki riwayat presensi atau kinerja',
            ], 409);
        }

        try {
            $user->Tokens()->delete();
            $user->delete();
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'User tidak dapat dihapus karena masih terhubung dengan data lain',
            ], 409);
        }

        return response()->json(['message' => 'User berhasil dihapus']);
    }
}