<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaporanIntervensi extends Model
{
    protected $table = 'laporan_intervensi';

    protected $fillable = [
        'lurah_id',
        'bulan',
        'narasi',
    ];

    public function lurah()
    {
        return $this->belongsTo(User::class, 'lurah_id');
    }
}