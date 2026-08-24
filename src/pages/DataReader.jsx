import { useState } from "react";
import {
  FileText,
  Upload,
  Trash2,
  RefreshCw,
  Search,
  Database,
} from "lucide-react";

const demoRows = [
  ["1", "2026-08-21", "Sensor-01", "78.4", "Stable"],
  ["2", "2026-08-21", "Sensor-02", "81.9", "Stable"],
  ["3", "2026-08-21", "Sensor-03", "72.3", "Warning"],
  ["4", "2026-08-21", "Sensor-04", "90.1", "Elevated"],
  ["5", "2026-08-21", "Sensor-05", "76.8", "Stable"],
  ["6", "2026-08-21", "Sensor-06", "68.4", "Warning"],
];

function DataReader() {
  const [status, setStatus] = useState("Ready");
  const [selectedFile, setSelectedFile] = useState("");
  const [filePath, setFilePath] = useState("No file selected");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState(demoRows);

  const handleOpenFile = async () => {
    if (!window.electronAPI?.openFileDialog) {
      const simulatedPath = "C:/workspace/demo-data/sample.csv";
      setSelectedFile("sample.csv");
      setFilePath(simulatedPath);
      setStatus("Loaded successfully");
      return;
    }

    setStatus("Loading...");
    const file = await window.electronAPI.openFileDialog();

    if (file.canceled || !file.path) {
      setStatus("Ready");
      return;
    }

    setSelectedFile(file.path.split(/[\\/]/).pop());
    setFilePath(file.path);
    setStatus("Loaded successfully");
  };

  const filteredRows = rows.filter((row) =>
    row.some((value) =>
      value.toString().toLowerCase().includes(search.toLowerCase()),
    ),
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Module
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Data Reader
            </h1>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleOpenFile}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
                <Upload className="h-4 w-4" />
                Select File
              </button>
              <button
                type="button"
                onClick={handleOpenFile}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300">
                <FileText className="h-4 w-4" />
                Open File
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile("");
                  setFilePath("No file selected");
                  setStatus("Ready");
                  setRows(demoRows);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300">
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
              <button
                type="button"
                onClick={() => setStatus("Ready")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  File Name
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-800">
                  {selectedFile || "No file loaded"}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  File Path
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-800">
                  {filePath}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Status
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-800">
                  {status}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  File Size
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-800">
                  {selectedFile ? "1.36 MB" : "—"}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  File Type
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-800">
                  {selectedFile ? "CSV" : "—"}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Records
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-800">
                  {filteredRows.length}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Database className="h-4 w-4" />
              File Information
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Supported formats: .txt, .csv, .json, .log</li>
              <li>• Demo mode active when no file loaded</li>
              <li>• Extensible file-reader service ready</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900">Data Preview</h2>
          <div className="relative w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter rows"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-blue-400"
            />
          </div>
        </div>

        <div className="overflow-auto rounded-2xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Row</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Device</th>
                <th className="px-4 py-3 font-semibold">Value</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <tr
                  key={`${row[2]}-${index}`}
                  className="border-t border-slate-200 odd:bg-white even:bg-slate-50/60">
                  {row.map((cell, idx) => (
                    <td
                      key={`${cell}-${idx}`}
                      className="px-4 py-3 text-slate-600">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default DataReader;
