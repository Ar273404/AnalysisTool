import { useMemo, useState } from "react";
import { BarChart3, Download, RotateCcw, Sparkles } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
} from "recharts";

const plotData = [
  { name: "Jan", value: 32, value2: 28 },
  { name: "Feb", value: 40, value2: 30 },
  { name: "Mar", value: 55, value2: 48 },
  { name: "Apr", value: 48, value2: 44 },
  { name: "May", value: 68, value2: 52 },
  { name: "Jun", value: 72, value2: 60 },
];

function PlotGeneration() {
  const [plotType, setPlotType] = useState("Line");
  const [xAxis, setXAxis] = useState("Month");
  const [yAxis, setYAxis] = useState("Value");
  const [title, setTitle] = useState("Engineering Trend");
  const [xLabel, setXLabel] = useState("Time");
  const [yLabel, setYLabel] = useState("Performance");

  const renderChart = useMemo(() => {
    switch (plotType) {
      case "Bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={plotData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "Scatter":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="category" dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Scatter data={plotData} fill="#10b981" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      case "Area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={plotData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value2"
                stroke="#8b5cf6"
                fill="#c4b5fd"
                fillOpacity={0.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={plotData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  }, [plotType]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Module
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Plot Generation
            </h1>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Data Source
              </label>
              <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400">
                <option>Sample Dataset</option>
                <option>Analysis Results</option>
                <option>Performance Log</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                X Axis
              </label>
              <input
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Y Axis
              </label>
              <input
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Plot Type
              </label>
              <select
                value={plotType}
                onChange={(e) => setPlotType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400">
                <option>Line</option>
                <option>Bar</option>
                <option>Scatter</option>
                <option>Area</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                X-axis label
              </label>
              <input
                value={xLabel}
                onChange={(e) => setXLabel(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Y-axis label
              </label>
              <input
                value={yLabel}
                onChange={(e) => setYLabel(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
                <Sparkles className="h-4 w-4" />
                Generate Plot
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300">
                <RotateCcw className="h-4 w-4" />
                Clear Plot
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300">
                <Download className="h-4 w-4" />
                Export Plot
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {title}
                </h2>
                <p className="text-sm text-slate-500">
                  {xLabel} vs {yLabel}
                </p>
              </div>
              <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-slate-500">
                {plotType} Plot
              </div>
            </div>
            <div className="h-[480px] w-full rounded-2xl border border-slate-200 bg-white p-4">
              {renderChart}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PlotGeneration;
