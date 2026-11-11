<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laporan_intervensi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lurah_id')->constrained('users');
            $table->string('bulan', 7)->unique(); // 1 laporan intervensi per bulan
            $table->text('narasi');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan_intervensi');
    }
};