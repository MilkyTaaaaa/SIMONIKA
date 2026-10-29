<?php

namespace App\Console\Commands;

use App\Models\PengaturanSistem;
use App\Models\Presensi;
use Carbon\Carbon;
use Illuminate\Console\Command;

class AutoPulangPresensi extends Command
{
    protected $signature = 'presensi:auto-pulang
                            {--date= : Tanggal target format Y-m-d (default: hari ini)}
                            {--force : Paksa jalankan meskipun belum melewati jam pulang resmi}';

    protected $description = 'Generate presensi pulang otomatis bagi pegawai yang hadir tapi belum tercatat pulang';

    public function handle(): int
    {
        $pengaturan = PengaturanSistem::first();
        if (!$pengaturan) {
            $this->error('Pengaturan sistem belum tersedia.');
            return self::FAILURE;
        }

        $now = now();
        $tanggal = $this->option('date')
            ? Carbon::createFromFormat('Y-m-d', $this->option('date'))->startOfDay()
            : $now->copy()->startOfDay();

        $force = (bool) $this->option('force');

        if ($tanggal->isWeekend() && !$force) {
            $this->info('Hari libur akhir pekan, auto-pulang dilewati.');
            return self::SUCCESS;
        }

        $jamPulangConfig = $tanggal->isFriday()
            ? $pengaturan->jam_pulang_jumat
            : $pengaturan->jam_pulang_senin_kamis;

        $batasPulang = $tanggal->copy()->setTimeFromTimeString($jamPulangConfig);

        // Jika dijalankan untuk hari ini tanpa --force, pastikan sudah masuk/lewat jam pulang
        if ($tanggal->isSameDay($now) && !$force && $now->lt($batasPulang)) {
            $this->info("Belum masuk jam pulang resmi ({$batasPulang->format('H:i:s')}).");
            return self::SUCCESS;
        }

        $dateString = $tanggal->toDateString();
        $jamPulangFormatted = $batasPulang->format('H:i:s');

        // Ambil user_id yang hari itu tercatat datang / tugas_luar
        $userIdsHadir = Presensi::whereDate('date', $dateString)
            ->whereIn('type', ['datang', 'tugas_luar'])
            ->pluck('user_id')
            ->unique();

        // Ambil user_id yang sudah punya presensi pulang di hari itu (misal pulang awal atau sudah digenerate)
        $userIdsSudahPulang = Presensi::whereDate('date', $dateString)
            ->where('type', 'pulang')
            ->pluck('user_id')
            ->unique();

        $targetUserIds = $userIdsHadir->diff($userIdsSudahPulang);

        if ($targetUserIds->isEmpty()) {
            $this->info("Tidak ada presensi yang perlu di-auto-pulang untuk tanggal {$dateString} (0 record dibuat).");
            return self::SUCCESS;
        }

        $jumlah = 0;
        foreach ($targetUserIds as $userId) {
            Presensi::create([
                'user_id' => $userId,
                'date' => $dateString,
                'time' => $jamPulangFormatted,
                'type' => 'pulang',
                'keterangan' => null,
                'is_auto_generated' => true,
            ]);
            $jumlah++;
        }

        $this->info("Berhasil membuat {$jumlah} presensi pulang otomatis untuk tanggal {$dateString}.");
        return self::SUCCESS;
    }
}