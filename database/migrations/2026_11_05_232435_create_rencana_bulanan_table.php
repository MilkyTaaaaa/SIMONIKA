<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rencana_bulanan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->string('bulan', 7); // Format Y-m, contoh: 2026-11
            $table->text('rencana_kegiatan');
            $table->timestamps();

            $table->unique(['user_id', 'bulan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rencana_bulanan');
    }
};