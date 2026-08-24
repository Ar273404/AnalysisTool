import { useEffect, useState } from "react";
import AppHeader from "../components/AppHeader";
import StatusBar from "../components/StatusBar";

function AppLayout({ children }) {
  const [darkTheme, setDarkTheme] = useState(
    () => localStorage.getItem("engineering-theme") === "dark",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", darkTheme);
    localStorage.setItem("engineering-theme", darkTheme ? "dark" : "light");
  }, [darkTheme]);

  return (
    <div className="app-shell flex h-screen flex-col bg-slate-100 text-slate-900">
      <AppHeader
        darkTheme={darkTheme}
        onToggleTheme={() => setDarkTheme((current) => !current)}
      />
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-[1600px]">{children}</div>
      </main>
      <StatusBar />
    </div>
  );
}

export default AppLayout;
