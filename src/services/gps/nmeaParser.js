import { createGpsRecord } from "../../models/GpsRecord";

function coordinate(value, hemisphere, degreeDigits) {
  if (!value || !hemisphere) return null;
  const degrees = Number(value.slice(0, degreeDigits));
  const minutes = Number(value.slice(degreeDigits));
  if (!Number.isFinite(degrees) || !Number.isFinite(minutes) || minutes >= 60)
    return null;
  const result = degrees + minutes / 60;
  return /[SW]/i.test(hemisphere) ? -result : result;
}

function timeValue(value) {
  if (!/^\d{6}(?:\.\d+)?$/.test(value || "")) return null;
  return `${value.slice(0, 2)}:${value.slice(2, 4)}:${value.slice(4)}`;
}

export function parseNmea(content) {
  const records = [];
  const invalid = [];
  content.split(/\r?\n/).forEach((rawData) => {
    const clean = rawData.trim();
    if (!clean.startsWith("$") || clean.length < 7) return;
    const fields = clean.slice(1).split("*")[0].split(",");
    const type = fields[0].slice(-3);
    let values = null;
    if (type === "GGA" && fields.length >= 10)
      values = {
        time: timeValue(fields[1]),
        latitude: coordinate(fields[2], fields[3], 2),
        longitude: coordinate(fields[4], fields[5], 3),
        fixQuality: fields[6] ? Number(fields[6]) : null,
        satellites: fields[7] ? Number(fields[7]) : null,
        altitude: fields[9] ? Number(fields[9]) : null,
      };
    if (type === "RMC" && fields.length >= 9 && fields[2] === "A")
      values = {
        time: timeValue(fields[1]),
        latitude: coordinate(fields[3], fields[4], 2),
        longitude: coordinate(fields[5], fields[6], 3),
        speed: fields[7] ? Number(fields[7]) * 0.514444 : null,
        course: fields[8] ? Number(fields[8]) : null,
      };
    if (type === "GLL" && fields.length >= 6 && fields[6] !== "V")
      values = {
        time: timeValue(fields[5]),
        latitude: coordinate(fields[1], fields[2], 2),
        longitude: coordinate(fields[3], fields[4], 3),
      };
    if (type === "VTG" && fields.length >= 6)
      values = {
        course: Number(fields[1]),
        speed: Number(fields[5]) * 0.514444,
      };
    if (
      values &&
      (values.latitude != null ||
        values.longitude != null ||
        values.altitude != null)
    )
      records.push(
        createGpsRecord({ ...values, sourceFormat: "NMEA", rawData: clean }),
      );
    else if (["GGA", "RMC", "GLL"].includes(type)) invalid.push(clean);
  });
  return { records, invalidCount: invalid.length };
}
