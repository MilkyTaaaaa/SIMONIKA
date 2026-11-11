<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $table = 'feedback';

    protected $fillable = [
        'lurah_id',
        'pamong_id',
        'laporan_harian_id',
        'bulan',
        'catatan',
    ];

    public function lurah()
    {
        return $this->belongsTo(User::class, 'lurah_id');
    }

    public function pamong()
    {
        return $this->belongsTo(User::class, 'pamong_id');
    }

    public function laporanHarian()
    {
        return $this->belongsTo(LaporanHarian::class, 'laporan_harian_id');
    }
}