<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jabatan extends Model
{
    protected $table = 'jabatan';
    protected $fillable = [
        'kode_standar',
        'nama_lokal',
        'beban_kerja_minimal_bulanan',
    ];
}
