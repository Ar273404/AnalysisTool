import { ArrowUpRight } from "lucide-react";

function ModuleCard({ icon: Icon, title, description, route, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(route)}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-panel focus:outline-none focus:ring-2 focus:ring-blue-500/40">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-6 w-6" />
        </div>
        <div className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors group-hover:border-blue-200 group-hover:text-blue-600">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      <div className="mb-3">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      </div>

      <p className="flex-1 text-sm leading-6 text-slate-600">{description}</p>

      <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600">
        Open module
        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </button>
  );
}

export default ModuleCard;
