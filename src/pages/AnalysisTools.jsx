import { useMemo, useState } from "react";
import {
  Activity,
  Download,
  FileDown,
  RotateCcw,
  Upload,
  X,
} from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { detectGpsFormat } from "../services/gpsFormatDetector";
import { parseIgc } from "../services/gps/igcParser";
import { parseNmea } from "../services/gps/nmeaParser";
import { calculateGpsParameters } from "../services/gps/gpsCalculationService";
import {
  downloadText,
  gpsRecordsToTxt,
} from "../services/gps/gpsOutputService";
import {
  createDemoRadarTracks,
  parseRadarTrackFile,
} from "../services/radar/radarTrackParser";

const plotOptions = [
  ["timeVsRange", "Time Vs Range", "time", "range"],
  ["timeVsAzimuth", "Time Vs Azimuth", "time", "azimuth"],
  ["timeVsElevation", "Time Vs Elevation", "time", "elevation"],
  ["timeVsHeight", "Time Vs Height", "time", "height"],
  ["timeVsSnr", "Time Vs SNR", "time", "snr"],
  ["timeVsRcs", "Time Vs RCS", "time", "rcs"],
  ["timeVsSpeed", "Time Vs Speed", "time", "speed"],
  ["timeVsHeading", "Time Vs Heading", "time", "heading"],
  ["rangeVsElevation", "Range Vs Elevation", "range", "elevation"],
  ["rangeVsHeight", "Range Vs Height", "range", "height"],
  ["rangeVsSnr", "Range Vs SNR", "range", "snr"],
  ["rangeVsRcs", "Range Vs RCS", "range", "rcs"],
  ["pri", "PRI", "time", "pri"],
];
const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";
const plotColors = [
  "#2563eb",
  "#e11d48",
  "#059669",
  "#d97706",
  "#7c3aed",
  "#0891b2",
  "#65a30d",
  "#db2777",
];

function offsetValue(value, key, offset) {
  if (!Number.isFinite(Number(value))) return value;
  return Number(value) + (offset.enabled ? Number(offset[key] || 0) : 0);
}

function offsetTimestamp(value, offset) {
  if (!offset.enabled || !Number(offset.time) || value == null) return value;
  const parsed = Date.parse(value);
  if (Number.isFinite(parsed))
    return new Date(parsed + Number(offset.time)).toISOString();
  return value;
}

function chartSortValue(value) {
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return numeric;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : String(value ?? "");
}

