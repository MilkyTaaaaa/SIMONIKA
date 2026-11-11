<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lurah_id')->constrained('users');
            $table->foreignId('pamong_id')->constrained('users');
            $table->foreignId('laporan_harian_id')->nullable()->constrained('laporan_harian')->nullOnDelete();
            $table->string('bulan', 7); // Format Y-m, contoh: 2026-11
            $table->text('catatan');
            $table->timestamps();

            $table->index(['pamong_id', 'bulan']);
            $table->index(['lurah_id', 'bulan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feedback');
    }
};