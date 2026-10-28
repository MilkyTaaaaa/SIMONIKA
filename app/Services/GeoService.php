<?php

namespace App\Services;

class GeoService
{
    /** Jarak 2 titik koordinat dalam meter */
    public static function jarakMeter(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $radiusBumi = 6371000;
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) ** 2
            + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon / 2) ** 2;

        return $radiusBumi * 2 * atan2(sqrt($a), sqrt(1 - $a));
    }
}