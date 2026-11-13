const R = 6371000;
const rad = (d) => (d * Math.PI) / 180;

export function distanceMeters(a, b) {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Hasil ini hanya informasi UX. BUKAN validasi keamanan; backend wajib memvalidasi lokasi.
export function evaluateGeofence(position, cfg) {
  if (!position) return { state: 'unknown' };
  if (position.accuracy > cfg.maxAccuracyM) return { state: 'poor_accuracy' };
  if (cfg.lat == null || cfg.lng == null) return { state: 'unconfigured' };
  const distance = distanceMeters(
    { lat: position.latitude, lng: position.longitude },
    { lat: cfg.lat, lng: cfg.lng }
  );
  return { state: distance <= cfg.radiusM ? 'inside' : 'outside', distance };
}
