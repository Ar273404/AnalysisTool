import { NavLink } from "react-router-dom";
import {
  Activity,
  Home,
  Settings,
  Gauge,
  FolderOpen,
  FileText,
  Wrench,
  BarChart3,
  PanelRight,
  Moon,
  Sun,
} from "lucide-react";

const navItems = [
  { label: "Home", to: "/", icon: Home },
  { label: "Analysis Tools", to: "/analysis", icon: Activity },
  { label: "Data Reader", to: "/data-reader", icon: FolderOpen },
  { label: "Report Gen", to: "/report-generation", icon: FileText },
  { label: "Utility Tool", to: "/utility", icon: Wrench },
  { label: "Summary Control", to: "/summary", icon: Gauge },
  { label: "Plot Gen", to: "/plot-generation", icon: BarChart3 },
];

function AppHeader({ darkTheme, onToggleTheme }) {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md">
            <PanelRight className="h-4 w-4" />
          </div>
          <div>
            <div className="text-base font-semibold tracking-tight text-slate-900">
              Engineering Analysis Suite
            </div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
              Desktop Workspace
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
                }`
              }>
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={onToggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
          aria-label={
            darkTheme ? "Switch to light theme" : "Switch to dark theme"
          }
          title={darkTheme ? "Switch to light theme" : "Switch to dark theme"}>
          {darkTheme ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </div>
    </header>
  );
}

export default AppHeader;
