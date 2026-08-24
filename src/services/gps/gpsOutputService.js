export function gpsRecordsToTxt(records) {
  const header = [
    "Timestamp",
    "Time",
    "Latitude",
    "Longitude",
    "Altitude",
    "Range",
    "Azimuth",
    "Elevation",
    "Sensor Reference",
  ];
  const rows = records.map((record) =>
    [
      record.timestamp,
      record.time,
      record.latitude,
      record.longitude,
      record.altitude,
      record.range,
      record.azimuth,
      record.elevation,
      record.sensorReference,
    ].join("\t"),
  );
  return [header.join("\t"), ...rows].join("\n");
}

export function downloadText(content, fileName, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