function Panel({ title, eyebrow, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-panel ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-600">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}
function FileSummary({ file, format, records, status }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
      <span>
        Name{" "}
        <b className="block truncate text-slate-900">
          {file?.name || "No file selected"}
        </b>
      </span>
      <span>
        Format <b className="block text-slate-900">{format || "-"}</b>
      </span>
      <span>
        Size{" "}
        <b className="block text-slate-900">
          {file ? `${(file.size / 1024).toFixed(1)} KB` : "-"}
        </b>
      </span>
      <span>
        Records <b className="block text-slate-900">{records?.length || 0}</b>
      </span>
      <span className="col-span-2">
        Status <b className="block text-emerald-700">{status}</b>
      </span>
    </div>
  );
}
function DataTable({ records, fields, empty = "No records to display." }) {
  if (!records.length)
    return <p className="p-4 text-sm text-slate-500">{empty}</p>;
  return (
    <div className="max-h-64 overflow-auto">
      <table className="w-full min-w-[680px] text-left text-xs">
        <thead className="sticky top-0 bg-slate-100 text-[10px] uppercase tracking-wide text-slate-500">
          <tr>
            {fields.map(([key, label]) => (
              <th key={key} className="px-3 py-2 font-semibold">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {records.slice(0, 100).map((record, index) => (
            <tr key={`${record.timestamp}-${index}`} className="text-slate-700">
              <td className="px-3 py-2">
                {record.timestamp || record.time || "-"}
              </td>
              {fields.slice(1).map(([key]) => (
                <td key={key} className="px-3 py-2">
                  {record[key] ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AnalysisTools() {
  const [gps, setGps] = useState({
    file: null,
    format: "",
    records: [],
    processed: [],
    reference: {
      sensorReference: "LRDE",
      latitude: { deg: "", min: "", sec: "" },
      longitude: { deg: "", min: "", sec: "" },
      altitude: "",
    },
    start: "",
    end: "",
    status: "Ready",
    error: "",
  });
  const [radar, setRadar] = useState({
    file: null,
    tracks: [],
    selected: [],
    status: "Ready",
    error: "",
    demo: false,
  });
  const [plot, setPlot] = useState({
    selected: [],
    result: null,
    error: "",
  });
  const [offset, setOffset] = useState({
    range: 0,
    azimuth: 0,
    elevation: 0,
    time: 0,
    enabled: false,
  });
  const [radarSearch, setRadarSearch] = useState("");

  const updateReference = (group, key, value) =>
    setGps((current) => ({
      ...current,
      reference: {
        ...current.reference,
        [group]: { ...current.reference[group], [key]: value },
      },
    }));
  const readGps = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const content = await file.text();
    const format = detectGpsFormat(file.name, content);
    const parsed =
      format === "NMEA"
        ? parseNmea(content)
        : format === "IGC"
          ? parseIgc(content)
          : { records: [] };
    setGps((current) => ({
      ...current,
      file,
      format,
      records: parsed.records,
      status:
        format === "UNKNOWN"
          ? "Unsupported or unknown GPS file format."
          : `Parsed ${parsed.records.length} records`,
      error:
        format === "UNKNOWN"
          ? "Unsupported or unknown GPS file format."
          : parsed.records.length
            ? ""
            : "GPS file was selected, but no valid GPS records were found.",
    }));
  };
  const extractGps = () => {
    if (!gps.records.length)
      return setGps((current) => ({
        ...current,
        error: "Select a valid GPS file before extracting.",
      }));
    const start = gps.start === "" ? 0 : Number(gps.start);
    const end = gps.end === "" ? Infinity : Number(gps.end);
    if (!Number.isFinite(start) || start < 0 || end < start)
      return setGps((current) => ({
        ...current,
        error:
          "Start Time must be non-negative and End Time must be greater than or equal to Start Time.",
      }));
    const processed = gps.records
      .filter((record) => {
        const parts = (record.time || "0:0:0").split(":").map(Number);
        const seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        return seconds >= start && seconds <= end;
      })
      .map((record) =>
        calculateGpsParameters(
          { ...record, timestamp: record.timestamp || record.time },
          gps.reference,
        ),
      );
    setGps((current) => ({
      ...current,
      processed,
      status: `Processing completed: ${processed.length} records`,
      error: "",
    }));
  };
  const loadGpsDemo = async () => {
    const response = await fetch("/sample_gps.nmea");
    const content = await response.text();
    const file = new File([content], "sample_gps.nmea", { type: "text/plain" });
    const format = detectGpsFormat(file.name, content);
    const parsed = parseNmea(content);
    setGps((current) => ({
      ...current,
      file,
      format,
      records: parsed.records,
      processed: [],
      status: `DEMO MODE: parsed ${parsed.records.length} records`,
      error: parsed.records.length
        ? ""
        : "GPS demo file contains no valid records.",
    }));
  };
  const clearGps = () =>
    setGps((current) => ({
      ...current,
      file: null,
      format: "",
      records: [],
      processed: [],
      status: "Ready",
      error: "",
    }));
  const readRadar = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const tracks = await parseRadarTrackFile(file);
      setRadar({
        file,
        tracks,
        selected: [],
        status: `Loaded ${tracks.length} tracks`,
        error: tracks.length
          ? ""
          : "Radar file contains no valid track records.",
        demo: false,
      });
    } catch (error) {
      setRadar((current) => ({
        ...current,
        file,
        tracks: [],
        status: "Parse failed",
        error: error.message,
      }));
    }
  };
  const toggleTrack = (trackId) =>
    setRadar((current) => ({
      ...current,
      selected: current.selected.includes(trackId)
        ? current.selected.filter((id) => id !== trackId)
        : [...current.selected, trackId],
    }));
  const selectedTracks = radar.tracks.filter((track) =>
    radar.selected.includes(track.trackId),
  );
  const visibleTracks = radar.tracks.filter((track) =>
    track.trackId.toLowerCase().includes(radarSearch.toLowerCase()),
  );
  const activeTracks = selectedTracks;
  const selectedOption = plot.selected.length
    ? plotOptions.find((option) => option[0] === plot.selected[0])
    : null;
  const chartData = useMemo(() => {
    if (!selectedOption) return [];
    const [, , xKey, yKey] = selectedOption;
    const rows = new Map();
    const occurrencesByTrack = new Map();

    activeTracks.forEach((track) => {
      track.records.forEach((record) => {
        const value = record[yKey];
        if (
          value === null ||
          value === "" ||
          value === undefined ||
          !Number.isFinite(Number(value))
        )
          return;

        const x = offsetTimestamp(record[xKey], offset);
        const trackOccurrences = occurrencesByTrack.get(track.trackId) || {};
        const occurrence = trackOccurrences[x] || 0;
        trackOccurrences[x] = occurrence + 1;
        occurrencesByTrack.set(track.trackId, trackOccurrences);

        const rowKey = `${String(x)}::${occurrence}`;
        const row = rows.get(rowKey) || { x, timestamp: record.timestamp };
        row[track.trackId] = offsetValue(value, yKey, offset);
        rows.set(rowKey, row);
      });
    });

    return [...rows.values()].sort((first, second) => {
      const order = chartSortValue(first.x) - chartSortValue(second.x);
      return Number.isFinite(order)
        ? order
        : String(first.x).localeCompare(String(second.x));
    });
  }, [activeTracks, selectedOption, offset]);
  const plotRadar = () => {
    if (!radar.tracks.length)
      return setPlot((current) => ({
        ...current,
        error: "Please extract a radar track file first.",
      }));
    if (!selectedTracks.length)
      return setPlot((current) => ({
        ...current,
        error: "Please select at least one radar track.",
      }));
    if (!plot.selected.length)
      return setPlot((current) => ({
        ...current,
        error: "Please select at least one plot type.",
      }));
    setPlot((current) => ({
      ...current,
      result: {
        source: "radar",
        title: selectedOption[1],
        points: chartData,
        tracks: activeTracks.map((track) => track.trackId),
      },
      error: "",
    }));
  };
  const plotGps = () => {
    if (!gps.processed.length)
      return setPlot((current) => ({
        ...current,
        error: "Please extract GPS data first.",
      }));
    setPlot((current) => ({
      ...current,
      result: {
        source: "gps",
        title: "GPS Trajectory",
        points: gps.processed.map((record) => ({
          x: offsetValue(record.longitude, "azimuth", offset),
          GPS: offsetValue(record.latitude, "elevation", offset),
          timestamp: record.timestamp,
        })),
        tracks: ["GPS"],
      },
      error: "",
    }));
  };
  const plotCombined = () => {
    if (!gps.processed.length)
      return setPlot((current) => ({
        ...current,
        error: "Please extract GPS data first.",
      }));
    if (!radar.tracks.length)
      return setPlot((current) => ({
        ...current,
        error: "Please extract radar track data first.",
      }));
    setPlot((current) => ({
      ...current,
      result: {
        source: "combined",
        title: "GPS + Radar Range",
        points: [
          ...gps.processed.map((record) => ({
            x: offsetTimestamp(record.timestamp || record.time, offset),
            GPS: offsetValue(record.range, "range", offset),
          })),
          ...activeTracks.flatMap((track) =>
            track.records.map((record) => ({
              x: offsetTimestamp(record.timestamp || record.time, offset),
              [track.trackId]: offsetValue(record.range, "range", offset),
            })),
          ),
        ],
        tracks: ["GPS", ...activeTracks.map((track) => track.trackId)],
      },
      error: "",
    }));
  };
  const savePlotData = () => {
    if (!plot.result) return;
    const keys = [
      ...new Set(plot.result.points.flatMap((point) => Object.keys(point))),
    ];
    downloadText(
      [
        keys.join(","),
        ...plot.result.points.map((point) =>
          keys.map((key) => point[key] ?? "").join(","),
        ),
      ].join("\n"),
      "analysis_plot_data.csv",
      "text/csv",
    );
  };
  const saveGps = () =>
    downloadText(
      gpsRecordsToTxt(gps.processed),
      `processed_gps_${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}.txt`,
    );
  const resetOffset = () =>
    setOffset({ range: 0, azimuth: 0, elevation: 0, time: 0, enabled: false });
  const radarPreview = selectedTracks.flatMap((track) =>
    track.records.map((record) => ({ ...record, trackId: track.trackId })),
  );

  return (
    <div className="space-y-5 pb-8">
      <header className="flex items-center justify-between rounded-2xl bg-slate-950 px-6 py-5 text-white shadow-panel">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-500/20 p-3 text-blue-300">
            <Activity />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-blue-300">
              Engineering workstation
            </p>
            <h1 className="text-2xl font-semibold">Analysis Tools</h1>
          </div>
        </div>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
          Local processing
        </span>
      </header>
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="GPS" eyebrow="01 / Input and processing">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <Upload className="h-4 w-4" />
              {gps.file?.name || "Choose NMEA or IGC file"}
              <input
                type="file"
                accept=".nmea,.nme,.txt,.igc"
                onChange={readGps}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={clearGps}
              className={`${buttonClass} border border-slate-200 bg-white text-slate-600`}>
              <X className="h-4 w-4" />
              Clear
            </button>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
            <button
              type="button"
              onClick={loadGpsDemo}
              className="font-semibold text-blue-700 underline">
              Load DEMO MODE GPS
            </button>
            <a
              href="/sample_gps.nmea"
              download="sample_gps.nmea"
              className="text-slate-500 underline">
              Download sample GPS file
            </a>
          </div>
          <FileSummary
            file={gps.file}
            format={gps.format}
            records={gps.records}
            status={gps.status}
          />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Sensor Reference
              </p>
              <div className="flex gap-4 text-sm">
                {["LRDE", "Kolar", "Other"].map((name) => (
                  <label key={name} className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      checked={gps.reference.sensorReference === name}
                      onChange={() =>
                        setGps((current) => ({
                          ...current,
                          reference: {
                            ...current.reference,
                            sensorReference: name,
                          },
                        }))
                      }
                    />
                    {name}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-slate-500">
                Altitude
                <input
                  value={gps.reference.altitude}
                  onChange={(e) =>
                    setGps((current) => ({
                      ...current,
                      reference: {
                        ...current.reference,
                        altitude: e.target.value,
                      },
                    }))
                  }
                  className={inputClass}
                  placeholder="m"
                />
              </label>
              <label className="text-xs text-slate-500">
                Start Time (sec)
                <input
                  value={gps.start}
                  onChange={(e) =>
                    setGps((current) => ({ ...current, start: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="0"
                />
              </label>
            </div>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-semibold text-slate-500">
                Latitude
              </p>
              <div className="grid grid-cols-3 gap-2">
                {["deg", "min", "sec"].map((key) => (
                  <input
                    key={key}
                    value={gps.reference.latitude[key]}
                    onChange={(e) =>
                      updateReference("latitude", key, e.target.value)
                    }
                    className={inputClass}
                    placeholder={key}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold text-slate-500">
                Longitude
              </p>
              <div className="grid grid-cols-3 gap-2">
                {["deg", "min", "sec"].map((key) => (
                  <input
                    key={key}
                    value={gps.reference.longitude[key]}
                    onChange={(e) =>
                      updateReference("longitude", key, e.target.value)
                    }
                    className={inputClass}
                    placeholder={key}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-end gap-3">
            <label className="flex-1 text-xs text-slate-500">
              End Time (sec)
              <input
                value={gps.end}
                onChange={(e) =>
                  setGps((current) => ({ ...current, end: e.target.value }))
                }
                className={inputClass}
                placeholder="Complete dataset"
              />
            </label>
            <button
              type="button"
              onClick={extractGps}
              className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700`}>
              <Activity className="h-4 w-4" />
              Extract
            </button>
          </div>
          {gps.error && (
            <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {gps.error}
            </p>
          )}
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
            <DataTable
              records={gps.processed.length ? gps.processed : gps.records}
              fields={[
                ["timestamp", "Timestamp"],
                ["latitude", "Latitude"],
                ["longitude", "Longitude"],
                ["altitude", "Altitude"],
                ["range", "Range"],
                ["azimuth", "Azimuth"],
                ["elevation", "Elevation"],
              ]}
            />
          </div>
          {gps.processed.length > 0 && (
            <button
              type="button"
              onClick={saveGps}
              className={`${buttonClass} mt-3 bg-emerald-600 text-white hover:bg-emerald-700`}>
              <FileDown className="h-4 w-4" />
              Save GPS TXT
            </button>
          )}
        </Panel>
        <Panel title="Radar Track" eyebrow="02 / Track extraction">
          <div className="flex gap-2">
            <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <Upload className="h-4 w-4" />
              {radar.file?.name || "Choose CSV or JSON track file"}
              <input
                type="file"
                accept=".csv,.txt,.json"
                onChange={readRadar}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={() =>
                setRadar({
                  file: null,
                  tracks: [],
                  selected: [],
                  status: "Ready",
                  error: "",
                  demo: false,
                })
              }
              className={`${buttonClass} border border-slate-200 bg-white text-slate-600`}>
              <X className="h-4 w-4" />
              Clear
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm">
            <span>Number of Tracks</span>
            <b className="text-lg text-blue-700">{radar.tracks.length}</b>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200">
              <div className="flex items-center justify-between border-b p-3">
                <b className="text-sm">List Tracks</b>
                <input
                  value={radarSearch}
                  onChange={(e) => setRadarSearch(e.target.value)}
                  className="w-28 rounded border px-2 py-1 text-xs"
                  placeholder="Search"
                />
              </div>
              <div className="max-h-48 overflow-auto p-2">
                {visibleTracks.map((track) => (
                  <label
                    key={track.trackId}
                    className="flex items-center gap-2 rounded px-2 py-2 text-sm hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={radar.selected.includes(track.trackId)}
                      onChange={() => toggleTrack(track.trackId)}
                    />
                    {track.trackId}
                  </label>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200">
              <div className="border-b p-3">
                <b className="text-sm">
                  Selected Tracks ({selectedTracks.length})
                </b>
              </div>
              <div className="max-h-48 overflow-auto p-3 text-sm text-slate-600">
                {selectedTracks.map((track) => (
                  <p key={track.trackId} className="py-1">
                    {track.trackId}
                  </p>
                ))}
                {!selectedTracks.length && (
                  <p className="text-slate-400">
                    Select tracks to inspect them.
                  </p>
                )}
              </div>
            </div>
          </div>
          {radar.status && (
            <p className="mt-3 text-xs text-slate-500">{radar.status}</p>
          )}
          {radar.error && (
            <p className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {radar.error}
            </p>
          )}
          <div className="mt-4 overflow-auto rounded-lg border border-slate-200">
            <DataTable
              records={radarPreview}
              fields={[
                ["timestamp", "Timestamp"],
                ["trackId", "Track ID"],
                ["range", "Range"],
                ["azimuth", "Azimuth"],
                ["elevation", "Elevation"],
                ["height", "Height"],
                ["snr", "SNR"],
                ["speed", "Speed"],
              ]}
              empty="Select a track to preview records."
            />
          </div>
          <button
            type="button"
            onClick={() =>
              setRadar({
                file: null,
                tracks: createDemoRadarTracks(),
                selected: ["DEMO-001"],
                status: "DEMO MODE: sample track loaded",
                error: "",
                demo: true,
              })
            }
            className="mt-3 text-xs font-semibold text-slate-500 underline">
            Load DEMO MODE track
          </button>
        </Panel>
      </div>
      <Panel title="Plot Tracks" eyebrow="03 / Visualization">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={
                radar.selected.length === radar.tracks.length &&
                radar.tracks.length > 0
              }
              onChange={(e) =>
                setRadar((current) => ({
                  ...current,
                  selected: e.target.checked
                    ? current.tracks.map((track) => track.trackId)
                    : [],
                }))
              }
            />
            Select All
          </label>
        </div>
        <div className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
          {plotOptions.map(([id, label]) => (
            <label
              key={id}
              className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={plot.selected.includes(id)}
                onChange={() =>
                  setPlot((current) => ({
                    ...current,
                    selected: current.selected.includes(id)
                      ? current.selected.filter((item) => item !== id)
                      : [...current.selected, id],
                  }))
                }
              />
              {label}
            </label>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={plotRadar}
            className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700`}>
            Plot Track
          </button>
          <button
            type="button"
            onClick={plotGps}
            className={`${buttonClass} border border-blue-200 bg-blue-50 text-blue-700`}>
            Plot GPS Track
          </button>
          <button
            type="button"
            onClick={plotCombined}
            className={`${buttonClass} border border-slate-200 bg-white text-slate-700`}>
            Plot GPS + Radar
          </button>
          <button
            type="button"
            onClick={() =>
              setPlot((current) => ({ ...current, result: null, error: "" }))
            }
            className={`${buttonClass} border border-slate-200 bg-white text-slate-600`}>
            <RotateCcw className="h-4 w-4" />
            Clear Plot
          </button>
        </div>
        {plot.error && (
          <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {plot.error}
          </p>
        )}
        {plot.result && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-semibold text-slate-900">
                  {plot.result.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Source: {plot.result.source} Â· {plot.result.points.length}{" "}
                  points Â· {plot.result.tracks.join(", ")}
                </p>
              </div>
              <button
                type="button"
                onClick={savePlotData}
                className={`${buttonClass} border border-slate-200 bg-white text-slate-700`}>
                <Download className="h-4 w-4" />
                Save Plot Data
              </button>
            </div>
            <div className="h-80 rounded-lg bg-white p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={plot.result.points}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="x" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend />
                  {plot.result.tracks.map((track, index) => (
                    <Line
                      key={track}
                      type="monotone"
                      dataKey={track}
                      stroke={plotColors[index % plotColors.length]}
                      dot={false}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </Panel>
      <Panel title="Offset" eyebrow="04 / Optional correction">
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            ["range", "Range", "Km"],
            ["azimuth", "Azimuth", "deg"],
            ["elevation", "Elevation", "deg"],
            ["time", "Time", "ms"],
          ].map(([key, label, unit]) => (
            <label key={key} className="text-xs text-slate-500">
              {label} ({unit})
              <input
                type="number"
                value={offset[key]}
                onChange={(e) =>
                  setOffset((current) => ({
                    ...current,
                    [key]: e.target.value,
                  }))
                }
                className={inputClass}
              />
            </label>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={offset.enabled}
              onChange={(e) =>
                setOffset((current) => ({
                  ...current,
                  enabled: e.target.checked,
                }))
              }
            />
            Apply Offset
          </label>
          <button
            type="button"
            onClick={resetOffset}
            className={`${buttonClass} border border-slate-200 bg-white text-slate-600`}>
            Reset Offset
          </button>
        </div>
      </Panel>
    </div>
  );
}

export default AnalysisTools;
