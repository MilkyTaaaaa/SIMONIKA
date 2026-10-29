<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Presensi extends Model
{
    protected $table = 'presensi';

    protected $fillable = [
        'user_id', 'date', 'time', 'type', 'latitude', 'longitude', 'jarak_meter',
        'is_in_radius', 'is_terlambat', 'bukti_type', 'bukti_path', 'keterangan', 'is_auto_generated',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
        'latitude' => 'float',
        'longitude' => 'float',
        'is_in_radius' => 'boolean',
        'is_terlambat' => 'boolean',
        'is_auto_generated' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}