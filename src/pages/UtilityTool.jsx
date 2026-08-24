import { useState } from "react";
import {
  Calculator,
  FileStack,
  Info,
  Wrench,
  FolderCog,
  ScrollText,
} from "lucide-react";

const utilities = [
  { title: "File Information", icon: FileStack },
  { title: "Data Converter", icon: FolderCog },
  { title: "Calculator", icon: Calculator },
  { title: "Configuration Viewer", icon: Wrench },
  { title: "Log Viewer", icon: ScrollText },
  { title: "System Information", icon: Info },
];

function UtilityTool() {
  const [activeUtility, setActiveUtility] = useState("File Information");
  const [calculatorValue, setCalculatorValue] = useState("");

  const getPanelContent = () => {
    switch (activeUtility) {
      case "Calculator":
        return (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-right text-2xl font-semibold text-slate-800">
              {calculatorValue || "0"}
            </div>
            <div className="grid grid-cols-4 gap-2 text-sm">
              {[
                "7",
                "8",
                "9",
                "/",
                "4",
                "5",
                "6",
                "*",
                "1",
                "2",
                "3",
                "-",
                "0",
                ".",
                "=",
                "+",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setCalculatorValue((prev) => {
                      if (item === "=") {
                        try {
                          const result = Function(
                            `"use strict"; return (${prev || "0"})`,
                          )();
                          return Number.isFinite(result)
                            ? String(result)
                            : "Error";
                        } catch {
                          return "Error";
                        }
                      }
                      return prev ? `${prev}${item}` : item;
                    })
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-3 font-medium text-slate-700 hover:border-slate-300">
                  {item}
                </button>
              ))}
            </div>
          </div>
        );
      case "Data Converter":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Input</p>
              <input
                defaultValue="12.5"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
              />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Output</p>
              <div className="mt-2 text-lg font-semibold text-slate-800">
                12.5 units
              </div>
            </div>
          </div>
        );
      case "File Information":
        return (
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-medium text-slate-700">Current file</p>
              <p className="mt-1">sample_dataset.csv</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-medium text-slate-700">Size</p>
              <p className="mt-1">1.36 MB</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-medium text-slate-700">Type</p>
              <p className="mt-1">CSV</p>
            </div>
          </div>
        );
      case "Configuration Viewer":
        return (
          <pre className="overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700">{`appName: Engineering Analysis Suite\nmode: demo\nanalysisEnabled: true\nreportOutput: local\nplotEngine: recharts`}</pre>
        );
      case "Log Viewer":
        return (
          <div className="space-y-2 text-xs text-slate-600">
            <div className="rounded-xl bg-emerald-50 px-3 py-2 text-emerald-700">
              [INFO] Data loaded successfully
            </div>
            <div className="rounded-xl bg-sky-50 px-3 py-2 text-sky-700">
              [INFO] Analysis pipeline started
            </div>
            <div className="rounded-xl bg-amber-50 px-3 py-2 text-amber-700">
              [WARN] Low sample count detected
            </div>
          </div>
        );
      case "System Information":
        return (
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-medium text-slate-700">Platform</p>
              <p className="mt-1">Electron Desktop Application</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-medium text-slate-700">Memory</p>
              <p className="mt-1">4.2 GB available</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Module
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Utility Tool
            </h1>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <div className="grid gap-3">
            {utilities.map(({ title, icon: Icon }) => (
              <button
                key={title}
                type="button"
                onClick={() => setActiveUtility(title)}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                  activeUtility === title
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                }`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-current">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-medium">{title}</span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              {activeUtility}
            </h2>
            {getPanelContent()}
          </div>
        </div>
      </section>
    </div>
  );
}

export default UtilityTool;
