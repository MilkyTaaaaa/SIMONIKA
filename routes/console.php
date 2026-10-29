<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Jalankan pengecekan auto-pulang tiap 5 menit di hari kerja (Senin-Jumat)
Schedule::command('presensi:auto-pulang')
    ->weekdays()
    ->everyFiveMinutes()
    ->withoutOverlapping();