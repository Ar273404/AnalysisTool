function StatusBar() {
  return (
    <div className="flex h-10 items-center justify-between border-t border-slate-200 bg-slate-100 px-5 text-xs text-slate-600">
      <div className="flex items-center gap-2">
        <span className="status-dot bg-emerald-500" />
        <span>System Status: READY</span>
      </div>
      <div className="flex items-center gap-4">
        <span>Processing: Idle</span>
        <span>Data Source: Demo</span>
      </div>
    </div>
  );
}

export default StatusBar;
