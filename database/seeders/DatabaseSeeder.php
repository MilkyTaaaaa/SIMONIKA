<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Jabatan;
use App\Models\PengaturanSistem;

class DatabaseSeeder extends Seeder{
    public function run(): void
    {
        Jabatan::create([
            'kode_standar' => 'carik',
            'nama_lokal' => 'Kepala Desa',
            'beban_kerja_minimal_bulanan' => 35
        ]);

        Jabatan::create([
            'kode_standar' => 'kasi',
            'nama_lokal' => 'Kepala Seksi',
            'beban_kerja_minimal_bulanan' => 30
        ]);

        Jabatan::create([
            'kode_standar' => 'kaur',
            'nama_lokal' => 'Kepala Urusan',
            'beban_kerja_minimal_bulanan' => 25
        ]);

        Jabatan::create([
            'kode_standar' => 'dukuh',
            'nama_lokal' => 'Dukuh',
            'beban_kerja_minimal_bulanan' => 20
        ]);
        
        PengaturanSistem::create([
            'jam_masuk_senin_kamis' => '07:30',
            'jam_pulang_senin_kamis' => '15:45',
            'jam_masuk_jumat' => '07:30',
            'jam_pulang_jumat' => '15:30',
            'toleransi_terlambat_menit' => 15,
            'radius_meter' => 5000,
            'latitude_kantor' => -7.800000,  // TODO: ganti koordinat asli kantor
            'longitude_kantor' => 110.200000, // TODO: ganti koordinat asli kantor
            'batas_izin_sakit_per_bulan' => 5,
            'deadline_laporan_malam' => '07:30',
            'max_ukuran_file_mb' => 5,
        ]);

        User::create([
            'username' => 'admin',
            'password' => Hash::make('admin123'),
            'name' => 'Admin',
            'role' => 'admin',
        ]);
    }
}
