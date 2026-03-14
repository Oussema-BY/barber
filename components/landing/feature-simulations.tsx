"use client";

import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Scissors,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Check,
  Plus,
  Package,
  RotateCcw,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

/* ─── shared palette ─────────────────────────────────── */
const BRAND = "#5E84F2";

/* ═══════════════════════════════════════════════════════
   1. DASHBOARD SIMULATION
═══════════════════════════════════════════════════════ */
function DashboardSim({ isDark }: { isDark: boolean }) {
  const [tick, setTick] = useState(0);
  const kpis = [
    { label: "Appointments", value: 8, icon: Calendar, color: "text-blue-500", bg: isDark ? "bg-blue-500/10" : "bg-blue-50" },
    { label: "Daily Revenue", value: "560 DT", icon: DollarSign, color: "text-emerald-500", bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50" },
    { label: "Low Stock", value: 2, icon: AlertCircle, color: "text-amber-500", bg: isDark ? "bg-amber-500/10" : "bg-amber-50" },
    { label: "Month Rev.", value: "4.2K DT", icon: TrendingUp, color: "text-purple-500", bg: isDark ? "bg-purple-500/10" : "bg-purple-50" },
  ];
  const schedule = [
    { name: "Karim M.", service: "Haircut + Beard", time: "09:00", color: "#5E84F2" },
    { name: "Amine B.", service: "Royal Shave", time: "10:30", color: "#10b981" },
    { name: "Youssef T.", service: "Hair Trim", time: "11:00", color: "#f59e0b" },
  ];

  useEffect(() => {
    const t = setInterval(() => setTick((p) => p + 1), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-3 p-1">
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-2">
        {kpis.map((k, i) => (
          <div key={i} className={cn("rounded-xl p-2.5 flex items-center gap-2 border transition-all duration-500", isDark ? "bg-white/3 border-white/6" : "bg-white border-slate-100 shadow-sm")}>
            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", k.bg)}>
              <k.icon className={cn("w-3.5 h-3.5", k.color)} />
            </div>
            <div className="min-w-0">
              <p className={cn("text-[9px] font-semibold truncate", isDark ? "text-slate-400" : "text-slate-500")}>{k.label}</p>
              <p className={cn("text-sm font-black leading-none", isDark ? "text-white" : "text-slate-800")}>{k.value}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Schedule */}
      <div className={cn("rounded-xl border p-2.5", isDark ? "bg-white/3 border-white/6" : "bg-white border-slate-100 shadow-sm")}>
        <p className={cn("text-[9px] font-black uppercase tracking-widest mb-2", isDark ? "text-slate-400" : "text-slate-500")}>Today's Schedule</p>
        <div className="space-y-1.5">
          {schedule.map((s, i) => (
            <div key={i} className={cn("flex items-center gap-2 p-1.5 rounded-lg", isDark ? "bg-white/3" : "bg-slate-50")}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-black shrink-0" style={{ backgroundColor: s.color }}>
                {s.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-[9px] font-bold truncate", isDark ? "text-white" : "text-slate-800")}>{s.name}</p>
                <p className={cn("text-[8px] truncate", isDark ? "text-slate-500" : "text-slate-400")}>{s.service}</p>
              </div>
              <span className={cn("text-[8px] font-bold shrink-0", isDark ? "text-slate-400" : "text-slate-500")}>{s.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   2. APPOINTMENTS / CALENDAR SIMULATION
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
  const bookedTimes = booked.map((i) => times[i]);

  const handleBook = (i: number) => {
    setBooked((p) => p.includes(i) ? p.filter((x) => x !== i) : [...p, i]);
  };

  return (
    <div className="space-y-2.5 p-1">
      {/* Mini calendar */}
      <div className={cn("rounded-xl border p-2.5", isDark ? "bg-white/3 border-white/6" : "bg-white border-slate-100 shadow-sm")}>
        <div className="flex items-center justify-between mb-2">
          <ChevronLeft className={cn("w-3 h-3", isDark ? "text-slate-500" : "text-slate-400")} />
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
      {/* Time slots */}
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
  const [search, setSearch] = useState("");

  const services = [
    { name: "Haircut", category: "hair", price: "15 DT", color: "text-blue-500", bg: isDark ? "bg-blue-500/10" : "bg-blue-50" },
    { name: "Royal Shave", category: "beard", price: "12 DT", color: "text-emerald-500", bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50" },
    { name: "Beard Trim", category: "beard", price: "8 DT", color: "text-amber-500", bg: isDark ? "bg-amber-500/10" : "bg-amber-50" },
    { name: "Fade Cut", category: "hair", price: "20 DT", color: "text-purple-500", bg: isDark ? "bg-purple-500/10" : "bg-purple-50" },
    { name: "Face Care", category: "face", price: "18 DT", color: "text-rose-500", bg: isDark ? "bg-rose-500/10" : "bg-rose-50" },
    { name: "Hair Color", category: "hair", price: "35 DT", color: "text-cyan-500", bg: isDark ? "bg-cyan-500/10" : "bg-cyan-50" },
  ];

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (i: number) => {
    setSelected((p) => p.includes(i) ? p.filter((x) => x !== i) : [...p, i]);
  };

  return (
    <div className="space-y-2.5 p-1">
      {/* Search */}
      <div className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border", isDark ? "bg-white/3 border-white/6" : "bg-white border-slate-200 shadow-sm")}>
        <Scissors className={cn("w-3 h-3 shrink-0", isDark ? "text-slate-500" : "text-slate-400")} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services..."
          className="bg-transparent text-[9px] font-medium outline-none flex-1 placeholder:text-slate-400"
          style={{ color: isDark ? "#fff" : "#0f172a" }}
        />
      </div>
      {/* Stats pill */}
      <div className="flex items-center gap-2">
        <span className={cn("text-[8px] font-bold px-2 py-0.5 rounded-full", isDark ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-500")}>
          {filtered.length} services
        </span>
        {selected.length > 0 && (
          <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-[#5E84F2]/10 text-[#5E84F2]">
            {selected.length} selected
          </span>
        )}
      </div>
      {/* Grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {filtered.map((s, i) => {
          const idx = services.indexOf(s);
          const isSel = selected.includes(idx);
          return (
            <button
              key={i}
              onClick={() => toggle(idx)}
              className={cn(
                "p-2 rounded-xl border-2 text-left transition-all duration-200",
                isSel ? "border-[#5E84F2] bg-[#5E84F2]/5 scale-[0.97]" : isDark ? "border-white/5 bg-white/2 hover:border-white/10" : "border-slate-100 bg-white hover:border-[#5E84F2]/30 shadow-sm"
              )}
            >
              <div className="flex items-start justify-between mb-1">
                <div className={cn("w-5 h-5 rounded-md flex items-center justify-center", s.bg)}>
                  <Scissors className={cn("w-2.5 h-2.5", s.color)} />
                </div>
                {isSel && (
                  <div className="w-3.5 h-3.5 rounded-full bg-[#5E84F2] flex items-center justify-center">
                    <Check className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
              <p className={cn("text-[8px] font-black leading-tight", isDark ? "text-white" : "text-slate-800")}>{s.name}</p>
              <p className={cn("text-[7px] capitalize mb-1", isDark ? "text-slate-500" : "text-slate-400")}>{s.category}</p>
              <p className="text-[9px] font-black text-[#5E84F2]">{s.price}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   4. POS SIMULATION
═══════════════════════════════════════════════════════ */
function POSSim({ isDark }: { isDark: boolean }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [cash, setCash] = useState("");

  const items = [
    { name: "Haircut", price: 15 },
    { name: "Beard Trim", price: 8 },
    { name: "Royal Shave", price: 12 },
    { name: "Fade + Beard", price: 25 },
    { name: "Face Care", price: 18 },
    { name: "VIP Package", price: 45 },
  ];

  const total = selected.reduce((s, i) => s + items[i].price, 0);
  const change = cash ? Math.max(0, parseFloat(cash) - total) : 0;

  const toggle = (i: number) => {
    setSelected((p) => p.includes(i) ? p.filter((x) => x !== i) : [...p, i]);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-6 space-y-3">
        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", isDark ? "bg-emerald-500/20" : "bg-emerald-100")}>
          <Check className="w-6 h-6 text-emerald-500" />
        </div>
        <div className="text-center">
          <p className={cn("text-sm font-black", isDark ? "text-white" : "text-slate-800")}>Sale Complete!</p>
          <p className={cn("text-xs font-semibold", isDark ? "text-slate-400" : "text-slate-500")}>Total: {total} DT</p>
          {change > 0 && <p className="text-xs font-bold text-emerald-500">Change: {change.toFixed(2)} DT</p>}
        </div>
        <button
          onClick={() => { setDone(false); setSelected([]); setCash(""); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5E84F2] text-white text-[8px] font-bold"
        >
          <RotateCcw className="w-2.5 h-2.5" /> New Sale
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-1">
      {/* Items grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {items.map((item, i) => {
          const isSel = selected.includes(i);
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={cn(
                "p-2 rounded-xl border-2 text-left transition-all duration-200",
                isSel ? "border-[#5E84F2] bg-[#5E84F2]/8 scale-[0.97]" : isDark ? "border-white/5 bg-white/2 hover:border-white/10" : "border-slate-100 bg-white hover:border-[#5E84F2]/30 shadow-sm"
              )}
            >
              <div className="flex justify-between items-start">
                <p className={cn("text-[8px] font-black leading-tight", isDark ? "text-white" : "text-slate-800")}>{item.name}</p>
                {isSel && (
                  <div className="w-3 h-3 rounded-full bg-[#5E84F2] flex items-center justify-center shrink-0">
                    <Check className="w-1.5 h-1.5 text-white" />
                  </div>
                )}
              </div>
              <p className="text-[9px] font-black text-[#5E84F2] mt-1">{item.price} DT</p>
            </button>
          );
        })}
      </div>
      {/* Bottom panel */}
      <div className={cn("rounded-xl border p-2.5 space-y-2", isDark ? "bg-white/3 border-white/6" : "bg-white border-slate-100 shadow-sm")}>
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selected.map((i) => (
              <span key={i} className="px-1.5 py-0.5 bg-[#5E84F2]/10 text-[#5E84F2] text-[7px] font-bold rounded-full">{items[i].name}</span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className={cn("text-[8px] font-semibold", isDark ? "text-slate-400" : "text-slate-500")}>Total</span>
          <span className={cn("text-base font-black", isDark ? "text-white" : "text-slate-800")}>{total} DT</span>
        </div>
        <input
          value={cash}
          onChange={(e) => setCash(e.target.value)}
          placeholder="Cash received..."
          type="number"
          className={cn("w-full px-2 py-1 rounded-lg border text-[8px] font-medium outline-none", isDark ? "bg-white/5 border-white/10 text-white placeholder:text-slate-600" : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400")}
        />
        {cash && change > 0 && (
          <p className="text-[8px] font-bold text-emerald-500">Change: {change.toFixed(2)} DT</p>
        )}
        <button
          onClick={() => { if (selected.length > 0) setDone(true); }}
          disabled={selected.length === 0}
          className={cn(
            "w-full py-1.5 rounded-lg text-[8px] font-black transition-all duration-200 flex items-center justify-center gap-1",
            selected.length > 0
              ? "bg-[#5E84F2] text-white hover:opacity-90"
              : isDark ? "bg-white/5 text-slate-600 cursor-not-allowed" : "bg-slate-100 text-slate-400 cursor-not-allowed"
          )}
        >
          <Check className="w-2.5 h-2.5" />
          {selected.length > 0 ? `Complete Sale — ${total} DT` : "Select items"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   5. FINANCE SIMULATION
═══════════════════════════════════════════════════════ */
function FinanceSim({ isDark }: { isDark: boolean }) {
  const [period, setPeriod] = useState<"Today" | "Week" | "Month">("Month");

  const data: Record<string, { revenue: number; expenses: number; profit: number; bars: number[] }> = {
    Today:  { revenue: 320,  expenses: 45,   profit: 275,  bars: [40, 70, 55, 80, 60, 90, 45] },
    Week:   { revenue: 1840, expenses: 310,  profit: 1530, bars: [60, 45, 80, 70, 90, 55, 75] },
    Month:  { revenue: 7200, expenses: 1350, profit: 5850, bars: [50, 65, 80, 75, 90, 85, 70] },
  };

  const d = data[period];
  const maxBar = Math.max(...d.bars);

  const services = [
    { name: "Haircut", pct: 38, color: "#5E84F2" },
    { name: "Beard Trim", pct: 24, color: "#10b981" },
    { name: "Packages", pct: 22, color: "#f59e0b" },
    { name: "Other", pct: 16, color: "#a855f7" },
  ];

  return (
    <div className="space-y-2.5 p-1">
      {/* Period tabs */}
      <div className={cn("flex p-0.5 rounded-xl gap-0.5", isDark ? "bg-white/5" : "bg-slate-100")}>
        {(["Today", "Week", "Month"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              "flex-1 py-1 rounded-lg text-[8px] font-black transition-all duration-200",
              period === p ? "bg-[#5E84F2] text-white shadow-sm" : isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: "Revenue", value: d.revenue, color: "text-emerald-500", bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50" },
          { label: "Expenses", value: d.expenses, color: "text-red-400", bg: isDark ? "bg-red-500/10" : "bg-red-50" },
          { label: "Profit", value: d.profit, color: "text-[#5E84F2]", bg: isDark ? "bg-[#5E84F2]/10" : "bg-[#5E84F2]/5" },
        ].map((k, i) => (
          <div key={i} className={cn("rounded-xl p-2 border", isDark ? "bg-white/3 border-white/6" : "bg-white border-slate-100 shadow-sm")}>
            <p className={cn("text-[7px] font-semibold", isDark ? "text-slate-500" : "text-slate-400")}>{k.label}</p>
            <p className={cn("text-[10px] font-black leading-tight mt-0.5", k.color)}>
              {k.value >= 1000 ? `${(k.value / 1000).toFixed(1)}K` : k.value} DT
            </p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className={cn("rounded-xl border p-2.5", isDark ? "bg-white/3 border-white/6" : "bg-white border-slate-100 shadow-sm")}>
        <p className={cn("text-[8px] font-black uppercase tracking-widest mb-2", isDark ? "text-slate-400" : "text-slate-500")}>Revenue Trend</p>
        <div className="flex items-end gap-1 h-10">
          {d.bars.map((b, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div
                className="w-full rounded-t-sm transition-all duration-500"
                style={{
                  height: `${(b / maxBar) * 100}%`,
                  background: `linear-gradient(to top, ${BRAND}cc, ${BRAND}44)`,
                  minHeight: 3,
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {["M","T","W","T","F","S","S"].map((d, i) => (
            <span key={i} className={cn("flex-1 text-center text-[6px] font-bold", isDark ? "text-slate-600" : "text-slate-400")}>{d}</span>
          ))}
        </div>
      </div>

      {/* Service breakdown */}
      <div className={cn("rounded-xl border p-2.5", isDark ? "bg-white/3 border-white/6" : "bg-white border-slate-100 shadow-sm")}>
        <p className={cn("text-[8px] font-black uppercase tracking-widest mb-2", isDark ? "text-slate-400" : "text-slate-500")}>Revenue by Service</p>
        <div className="space-y-1.5">
          {services.map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <span className={cn("text-[7px] font-semibold flex-1", isDark ? "text-slate-300" : "text-slate-600")}>{s.name}</span>
              <div className={cn("flex-1 h-1.5 rounded-full overflow-hidden", isDark ? "bg-white/5" : "bg-slate-100")}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
              </div>
              <span className={cn("text-[7px] font-black w-5 text-right", isDark ? "text-slate-400" : "text-slate-500")}>{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT — Tab container
═══════════════════════════════════════════════════════ */
const TABS = [
  { id: "dashboard",    label: "Dashboard",     icon: TrendingUp,  component: DashboardSim },
  { id: "appointments", label: "Appointments",  icon: Calendar,    component: AppointmentsSim },
  { id: "services",     label: "Services",      icon: Scissors,    component: ServicesSim },
  { id: "pos",          label: "Quick Sale",    icon: DollarSign,  component: POSSim },
  { id: "finance",      label: "Finance",       icon: Package,     component: FinanceSim },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function FeatureSimulations() {
  const [active, setActive] = useState<TabId>("dashboard");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const contentRef = useRef<HTMLDivElement>(null);

  const tab = TABS.find((t) => t.id === active)!;
  const Sim = tab.component;

  const handleTabChange = (id: TabId) => {
    if (id === active) return;
    setActive(id);
  };

  return (
    <div
      className={cn(
        "rounded-3xl border overflow-hidden shadow-2xl transition-colors duration-300",
        isDark
          ? "bg-black/60 border-white/8 shadow-black/40"
          : "bg-white/90 border-slate-200 shadow-slate-200/60"
      )}
      style={{ backdropFilter: "blur(20px)" }}
    >
      {/* Fake browser chrome */}
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-3 border-b",
          isDark ? "bg-white/3 border-white/6" : "bg-slate-50 border-slate-200"
        )}
      >
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <div className={cn("flex-1 mx-2 px-3 py-1 rounded-lg text-[9px] font-medium text-center", isDark ? "bg-white/5 text-slate-500" : "bg-white text-slate-400 border border-slate-200")}>
          taktakbeauty.tn/{active}
        </div>
        <div className={cn("w-2.5 h-2.5 rounded-full animate-pulse", isDark ? "bg-[#5E84F2]/40" : "bg-[#5E84F2]/30")} />
      </div>

      {/* Tab bar */}
      <div
        className={cn(
          "flex border-b overflow-x-auto scrollbar-none",
          isDark ? "bg-white/2 border-white/6" : "bg-slate-50/80 border-slate-200"
        )}
      >
        {TABS.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2.5 text-[9px] font-black uppercase tracking-wider whitespace-nowrap transition-all duration-200 border-b-2 shrink-0",
                isActive
                  ? "border-[#5E84F2] text-[#5E84F2]"
                  : isDark
                  ? "border-transparent text-slate-500 hover:text-slate-300"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              )}
            >
              <t.icon className="w-3 h-3" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Simulation content */}
      <div
        ref={contentRef}
        className="p-3 overflow-y-auto"
        style={{ maxHeight: 390 }}
      >
        <div key={active} style={{ animation: "simFadeIn 0.25s ease-out" }}>
          <Sim isDark={isDark} />
        </div>
      </div>

      {/* Footer label */}
      <div className={cn("px-4 py-2 border-t text-[8px] font-semibold flex items-center justify-between", isDark ? "border-white/5 text-slate-600" : "border-slate-100 text-slate-400")}>
        <span>Live Interactive Preview</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Connected
        </span>
      </div>

      <style jsx>{`
        @keyframes simFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
