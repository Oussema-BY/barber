"use client";

import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Scissors,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Check,
  Package,
  Clock,
  ChevronLeft,
  ChevronRight,
  Box,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";


/* ═══════════════════════════════════════════════════════
   1. DASHBOARD OVERVIEW SIMULATION
═══════════════════════════════════════════════════════ */
function DashboardSim({ isDark }: { isDark: boolean }) {
  const kpis = [
    { label: "Bookings", value: "24", trend: "+12%", color: "text-blue-500", bg: isDark ? "bg-blue-500/10" : "bg-blue-50" },
    { label: "Net Revenue", value: "1,420 DT", trend: "+8.4%", color: "text-emerald-500", bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50" },
  ];
  
  const staff = [
    { name: "Ahmed", status: "Active", efficiency: 94, img: "A" },
    { name: "Sami", status: "Break", efficiency: 88, img: "S" },
  ];

  const recentActivity = [
    { type: "New Booking", time: "2 min ago", detail: "Karim M. (Haircut)" },
    { type: "Payment", time: "15 min ago", detail: "+45 DT received" },
  ];

  return (
    <div className="space-y-3 p-0.5">
      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-2">
        {kpis.map((k, i) => (
          <div key={i} className={cn("p-2.5 rounded-2xl border transition-all duration-300 hover:scale-[1.02]", isDark ? "bg-white/3 border-white/8 shadow-black/40" : "bg-white border-slate-100 shadow-sm")}>
            <div className="flex justify-between items-start mb-1.5">
              <span className={cn("text-[7px] font-black uppercase tracking-wider text-slate-500")}>{k.label}</span>
              <span className="text-[6px] font-bold text-emerald-500">{k.trend}</span>
            </div>
            <p className={cn("text-sm font-black", isDark ? "text-white" : "text-slate-900")}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {/* Main Center Panel: Live Activity */}
        <div className={cn("p-3 rounded-2xl border", isDark ? "bg-white/3 border-white/8" : "bg-white border-slate-100 shadow-sm")}>
           <div className="flex items-center justify-between mb-3">
              <p className={cn("text-[9px] font-black uppercase tracking-widest", isDark ? "text-slate-400" : "text-slate-500")}>Live Protocol</p>
              <div className="flex gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={cn("w-1 h-3 rounded-full", i === 3 ? "bg-[#5E84F2] animate-pulse" : "bg-slate-200/50")} />
                ))}
              </div>
           </div>
           <div className="space-y-2.5">
             {recentActivity.map((act, i) => (
               <div key={i} className="flex gap-3 relative">
                 {i === 0 && <div className="absolute left-1.5 top-4 bottom-0 w-px bg-slate-200/30" />}
                 <div className={cn("w-3 h-3 rounded-full flex items-center justify-center shrink-0 z-10", i === 0 ? "bg-[#5E84F2]/20" : "bg-slate-100")}>
                    <div className={cn("w-1 h-1 rounded-full", i === 0 ? "bg-[#5E84F2]" : "bg-slate-400")} />
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className={cn("text-[8px] font-black", isDark ? "text-white" : "text-slate-800")}>{act.type}</p>
                      <span className="text-[6px] font-bold text-slate-500">{act.time}</span>
                    </div>
                    <p className={cn("text-[7px] font-medium leading-none mt-0.5", isDark ? "text-slate-400" : "text-slate-500")}>{act.detail}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Staff & Daily Goal Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className={cn("p-2.5 rounded-2xl border", isDark ? "bg-white/3 border-white/8" : "bg-white border-slate-100 shadow-sm")}>
            <p className={cn("text-[7px] font-black uppercase tracking-wider text-slate-500 mb-2")}>Team Status</p>
            <div className="space-y-2">
              {staff.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={cn("w-5 h-5 rounded-lg flex items-center justify-center text-[8px] font-black", i === 0 ? "bg-[#5E84F2]/20 text-[#5E84F2]" : "bg-slate-100 text-slate-500")}>{s.img}</div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-[7px] font-black leading-none", isDark ? "text-white" : "text-slate-800")}>{s.name}</p>
                    <div className="h-0.5 w-full bg-slate-100 rounded-full mt-1 overflow-hidden">
                       <div className="h-full bg-[#5E84F2] rounded-full" style={{ width: `${s.efficiency}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={cn("p-2.5 rounded-2xl border flex flex-col items-center justify-center text-center", isDark ? "bg-white/3 border-white/8" : "bg-white border-slate-100 shadow-sm")}>
             <div className="relative w-10 h-10 flex items-center justify-center mb-1">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="3" className={isDark ? "text-white/5" : "text-slate-50"} />
                  <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="113" strokeDashoffset="30" className="text-[#5E84F2]" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-[#5E84F2]" />
                </div>
             </div>
             <p className={cn("text-[6px] font-black uppercase text-slate-500")}>Daily Goal</p>
             <p className={cn("text-[8px] font-black", isDark ? "text-white" : "text-slate-900")}>74% Reached</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   2. APPOINTMENTS / CALENDAR SIMULATION (Smart Scheduling)
═══════════════════════════════════════════════════════ */
function AppointmentsSim({ isDark }: { isDark: boolean }) {
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [booked, setBooked] = useState<number[]>([]);
  const [animDay, setAnimDay] = useState<number | null>(null);

  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDow = (new Date(today.getFullYear(), today.getMonth(), 1).getDay() + 6) % 7;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDow }, (_, i) => i);

  const events: Record<number, string[]> = {
    [today.getDate()]: ["09:00 Karim M.", "11:30 Amine B."],
    [today.getDate() + 1]: ["10:00 Youssef T."],
    [today.getDate() + 3]: ["14:00 Samir K.", "15:30 Omar L."],
  };

  const handleDayClick = (d: number) => {
    setSelectedDay(d);
    setAnimDay(d);
    setTimeout(() => setAnimDay(null), 400);
  };

  const times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  const handleBook = (i: number) => {
    setBooked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  };

  return (
    <div className="space-y-2.5 p-1">
      <div className={cn("rounded-xl border p-2.5", isDark ? "bg-white/3 border-white/6" : "bg-white border-slate-100 shadow-sm")}>
        <div className="flex items-center justify-between mb-2">
          <ChevronLeft className={cn("w-3 h-3 italic", isDark ? "text-slate-500" : "text-slate-400")} />
          <span className={cn("text-[9px] font-black uppercase tracking-widest", isDark ? "text-white" : "text-slate-700")}>
            {today.toLocaleString("default", { month: "long" })} {today.getFullYear()}
          </span>
          <ChevronRight className={cn("w-3 h-3", isDark ? "text-slate-500" : "text-slate-400")} />
        </div>
        <div className="grid grid-cols-7 gap-px">
          {["M","T","W","T","F","S","S"].map((d, i) => (
            <div key={i} className={cn("text-center text-[7px] font-bold pb-1", isDark ? "text-slate-500" : "text-slate-400")}>{d}</div>
          ))}
          {padding.map((_, i) => <div key={`p${i}`} />)}
          {days.map((d) => {
            const isSelected = d === selectedDay;
            const isToday = d === today.getDate();
            const hasEvent = !!events[d];
            return (
              <button
                key={d}
                onClick={() => handleDayClick(d)}
                className={cn(
                  "relative text-[8px] font-bold py-1 rounded-md transition-all duration-200",
                  animDay === d && "scale-110",
                  isSelected ? "bg-[#5E84F2] text-white" : isToday ? (isDark ? "bg-[#5E84F2]/20 text-[#5E84F2]" : "bg-[#5E84F2]/10 text-[#5E84F2]") : isDark ? "text-slate-300 hover:bg-white/5" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                {d}
                {hasEvent && (
                  <span className={cn("absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full", isSelected ? "bg-white" : "bg-[#5E84F2]")} />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className={cn("rounded-xl border p-2.5", isDark ? "bg-white/3 border-white/6" : "bg-white border-slate-100 shadow-sm")}>
        <p className={cn("text-[9px] font-black uppercase tracking-widest mb-2", isDark ? "text-slate-400" : "text-slate-500")}>
          {events[selectedDay] ? "Booked" : "Available Slots"}
        </p>
        {events[selectedDay] ? (
          <div className="space-y-1">
            {events[selectedDay].map((e, i) => (
              <div key={i} className={cn("flex items-center gap-1.5 px-2 py-1 rounded-lg", isDark ? "bg-[#5E84F2]/10" : "bg-[#5E84F2]/5")}>
                <Clock className="w-2.5 h-2.5 text-[#5E84F2]" />
                <span className={cn("text-[8px] font-semibold", isDark ? "text-slate-200" : "text-slate-700")}>{e}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {times.map((t, i) => (
              <button
                key={i}
                onClick={() => handleBook(i)}
                className={cn(
                  "px-2 py-1 rounded-md text-[8px] font-bold transition-all duration-200",
                  booked.includes(i) ? "bg-[#5E84F2] text-white scale-95" : isDark ? "bg-white/5 text-slate-300 hover:bg-white/10" : "bg-slate-100 text-slate-600 hover:bg-[#5E84F2]/10"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   3. SERVICES CATALOG SIMULATION
═══════════════════════════════════════════════════════ */
function ServicesSim({ isDark }: { isDark: boolean }) {
  const [selected, setSelected] = useState<number[]>([]);
  const services = [
    { name: "Haircut", category: "hair", price: "15 DT", color: "text-blue-500", bg: isDark ? "bg-blue-500/10" : "bg-blue-50" },
    { name: "Royal Shave", category: "beard", price: "12 DT", color: "text-emerald-500", bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50" },
    { name: "Beard Trim", category: "beard", price: "8 DT", color: "text-amber-500", bg: isDark ? "bg-amber-500/10" : "bg-amber-50" },
  ];
  return (
    <div className="space-y-2.5 p-1">
      <div className="grid grid-cols-1 gap-1.5">
        {services.map((s, i) => (
          <button
            key={i}
            onClick={() => setSelected((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]))}
            className={cn(
              "p-2.5 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between",
              selected.includes(i) ? "border-[#5E84F2] bg-[#5E84F2]/5" : isDark ? "border-white/5 bg-white/2" : "border-slate-100 bg-white"
            )}
          >
            <div className="flex items-center gap-2">
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", s.bg)}>
                <Scissors className={cn("w-3.5 h-3.5", s.color)} />
              </div>
              <div>
                <p className={cn("text-[9px] font-black leading-tight", isDark ? "text-white" : "text-slate-800")}>{s.name}</p>
                <p className={cn("text-[7px] uppercase tracking-wider", isDark ? "text-slate-500" : "text-slate-400")}>{s.category}</p>
              </div>
            </div>
            <p className="text-[10px] font-black text-[#5E84F2]">{s.price}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   4. INVENTORY CONTROL SIMULATION
═══════════════════════════════════════════════════════ */
function InventorySim({ isDark }: { isDark: boolean }) {
  const items = [
    { name: "Matte Clay", stock: 12, min: 10, pct: 85, color: "bg-blue-500" },
    { name: "Aftershave", stock: 5, min: 1, pct: 20, color: "bg-red-500" },
    { name: "Sea Salt Spray", stock: 15, min: 8, pct: 55, color: "bg-emerald-500" },
  ];
  return (
    <div className="space-y-3 p-1">
      {items.map((item, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex justify-between items-end">
            <p className={cn("text-[9px] font-black", isDark ? "text-white" : "text-slate-800")}>{item.name}</p>
            <span className={cn("text-[8px] font-bold", isDark ? "text-slate-500" : "text-slate-400")}>{item.min} / {item.stock}</span>
          </div>
          <div className={cn("h-1.5 w-full rounded-full overflow-hidden", isDark ? "bg-white/5" : "bg-slate-100")}>
            <div className={cn("h-full rounded-full transition-all duration-1000", item.color)} style={{ width: `${item.pct}%` }} />
          </div>
        </div>
      ))}
      <div className={cn("mt-4 p-2 rounded-lg border border-dashed flex items-center gap-2", isDark ? "border-white/10 bg-white/2" : "border-slate-200 bg-slate-50")}>
        <AlertCircle className="w-3 h-3 text-red-500" />
        <p className={cn("text-[7px] font-bold italic", isDark ? "text-slate-400" : "text-slate-500")}>2 items below minimum stock level. Reorder suggested.</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   5. FINANCIAL INSIGHTS SIMULATION
═══════════════════════════════════════════════════════ */
function FinanceSim({ isDark }: { isDark: boolean }) {
  const revenue = [40, 65, 50, 85, 70, 95, 80];
  const max = Math.max(...revenue);
  return (
    <div className="space-y-3 p-1">
      <div className="grid grid-cols-2 gap-2">
        <div className={cn("p-2 rounded-xl border", isDark ? "bg-white/3 border-white/6" : "bg-white border-slate-100")}>
          <p className={cn("text-[7px] font-black uppercase text-slate-500 mb-1")}>Revenue</p>
          <p className={cn("text-xs font-black", isDark ? "text-white" : "text-slate-800")}>1,240 DT</p>
          <span className="text-[6px] font-bold text-emerald-500">+12% vs last week</span>
        </div>
        <div className={cn("p-2 rounded-xl border", isDark ? "bg-white/3 border-white/6" : "bg-white border-slate-100")}>
          <p className={cn("text-[7px] font-black uppercase text-slate-500 mb-1")}>Expenses</p>
          <p className={cn("text-xs font-black", isDark ? "text-white" : "text-slate-800")}>310 DT</p>
          <span className="text-[6px] font-bold text-red-400">-5% vs last week</span>
        </div>
      </div>
      <div className={cn("p-2.5 rounded-xl border h-20 flex items-end gap-1.5", isDark ? "bg-white/3 border-white/6" : "bg-white border-slate-100")}>
        {revenue.map((r, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm transition-all duration-1000 bg-[#5E84F2]"
            style={{ height: `${(r / max) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT — Tab container controlled by parent
═══════════════════════════════════════════════════════ */
const SIMS = [
  DashboardSim,
  AppointmentsSim,
  ServicesSim,
  InventorySim,
  FinanceSim,
];

interface FeatureSimulationsProps {
  activeIdx: number;
  isPaused?: boolean;
}

export function FeatureSimulations({ activeIdx, isPaused }: FeatureSimulationsProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const Sim = SIMS[activeIdx] || SIMS[0];

  return (
    <div
      className={cn(
        "rounded-3xl border overflow-hidden shadow-2xl transition-all duration-500",
        isDark ? "bg-black/60 border-white/8 shadow-black/40" : "bg-white/90 border-slate-200 shadow-slate-200/60"
      )}
      style={{ backdropFilter: "blur(20px)" }}
    >
      <div className={cn("flex items-center gap-2 px-4 py-3 border-b", isDark ? "bg-white/3 border-white/6" : "bg-slate-50 border-slate-200")}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <div className={cn("flex-1 mx-2 px-3 py-1 rounded-lg text-[9px] font-medium text-center", isDark ? "bg-white/5 text-slate-500" : "bg-white text-slate-400 border border-slate-200")}>
          taktakbeauty.tn/system
        </div>
        <div className={cn("w-2.5 h-2.5 rounded-full", isPaused ? "bg-amber-500/50" : "bg-[#5E84F2]/40 animate-pulse", isDark ? "" : "")} />
      </div>

      <div className="p-3">
        <div key={activeIdx} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Sim isDark={isDark} />
        </div>
      </div>

      <div className={cn("px-4 py-2 border-t text-[8px] font-semibold flex items-center justify-between", isDark ? "border-white/5 text-slate-600" : "border-slate-100 text-slate-400")}>
        <span className="flex items-center gap-1.5">
            {isPaused ? "Focused Preview" : "Operational Overview"}
            {isPaused && <span className="px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[6px] uppercase font-black tracking-tighter border border-amber-500/20">Paused</span>}
        </span>
        <span className="flex items-center gap-1">
          <span className={cn("w-1.5 h-1.5 rounded-full", isPaused ? "bg-amber-500" : "bg-emerald-500 animate-pulse")} />
          {isPaused ? "Manual Mode" : "Live Output"}
        </span>
      </div>
    </div>
  );
}
