/**
 * Hitung jarak antara dua koordinat geografis (lat, lon) dalam meter
 * Formula Haversine / spherical law of cosines identik dengan sistem eksisting
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const p1 = parseFloat(lat1);
  const p2 = parseFloat(lat2);
  const l1 = parseFloat(lon1);
  const l2 = parseFloat(lon2);

  if (isNaN(p1) || isNaN(p2) || isNaN(l1) || isNaN(l2)) {
    return Infinity;
  }

  // Jika posisi persis sama
  if (p1 === p2 && l1 === l2) {
    return 0;
  }

  const deg2rad = (deg) => (deg * Math.PI) / 180;
  const rad2deg = (rad) => (rad * 180) / Math.PI;

  const theta = l1 - l2;
  let dist =
    Math.sin(deg2rad(p1)) * Math.sin(deg2rad(p2)) +
    Math.cos(deg2rad(p1)) * Math.cos(deg2rad(p2)) * Math.cos(deg2rad(theta));

  // Menjaga nilai acos dalam rentang [-1, 1]
  dist = Math.min(1, Math.max(-1, dist));
  dist = Math.acos(dist);
  dist = rad2deg(dist);

  const miles = dist * 60 * 1.1515;
  const kilometers = miles * 1.609344;
  const meters = Math.round(kilometers * 1000);

  return meters;
};
