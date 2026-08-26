import { useEffect, useRef, useState } from "react";
import { Check, CircleStop, Play, Radio, ShieldCheck } from "lucide-react";

const logOptions = [
  "Track (RDP to OWS)",
  "Plot (MBP to RDP)",
  "Detection (SP to MBP)",
  "Dwell Played Status (RRM to DEBUG)",
  "Dwell Request (RDP to RRM)",
  "SP Sync Error (SP to DEBUG)",
  "STM_SP (STM To SP)",
];

const streamIds = [
  "track",
  "plot",
  "detection",
  "dwellPlayedStatus",
  "dwellRequest",
  "spSyncError",
  "stmSp",
];

function DataReader() {
  const [selectedLogs, setSelectedLogs] = useState(logOptions);
  const [isRunning, setIsRunning] = useState(false);
  const [streamStatus, setStreamStatus] = useState({});
  const [backendError, setBackendError] = useState("");
  const errorTimer = useRef(null);
  const allSelected = selectedLogs.length === logOptions.length;
  const apiUrl =
    window.electronAPI?.dataReaderApiUrl || "http://127.0.0.1:47831";

  const showTemporaryError = (message) => {
    if (errorTimer.current) clearTimeout(errorTimer.current);
    setBackendError(message);
    errorTimer.current = setTimeout(() => {
      setBackendError("");
      errorTimer.current = null;
    }, 4000);
  };

  useEffect(
    () => () => {
      if (errorTimer.current) clearTimeout(errorTimer.current);
    },
    [],
  );

  useEffect(() => {
    const socket = new WebSocket(`${apiUrl.replace("http", "ws")}/ws`);
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.stream) {
        setStreamStatus((current) => ({
          ...current,
          [message.stream]: message,
        }));
      } else if (message.streams) {
        setStreamStatus(message.streams);
        setIsRunning(message.running);
      }
    };
    socket.onerror = () =>
      showTemporaryError("Backend connection unavailable.");
    return () => socket.close();
  }, [apiUrl]);

  const toggleAll = () => {
    setSelectedLogs(allSelected ? [] : logOptions);
  };

  const toggleLog = (log) => {
    setSelectedLogs((current) =>
      current.includes(log)
        ? current.filter((selectedLog) => selectedLog !== log)
        : [...current, log],
    );
  };

  const startReader = async () => {
    setBackendError("");
    try {
      const response = await fetch(`${apiUrl}/api/data-reader/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          streams: streamIds.filter((_, index) =>
            selectedLogs.includes(logOptions[index]),
          ),
          format: "bin",
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to start reader.");
      setIsRunning(true);
    } catch (error) {
      showTemporaryError(error.message);
      setIsRunning(false);
    }
  };

  const stopReader = async () => {
    setBackendError("");
    try {
      const response = await fetch(`${apiUrl}/api/data-reader/stop`, {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to stop reader.");
      setIsRunning(false);
    } catch (error) {
      showTemporaryError(error.message);
    }
  };

  return (
    <div className="data-reader-page flex min-h-[calc(100vh-10rem)] items-center justify-center py-8">
      <section className="data-reader-card w-full max-w-[900px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <div className="relative overflow-hidden bg-slate-950 px-8 py-8 text-white sm:px-10">
          <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full border-[24px] border-cyan-400/10" />
          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                <Radio className="h-4 w-4" />
                Data Reader
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Choose your log streams
              </h1>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-300">
                Select the channels to monitor before starting the reader.
              </p>
            </div>
            <div className="flex items-center gap-3 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 sm:self-auto">
              <span
                className={`h-2 w-2 rounded-full ${isRunning ? "animate-pulse bg-emerald-400" : "bg-slate-500"}`}
              />
              {isRunning ? "Live capture" : "Standby"}
            </div>
          </div>
        </div>

        <div className="data-reader-content p-6 sm:p-10">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Log channels
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose one or more channels for this session.
              </p>
            </div>
            <label className="data-reader-select-all flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="peer sr-only"
              />
              <span className="flex h-5 w-5 items-center justify-center rounded border border-slate-300 text-white transition-colors peer-checked:border-cyan-600 peer-checked:bg-cyan-600">
                {allSelected && <Check className="h-3.5 w-3.5" />}
              </span>
              Select all channels
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {logOptions.map((log, index) => {
              const isSelected = selectedLogs.includes(log);
              return (
                <label
                  key={log}
                  className={`data-reader-channel group flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? "data-reader-channel-selected border-cyan-200 bg-cyan-50/70 shadow-sm"
                      : "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-white"
                  }`}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleLog(log)}
                    className="peer sr-only"
                  />
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${isSelected ? "border-cyan-600 bg-cyan-600 text-white" : "border-slate-300 bg-white text-transparent"}`}>
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex min-w-0 flex-1 items-center gap-3">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${isSelected ? "bg-cyan-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-sm font-medium leading-5 ${isSelected ? "text-slate-900" : "text-slate-600"}`}>
                      {log}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              {selectedLogs.length} of {logOptions.length} channels ready
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={stopReader}
                className="data-reader-stop inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 sm:flex-none">
                <CircleStop className="h-4 w-4" />
                Stop
              </button>
              <button
                type="button"
                onClick={startReader}
                disabled={selectedLogs.length === 0}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-600/20 transition-colors hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:flex-none">
                <Play className="h-4 w-4 fill-current" />
                Start reader
              </button>
            </div>
          </div>
          {backendError && (
            <p
              className="data-reader-error mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              role="alert">
              {backendError}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default DataReader;
