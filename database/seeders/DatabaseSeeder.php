<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Jabatan;

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

        User::create([
            'username' => 'admin',
            'password' => Hash::make('admin123'),
            'name' => 'Admin',
            'role' => 'admin',
        ]);
    }
}
