export function detectGpsFormat(fileName, content) {
  const extension = fileName.toLowerCase().split(".").pop();
  const sample = content.slice(0, 20000);
  if (/\$(GP|GN|GL|BD)[A-Z]{2},/.test(sample) || /\*[0-9A-F]{2}/i.test(sample))
    return "NMEA";
  if (
    /^B\d{6}\d{7}[NS]\d{8}[EW]/m.test(sample) ||
    (/^H[A-Z]/m.test(sample) && /^B/m.test(content))
  )
    return "IGC";
  if (["igc"].includes(extension)) return "IGC";
  if (["nmea", "nme"].includes(extension)) return "NMEA";
  return "UNKNOWN";
}
