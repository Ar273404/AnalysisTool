import { createGpsRecord } from "../../models/GpsRecord";

export function parseIgc(content) {
  const records = [];
  content.split(/\r?\n/).forEach((rawData) => {
    const line = rawData.trim();
    if (!/^B\d{6}\d{7}[NS]\d{8}[EW]/.test(line)) return;
    const time = `${line.slice(1, 3)}:${line.slice(3, 5)}:${line.slice(5, 7)}`;
    const lat = Number(line.slice(7, 9)) + Number(line.slice(9, 13)) / 60000;
    const lon = Number(line.slice(15, 18)) + Number(line.slice(18, 23)) / 60000;
    const latitude = line[14] === "S" ? -lat : lat;
    const longitude = line[23] === "W" ? -lon : lon;
    const pressureAltitude = Number(line.slice(25, 30));
    if (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      Number.isFinite(pressureAltitude)
    )
      records.push(
        createGpsRecord({
          time,
          latitude,
          longitude,
          altitude: pressureAltitude,
          sourceFormat: "IGC",
          rawData: line,
        }),
      );
  });
  return { records, invalidCount: 0 };
}
