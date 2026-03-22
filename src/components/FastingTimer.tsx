import { useState, useEffect } from "react";
import { Timer, Play, Square } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "@/hooks/use-local-storage";

const FASTING_WINDOWS = [
  { label: "12:12", hours: 12 },
  { label: "14:10", hours: 14 },
  { label: "16:8", hours: 16 },
  { label: "18:6", hours: 18 },
  { label: "20:4", hours: 20 },
];

interface FastState {
  startTime: number | null;
  durationHours: number;
}

export function FastingTimer() {
  const { t } = useTranslation();
  const [state, setState] = useLocalStorage<FastState>("fasting-timer", { startTime: null, durationHours: 16 });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!state.startTime) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [state.startTime]);

  const startFast = () => { setState({ ...state, startTime: Date.now() }); setNow(Date.now()); };
  const stopFast = () => setState({ ...state, startTime: null });
  const setWindow = (h: number) => setState({ ...state, durationHours: h, startTime: null });

  const totalMs = state.durationHours * 3600 * 1000;
  const elapsedMs = state.startTime ? Math.max(0, now - state.startTime) : 0;
  const remainingMs = Math.max(0, totalMs - elapsedMs);
  const progress = state.startTime ? Math.min((elapsedMs / totalMs) * 100, 100) : 0;
  const completed = state.startTime !== null && remainingMs === 0;

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const size = 200;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Timer className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-medium text-muted-foreground">{t("fastingTimer.title")}</h3>
      </div>

      {!state.startTime && (
        <div className="mb-6">
          <p className="text-xs text-muted-foreground mb-2">{t("fastingTimer.selectWindow")}</p>
          <div className="flex flex-wrap gap-2">
            {FASTING_WINDOWS.map((w) => (
              <button
                key={w.hours}
                onClick={() => setWindow(w.hours)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95
                  ${state.durationHours === w.hours
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-input bg-background text-foreground hover:border-muted-foreground/30"
                  }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
            <circle
              cx={size / 2} cy={size / 2} r={radius} fill="none"
              stroke="hsl(var(--primary))" strokeWidth={stroke}
              strokeDasharray={circumference} strokeDashoffset={dashOffset}
              strokeLinecap="round" className="transition-all duration-1000 ease-out"
              style={{ opacity: state.startTime ? 1 : 0.2 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {state.startTime ? (
              <>
                <span className="text-[10px] text-muted-foreground mb-0.5">
                  {completed ? t("fastingTimer.completed") : t("fastingTimer.remaining")}
                </span>
                <span className="text-2xl font-bold tabular-nums text-foreground">
                  {completed ? "🎉" : formatTime(remainingMs)}
                </span>
                <span className="text-[10px] text-muted-foreground mt-1">
                  {t("fastingTimer.elapsed")}: {formatTime(elapsedMs)}
                </span>
              </>
            ) : (
              <>
                <span className="text-3xl font-bold text-foreground">{state.durationHours}h</span>
                <span className="text-xs text-muted-foreground">{t("fastingTimer.fastingWindow")}</span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={state.startTime ? stopFast : startFast}
          className={`mt-5 flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all active:scale-[0.97] shadow-sm
            ${state.startTime
              ? "bg-destructive text-destructive-foreground hover:opacity-90"
              : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
        >
          {state.startTime ? (
            <><Square className="h-4 w-4" /> {t("fastingTimer.endFast")}</>
          ) : (
            <><Play className="h-4 w-4" /> {t("fastingTimer.startFast")}</>
          )}
        </button>

        {state.startTime && (
          <p className="text-[10px] text-muted-foreground mt-3">
            {t("fastingTimer.started")} {new Date(state.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            {" · "}{t("fastingTimer.ends")} {new Date(state.startTime + totalMs).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
      </div>
    </div>
  );
}
