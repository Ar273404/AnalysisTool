export function normalizeTimestamp(value) {
  if (value == null || value === "") return null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? value : new Date(parsed).toISOString();
}

export function alignByTimestamp(records) {
  return records.map((record) => ({
    ...record,
    timestamp: normalizeTimestamp(record.timestamp),
  }));
}
