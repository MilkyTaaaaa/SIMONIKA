<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pengaturan_sistem', function (Blueprint $table) {
            $table->id();
            $table->time('jam_masuk_senin_kamis');
            $table->time('jam_pulang_senin_kamis');
            $table->time('jam_masuk_jumat');
            $table->time('jam_pulang_jumat');
            $table->unsignedInteger('toleransi_terlambat_menit');
            $table->unsignedInteger('radius_meter');
            $table->decimal('latitude_kantor', 10, 7);
            $table->decimal('longitude_kantor', 10, 7);
            $table->unsignedInteger('batas_izin_sakit_per_bulan');
            $table->time('deadline_laporan_malam'); // jam di hari H+1
            $table->unsignedInteger('max_ukuran_file_mb'); // dalam MB
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengaturan_sistem');
    }
};
