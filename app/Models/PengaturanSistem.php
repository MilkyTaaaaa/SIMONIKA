<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PengaturanSistem extends Model
{
    protected $table = 'pengaturan_sistem';

    protected $fillable = [
        'jam_masuk_senin_kamis', 'jam_pulang_senin_kamis',
        'jam_masuk_jumat', 'jam_pulang_jumat',
        'toleransi_terlambat_menit', 'radius_meter',
        'latitude_kantor', 'longitude_kantor',
        'batas_izin_sakit_per_bulan', 'deadline_laporan_malam',
        'max_ukuran_file_mb',
    ];
}