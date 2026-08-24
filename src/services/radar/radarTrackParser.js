function normalizeRecord(row, trackId) {
  const normalizedRow = Object.fromEntries(
    Object.entries(row).map(([key, value]) => [normalizeKey(key), value]),
  );
  const value = (key) => {
    const aliases = {
      timestamp: ["timestamp", "datetime", "datetimestamp", "date"],
      time: ["time", "utctime", "utc", "timeutc"],
      range: ["range", "distance", "rangevalue"],
      height: ["height", "altitude", "alt"],
      azimuth: ["azimuth", "az"],
      elevation: ["elevation", "el"],
      snr: ["snr", "signaltonoise", "signalnoise"],
      rcs: ["rcs", "radarcrosssection"],
      speed: ["speed", "velocity"],
      heading: ["heading", "course"],
      pri: ["pri", "pulserepetitioninterval"],
    };
    const candidates = (aliases[key] || [normalizeKey(key)]).map(normalizeKey);
    const exact = candidates.find(
      (candidate) => normalizedRow[candidate] != null,
    );
    if (exact) return normalizedRow[exact];
    const matchingKey = Object.keys(normalizedRow).find((rowKey) =>
      candidates.some((candidate) => rowKey.startsWith(candidate)),
    );
    return matchingKey ? normalizedRow[matchingKey] : null;
  };
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
    const delimiter = detectDelimiter(lines[0]);
    const headers = parseDelimitedLine(lines[0], delimiter).map((header) =>
      header.trim().replace(/^\uFEFF/, ""),
    );
    const rows = lines
      .slice(1)
      .map((line) =>
        Object.fromEntries(
          parseDelimitedLine(line, delimiter).map((value, index) => [
            headers[index],
            value.trim(),
          ]),
        ),
      );
    return normalizeRows(rows);
  }
}

function normalizeRows(rows) {
  const groups = new Map();
  rows.forEach((row) => {
    const normalizedRow = Object.fromEntries(
      Object.entries(row).map(([key, value]) => [normalizeKey(key), value]),
    );
    const trackId = String(
      normalizedRow.trackid ??
        normalizedRow.track ??
        normalizedRow.tracknumber ??
        normalizedRow.trackno ??
        normalizedRow.id ??
        "",
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

function normalizeKey(key) {
  return String(key)
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function detectDelimiter(line) {
  const candidates = [",", "\t", ";"];
  return candidates.reduce(
    (best, candidate) =>
      line.split(candidate).length > line.split(best).length ? candidate : best,
    ",",
  );
}

function parseDelimitedLine(line, delimiter) {
  const values = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && line[index + 1] === '"' && quoted) {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === delimiter && !quoted) {
      values.push(value);
      value = "";
    } else {
      value += character;
    }
  }
  values.push(value);
  return values;
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
