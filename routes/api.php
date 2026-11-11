<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardMonitoringController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\JabatanController;
use App\Http\Controllers\Api\LaporanHarianController;
use App\Http\Controllers\Api\LaporanIntervensiController;
use App\Http\Controllers\Api\PengaturanSistemController;
use App\Http\Controllers\Api\PresensiController;
use App\Http\Controllers\Api\RencanaBulananController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);

// Semua user yang sudah login
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/me', fn (Request $request) => $request->user());
});

// Khusus Admin (DP-02 & DP-03)
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

// Khusus Lurah (DP-09 Create Feedback & Intervensi)
Route::middleware(['auth:sanctum', 'role:lurah'])->group(function () {
    Route::post('/feedback', [FeedbackController::class, 'store']);
    Route::post('/laporan-intervensi', [LaporanIntervensiController::class, 'store']);
});

// Lurah & Admin (DP-08 Dashboard Monitoring & Lihat Intervensi)
Route::middleware(['auth:sanctum', 'role:lurah,admin'])->group(function () {
    Route::get('/monitoring/bulanan', [DashboardMonitoringController::class, 'index']);
    Route::get('/laporan-intervensi', [LaporanIntervensiController::class, 'show']);
});

// Pamong & Lurah (DP-04, DP-05, DP-07)
Route::middleware(['auth:sanctum', 'role:pamong,lurah'])->group(function () {
    Route::post('/presensi/datang', [PresensiController::class, 'datang']);
    Route::post('/presensi/izin', [PresensiController::class, 'izin']);
    Route::post('/presensi/pulang-awal', [PresensiController::class, 'pulangAwal']);
    Route::get('/presensi/hari-ini', [PresensiController::class, 'hariIni']);

    Route::post('/rencana-bulanan', [RencanaBulananController::class, 'store']);
    Route::post('/laporan-harian', [LaporanHarianController::class, 'store']);
    Route::put('/laporan-harian/{laporanHarian}', [LaporanHarianController::class, 'update']);
});

// Pamong, Lurah & Admin
Route::middleware(['auth:sanctum', 'role:pamong,lurah,admin'])->group(function () {
    Route::get('/presensi', [PresensiController::class, 'index']);
    Route::get('/presensi/rekap', [PresensiController::class, 'rekap']);
    Route::get('/presensi/{presensi}/bukti', [PresensiController::class, 'bukti']);

    Route::get('/rencana-bulanan', [RencanaBulananController::class, 'show']);
    Route::get('/laporan-harian', [LaporanHarianController::class, 'index']);
    Route::delete('/laporan-harian/{laporanHarian}', [LaporanHarianController::class, 'destroy']);
    Route::get('/laporan-harian/{laporanHarian}/bukti', [LaporanHarianController::class, 'bukti']);

    Route::get('/feedback', [FeedbackController::class, 'index']);
});