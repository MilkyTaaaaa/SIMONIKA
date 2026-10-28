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
        Schema::create('presensi', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users');
    $table->date('date');
    $table->time('time');
    $table->enum('type', ['datang', 'pulang', 'izin', 'tugas_luar']);
    $table->decimal('latitude', 10, 7)->nullable();
    $table->decimal('longitude', 10, 7)->nullable();
    $table->unsignedInteger('jarak_meter')->nullable();
    $table->boolean('is_in_radius')->nullable();
    $table->boolean('is_terlambat')->default(false);
    $table->enum('bukti_type', ['selfie', 'surat_tugas'])->nullable();
    $table->string('bukti_path')->nullable();
    $table->string('keterangan')->nullable();
    $table->boolean('is_auto_generated')->default(false);
    $table->timestamps();
    $table->index(['user_id', 'date']);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presensi');
    }
};
