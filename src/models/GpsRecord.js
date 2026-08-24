export function createGpsRecord(values = {}) {
  return {
    timestamp: values.timestamp || null,
    time: values.time || null,
    latitude: values.latitude ?? null,
    longitude: values.longitude ?? null,
    altitude: values.altitude ?? null,
    speed: values.speed ?? null,
    course: values.course ?? null,
    fixQuality: values.fixQuality ?? null,
    satellites: values.satellites ?? null,
    sourceFormat: values.sourceFormat || "UNKNOWN",
    rawData: values.rawData || "",
  };
}
