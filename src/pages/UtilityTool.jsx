import { useState } from "react";
import {
  Activity,
  Check,
  CircleStop,
  Play,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

const utilityGroups = [
  {
    label: "Dwell",
    items: [
      "Dwell Request Dwell",
      "Dwell Played Dwell",
      "Dwell Confirmation Dwell",
      "Repeated Track Dwell",
    ],
  },
  {
    label: "Track",
    items: [
      "Track Init Request Dwell",
      "Requisition Dwell",
      "Track Confirmation Dwell",
      "Detected QIA Dwell",
    ],
  },
  {
    label: "Calibration",
    items: [
      "Calibration Dwell",
      "Global Noise Calib Dwell",
      "New Born Track Dwell",
    ],
  },
  {
    label: "Data",
    items: [
      "DIA SAD Dwell",
      "High Priority Track Req Dwell",
      "Strobe Confirm Dwell",
      "AGCH Health Dwell",
    ],
  },
];

const tableHeaders = [
  "Grid ID",
  "Azm",
  "S. Sght",
  "DP Status",
  "To",
  "PRI (us)",
  "T Range",
  "Pulses/4",
  "Op Freq",
  "MTI En",
];
const tableRows = [
  [
    "337",
    "173.800",
    "159.351532",
    "0",
    "23.05",
    "1213.0 · 0.0 · 0.0 · 0.0",
    "0",
    "19-0-0-0",
    "19",
    "0",
  ],
  [
    "323",
    "149.600",
    "151.859756",
    "0",
    "7.85",
    "284.4 · 0.0 · 0.0 · 0.0",
    "0",
    "84-0-0-0",
    "19",
    "0",
  ],
  [
    "322",
    "148.800",
    "147.507995",
    "0",
    "5.90",
    "284.4 · 0.0 · 0.0 · 0.0",
    "0",
    "19-0-0-0",
    "19",
    "0",
  ],
  [
    "286",
    "151.500",
    "141.607791",
    "0",
    "24.92",
    "1380.0 · 0.0 · 0.0 · 0.0",
    "0",
    "19-0-0-0",
    "19",
    "0",
  ],
  [
    "287",
    "123.200",
    "135.783661",
    "0",
    "16.89",
    "1099.0 · 0.0 · 0.0 · 0.0",
    "0",
    "74-0-0-0",
    "19",
    "0",
  ],
  [
    "288",
    "128.300",
    "131.895969",
    "0",
    "7.85",
    "118.0 · 0.0 · 0.0 · 0.0",
    "0",
    "64-0-0-0",
    "32",
    "0",
  ],
  [
    "293",
    "117.267",
    "127.050549",
    "0",
    "41.09",
    "1290.0 · 0.0 · 0.0 · 0.0",
    "137771",
    "32-0-0-0",
    "49",
    "0",
  ],
  [
    "279",
    "136.600",
    "124.139974",
    "0",
    "23.05",
    "1213.0 · 0.0 · 0.0 · 0.0",
    "0",
    "19-0-0-0",
    "19",
    "0",
  ],
  [
    "276",
    "122.200",
    "128.798467",
    "0",
    "24.92",
    "1290.2 · 0.0 · 0.0 · 0.0",
    "0",
    "19-0-0-0",
    "19",
    "0",
  ],
  [
    "263",
    "131.000",
    "107.479339",
    "0",
    "23.05",
    "1213.0 · 0.0 · 0.0 · 0.0",
    "0",
    "19-0-0-0",
    "19",
    "0",
  ],
  [
    "254",
    "91.400",
    "100.790325",
    "0",
    "24.00",
    "598.8 · 0.0 · 0.0 · 0.0",
    "0",
    "4-0-0-0",
    "32",
    "0",
  ],
  [
    "254",
    "92.400",
    "97.905061",
    "0",
    "4.76",
    "250.4 · 0.0 · 0.0 · 0.0",
    "0",
    "19-0-0-0",
    "19",
    "0",
  ],
  [
    "254",
    "92.000",
    "95.593447",
    "0",
    "7.85",
    "598.8 · 0.0 · 0.0 · 0.0",
    "0",
    "64-0-0-0",
    "32",
    "0",
  ],
  [
    "239",
    "95.200",
    "91.550715",
    "0",
    "24.32",
    "1201.2 · 0.0 · 0.0 · 0.0",
    "0",
    "19-0-0-0",
    "19",
    "0",
  ],
  [
    "238",
    "95.500",
    "89.399983",
    "0",
    "23.05",
    "1213.0 · 0.0 · 0.0 · 0.0",
    "0",
    "4-0-0-0",
    "19",
    "0",
  ],
];

function UtilityTool() {
  const allItems = utilityGroups.flatMap((group) => group.items);
  const [selectedItems, setSelectedItems] = useState(allItems);
  const [isRunning, setIsRunning] = useState(false);
  const allSelected = selectedItems.length === allItems.length;

  const toggleItem = (item) => {
    setSelectedItems((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item],
    );
  };

  return (
    <div className="utility-page min-h-[calc(100vh-10rem)] space-y-5 py-4">
      <section className="utility-console overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 text-white sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300">
                Utility Tool
              </p>
              <h1 className="text-xl font-semibold">Signal monitor</h1>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span
              className={`h-2 w-2 rounded-full ${isRunning ? "animate-pulse bg-emerald-400" : "bg-slate-500"}`}
            />
            {isRunning ? "Monitoring active" : "Ready to monitor"}
          </div>
        </div>
        <div className="grid gap-6 px-5 py-5 sm:px-6 lg:grid-cols-[1fr_116px]">
          <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {utilityGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400">
                  {group.label}
                </p>
                <div className="space-y-2.5">
                  {group.items.map((item) => {
                    const checked = selectedItems.includes(item);
                    return (
                      <label
                        key={item}
                        className="flex cursor-pointer items-start gap-2 text-xs leading-4 text-slate-200 transition-colors hover:text-white">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleItem(item)}
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-cyan-400"
                        />
                        <span>{item}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-row gap-2 lg:flex-col">
            <button
              type="button"
              onClick={() => setSelectedItems(allSelected ? [] : allItems)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/10 lg:flex-none">
              <RotateCcw className="h-3.5 w-3.5" />
              Clear all
            </button>
            <button
              type="button"
              onClick={() => setIsRunning(true)}
              disabled={!selectedItems.length}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-bold text-slate-950 transition-colors hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 lg:flex-none">
              <Play className="h-3.5 w-3.5 fill-current" />
              Start
            </button>
            <button
              type="button"
              onClick={() => setIsRunning(false)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-200 transition-colors hover:bg-rose-400/20 lg:flex-none">
              <CircleStop className="h-3.5 w-3.5" />
              Stop
            </button>
          </div>
        </div>
      </section>

      <section className="utility-monitor overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
              <Activity className="h-4 w-4" /> Live output
            </div>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              PRI Agility monitoring
            </h2>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            {selectedItems.length} signals selected
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[1050px] w-full border-collapse text-left font-mono text-[11px]">
            <thead className="bg-slate-100 text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header}
                    className="whitespace-nowrap border-b border-slate-200 px-3 py-3 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, index) => (
                <tr
                  key={`${row[0]}-${index}`}
                  className="border-b border-slate-100 text-slate-600 transition-colors hover:bg-cyan-50/50">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${cell}-${cellIndex}`}
                      className="whitespace-nowrap px-3 py-2.5">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-2 border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
          <Check className="h-3.5 w-3.5 text-emerald-500" />
          System ready. Monitoring output will appear here.
        </div>
      </section>
    </div>
  );
}

export default UtilityTool;
