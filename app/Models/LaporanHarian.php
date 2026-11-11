<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaporanHarian extends Model
{
    protected $table = 'laporan_harian';

    protected $fillable = [
        'user_id',
        'date',
        'realisasi_kegiatan',
        'is_luar_jam_kerja',
        'bukti_path',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
        'is_luar_jam_kerja' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}