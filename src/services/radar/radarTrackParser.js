function normalizeRecord(row, trackId) {
  const normalizedRow = Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key.toLowerCase().replace(/[\s_-]+/g, ""),
      value,
    ]),
  );
  const value = (key) =>
    normalizedRow[key.toLowerCase().replace(/[\s_-]+/g, "")] ?? null;
  const number = (key) => {
    const raw = value(key);
    if (raw === null || raw === "") return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  };
  return {
    trackId,
    timestamp: value("timestamp"),
    time: value("time"),
    range: number("range"),
    azimuth: number("azimuth"),
    elevation: number("elevation"),
    height: number("height"),
    snr: number("snr"),
    rcs: number("rcs"),
    speed: number("speed"),
    heading: number("heading"),
    pri: number("pri"),
    rawData: row,
  };
}

export async function parseRadarTrackFile(file) {
  const text = await file.text();
  try {
    const parsed = JSON.parse(text);
    const rows = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed.records)
        ? parsed.records
        : Array.isArray(parsed.tracks)
          ? parsed.tracks.flatMap((track) =>
              (track.records || []).map((record) => ({
                ...record,
                trackId: record.trackId ?? track.trackId ?? track.id,
              })),
            )
          : null;
    if (!Array.isArray(rows))
      throw new Error("JSON must contain an array of records");
    return normalizeRows(rows);
  } catch (jsonError) {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2)
      throw new Error("Unsupported radar format. Supply CSV or JSON records.");
    const headers = lines[0].split(/[\t,;]/).map((header) => header.trim());
    const rows = lines
      .slice(1)
      .map((line) =>
        Object.fromEntries(
          line
            .split(/[\t,;]/)
            .map((value, index) => [headers[index], value.trim()]),
        ),
      );
    return normalizeRows(rows);
  }
}

function normalizeRows(rows) {
  const groups = new Map();
  rows.forEach((row) => {
    const normalizedRow = Object.fromEntries(
      Object.entries(row).map(([key, value]) => [
        key.toLowerCase().replace(/[\s_-]+/g, ""),
        value,
      ]),
    );
    const trackId = String(
      normalizedRow.trackid ?? normalizedRow.track ?? normalizedRow.id ?? "",
    ).trim();
    if (!trackId) return;
    if (!groups.has(trackId)) groups.set(trackId, []);
    groups.get(trackId).push(normalizeRecord(row, trackId));
  });
  return [...groups.entries()].map(([trackId, records]) => ({
    trackId,
    records,
  }));
}

export function createDemoRadarTracks() {
  return [
    {
      trackId: "DEMO-001",
      records: Array.from({ length: 12 }, (_, index) => ({
        trackId: "DEMO-001",
        timestamp: `2026-08-24T10:00:${String(index).padStart(2, "0")}Z`,
        time: `10:00:${String(index).padStart(2, "0")}`,
        range: 4 + index * 0.2,
        azimuth: 12 + index,
        elevation: 3 + index * 0.1,
        height: 80 + index,
        snr: 20 + index * 0.4,
        rcs: 5 + index * 0.1,
        speed: 100 + index,
        heading: 90 + index,
        pri: 1.2,
      })),
    },
  ];
}
