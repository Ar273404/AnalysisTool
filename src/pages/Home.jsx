import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowRight, Radar } from "lucide-react";
import bharatElectronicsLogo from "/public/bharat-electronics-logo-png_seeklogo-304466.png";
import drdoLogo from "/public/drdo-official-seeklogo.png";
import radarWorkflowImage from "../images/FACT-CHECK-21.webp";
import FighterImage from "../images/Screenshot 2024-07-18 165414.png";
import Pic from "../images/WhatsApp Image 2026-08-25 at 2.46.59 PM.jpeg"

function Home() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    const clock = window.setInterval(() => setCurrentDate(new Date()), 1000);
    return () => window.clearInterval(clock);
  }, []);

  const dateText = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(currentDate);
  const timeText = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(currentDate);

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

          <div className="flex min-w-[220px] items-center gap-3 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-slate-50 px-4 py-3 shadow-sm">
            {/* <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-200">
              {currentDate.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                hour12: false,
              })}
            </div> */}
            <div className="min-w-0">
              <p className="text-[15px] font-bold uppercase tracking-[0.2em] text-blue-800">
                Local Time
              </p>
              <p className="mt-0.5 whitespace-nowrap text-md font-semibold text-red-900">
                {timeText}
              </p>
              <p className="whitespace-nowrap text-[13px] text-red-900">
                {dateText}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid items-center gap-3 md:grid-cols-2">
          <div className="flex h-56 items-center justify-center overflow-hidden md:h-64">
            <img
              src={bharatElectronicsLogo}
              alt="Bharat Electronics logo"
              className="h-full w-full scale-[2.1] rounded-xl object-contain"
            />
          </div>
          <div className="flex h-48 items-center justify-center md:h-56">
            <img
              src={drdoLogo}
              alt="DRDO logo"
              className="h-full w-full rounded-xl object-contain"
            />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-panel">
        <div className="grid items-stretch lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[360px] overflow-hidden bg-slate-900 p-5 sm:min-h-[460px]">
            <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-slate-950/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200 backdrop-blur">
              <Radar className="h-4 w-4" />
              Ashwini Radar
            </div>
            <div className="flex h-full min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/70">
              <img
                src={radarWorkflowImage}
                alt="Radar track analysis workflow showing GPS, radar track selection and plotting controls"
                className="h-[82%] w-[82%] rotate-0 object-contain shadow-2xl"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center bg-slate-950 p-7 text-white sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
              Indigenous 4D AESA radar
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
              Ashwini Radar
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              The Ashwini is a Low-Level Transportable Radar (LLTR) developed by
              LRDE, a DRDO laboratory, and manufactured by BEL. Designed as a
              mobile airspace-surveillance gap-filler, it detects and tracks
              low-altitude threats that may be hidden from conventional radar
              coverage.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                [
                  "4D surveillance",
                  "Measures range, azimuth, height and velocity vector",
                ],
                [
                  "Operational coverage",
                  "Up to 200 km instrumented range and 30 m to 15 km altitude",
                ],
                [
                  "Flexible deployment",
                  "Truck-mounted system for rapid relocation in difficult terrain",
                ],
                [
                  "Mission protection",
                  "ECCM and IFF support for reliable operation in contested environments",
                ],
              ].map(([title, description]) => (
                <div key={title} className="border-l-2 border-cyan-400/70 pl-3">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    {description}
                  </p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => navigate("/analysis")}
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">
              Explore Radar Analysis
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
