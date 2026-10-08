<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\JabatanController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PengaturanSistemController;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/me', fn (Request $request) => $request->user()); // buat cek token cepat
});

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