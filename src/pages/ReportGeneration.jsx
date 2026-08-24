import { useState } from "react";
import { FileText, Eye, Download, Trash2 } from "lucide-react";

const initialForm = {
  name: "System Performance Summary",
  type: "Engineering Summary",
  date: "2026-08-23",
  author: "Engineering Team",
  description:
    "Overview of the current engineering dataset analysis and processing output.",
};

const sectionOptions = [
  "Executive Summary",
  "Input Data",
  "Analysis Results",
  "Statistics",
  "Plots",
  "Tables",
  "Conclusion",
];

function ReportGeneration() {
  const [form, setForm] = useState(initialForm);
  const [selectedSections, setSelectedSections] = useState(
    sectionOptions.slice(0, 4),
  );
  const [preview, setPreview] = useState(
    "Preview ready. Report sections can be generated from current dataset.",
  );

  const toggleSection = (section) => {
    setSelectedSections((prev) =>
      prev.includes(section)
        ? prev.filter((item) => item !== section)
        : [...prev, section],
    );
  };

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handlePreview = () => {
    setPreview(
      `Previewing report: ${form.name} | Type: ${form.type} | Author: ${form.author}`,
    );
  };

  const handleReset = () => {
    setForm(initialForm);
    setSelectedSections(sectionOptions.slice(0, 4));
    setPreview(
      "Preview ready. Report sections can be generated from current dataset.",
    );
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Module
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Report Generation
            </h1>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Report Configuration
            </h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Report Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Report Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400">
                  <option>Engineering Summary</option>
                  <option>Performance Review</option>
                  <option>Signal Analysis</option>
                  <option>Validation Report</option>
                </select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Author
                  </label>
                  <input
                    value={form.author}
                    onChange={(e) => handleChange("author", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div className="mt-5">
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                Report Sections
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {sectionOptions.map((section) => (
                  <label
                    key={section}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedSections.includes(section)}
                      onChange={() => toggleSection(section)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    {section}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Preview</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePreview}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  <Eye className="h-4 w-4" />
                  Preview Report
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300">
                  <Trash2 className="h-4 w-4" />
                  Clear
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300">
                  <Download className="h-4 w-4" />
                  Save
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-4 border-b border-slate-200 pb-4">
                <h3 className="text-2xl font-semibold text-slate-900">
                  {form.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {form.type} • {form.date} • {form.author}
                </p>
              </div>

              <div className="space-y-4 text-sm leading-6 text-slate-600">
                <p>{form.description}</p>
                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="font-medium text-slate-700">
                    Report sections:
                  </span>{" "}
                  {selectedSections.join(", ")}
                </div>
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-slate-500">
                  {preview}
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ReportGeneration;
