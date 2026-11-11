<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RencanaBulanan extends Model
{
    protected $table = 'rencana_bulanan';

    protected $fillable = [
        'user_id',
        'bulan',
        'rencana_kegiatan',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}