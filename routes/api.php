<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JabatanController;
use App\Http\Controllers\Api\PengaturanSistemController;
use App\Http\Controllers\Api\PresensiController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);

// Semua user yang sudah login
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/me', fn (Request $request) => $request->user());
});

// Admin saja
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/jabatan', [JabatanController::class, 'index']);
    Route::put('/jabatan/{jabatan}', [JabatanController::class, 'update']);

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);

    Route::get('/pengaturan-sistem', [PengaturanSistemController::class, 'show']);
    Route::put('/pengaturan-sistem', [PengaturanSistemController::class, 'update']);
});

// Pamong & Lurah
Route::middleware(['auth:sanctum', 'role:pamong,lurah'])->group(function () {
    Route::post('/presensi/datang', [PresensiController::class, 'datang']);
    Route::post('/presensi/izin', [PresensiController::class, 'izin']);
    Route::post('/presensi/pulang-awal', [PresensiController::class, 'pulangAwal']);
    Route::get('/presensi/hari-ini', [PresensiController::class, 'hariIni']);
});

// Pamong, Lurah & Admin
Route::middleware(['auth:sanctum', 'role:pamong,lurah,admin'])->group(function () {
    Route::get('/presensi', [PresensiController::class, 'index']);
    Route::get('/presensi/{presensi}/bukti', [PresensiController::class, 'bukti']);
});