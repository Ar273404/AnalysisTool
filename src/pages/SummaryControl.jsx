import { Gauge, Play, Pause, Square, RotateCcw, RefreshCw } from "lucide-react";

const summaryCards = [
  { label: "Current File", value: "sample_dataset.csv", tone: "blue" },
  { label: "Processing Status", value: "Ready", tone: "green" },
  { label: "Records", value: "6,420", tone: "violet" },
  { label: "Analysis Status", value: "Completed", tone: "emerald" },
  { label: "Report Status", value: "Not Generated", tone: "amber" },
  { label: "Plot Status", value: "Not Generated", tone: "red" },
];

const tones = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  violet: "bg-violet-50 text-violet-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
};

function SummaryControl() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Gauge className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Module
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Summary Control
            </h1>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {summaryCards.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {item.label}
              </div>
              <div
                className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-sm font-medium ${tones[item.tone]}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-5 flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
              <Play className="h-4 w-4" />
              Start
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300">
              <Pause className="h-4 w-4" />
              Pause
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300">
              <Square className="h-4 w-4" />
              Stop
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300">
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 text-sm font-semibold text-slate-800">
              System Status: READY
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <span>Data</span>
                <span className="text-emerald-600">✓ Loaded</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <span>Analysis</span>
                <span className="text-emerald-600">✓ Completed</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <span>Report</span>
                <span className="text-amber-600">○ Not Generated</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <span>Plot</span>
                <span className="text-amber-600">○ Not Generated</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SummaryControl;
