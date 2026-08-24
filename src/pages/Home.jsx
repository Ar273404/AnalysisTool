import { useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  FolderOpen,
  FileText,
  Gauge,
  Wrench,
  ArrowRight,
} from "lucide-react";
import ModuleCard from "../components/ModuleCard";
import bharatElectronicsLogo from "/public/bharat-electronics-logo-png_seeklogo-304466.png";
import drdoLogo from "/public/drdo-official-seeklogo.png";

const modules = [
  {
    title: "Analysis Tools",
    description: "Perform analysis and processing operations.",
    route: "/analysis",
    icon: Activity,
  },
  {
    title: "Data Reader",
    description: "Read, inspect and analyze input data files.",
    route: "/data-reader",
    icon: FolderOpen,
  },
  {
    title: "Report Generation",
    description: "Generate structured engineering reports.",
    route: "/report-generation",
    icon: FileText,
  },
  {
    title: "Utility Tool",
    description: "Access supporting utilities and configuration tools.",
    route: "/utility",
    icon: Wrench,
  },
  {
    title: "Summary Control",
    description: "View and control application summary information.",
    route: "/summary",
    icon: Gauge,
  },
  {
    title: "Plot Generation",
    description: "Generate and visualize engineering plots.",
    route: "/plot-generation",
    icon: BarChart3,
  },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-panel">
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-200">
              <Activity className="h-8 w-8" />
            </div>
            <div>
              {/* <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
                Engineering Platform
              </p> */}
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                Analysis Tool
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            <span className="status-dot bg-emerald-500" />
            All systems operational
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <img
              src={bharatElectronicsLogo}
              alt="Bharat Electronics logo"
              className="h-64 w-full rounded-xl object-contain"
            />
          </div>
          <div>
            <img
              src={drdoLogo}
              alt="DRDO logo"
              className="h-64 w-full rounded-xl object-contain"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-card">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Workspaces
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Module Dashboard
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
            6 modules available
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        <div className="card-grid">
          {modules.map((module) => (
            <ModuleCard
              key={module.title}
              icon={module.icon}
              title={module.title}
              description={module.description}
              route={module.route}
              onClick={(route) => navigate(route)}
            />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Analysis Suite
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">
              Data processing overview
            </h3>
          </div>
          <button
            type="button"
            onClick={() => navigate("/analysis")}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
            Open Analysis Tools
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Status
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">Ready</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Files
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">12</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Reports
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">04</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
