<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller{
    public function index(Request $request){
        $query = User::query();

        if ($request->filled('role')){
            $query->where('role', $request->role);
        }

        if ($request->filled('jabatan_id')){
            $query->where('jabatan_id', $request->jabatan_id);
        }

        return response()->json(['data' => $query->get()]);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'username' => 'required|string|unique:users,username',
            'password' => 'required|string|min:6',
            'name' => 'required|string',
            'role' => 'required|in:pamong,lurah,admin',
            'jabatan_id' => 'nullable|exists:jabatan,id',
            'padukuhan' => 'nullable|string',
            'pagu_tukin' => 'nullable|integer|min:0',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        return response()->json(['message' => 'User berhasil dibuat', 'data' => $user], 201);
    }

    public function update(Request $request, User $user){
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'jabatan_id' => 'nullable|exists:jabatan_id',
            'padukuhan' => 'nullable|string',
            'pagu_tukin' => 'nullable|integer|min:0',
            'password' => 'sometimes|string|min:6',
        ]);

        if (isset($validated['password'])){
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json(['message' => 'User berhasil diperbarui']);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User berhasil dihapus']);
    }
}