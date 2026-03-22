import { useState, useEffect, useCallback } from "react";
import { Droplets, Plus, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  goalLiters: number;
}

function getStoredWater(): { amount: number; date: string } {
  try {
    const raw = localStorage.getItem("water-tracker");
    if (!raw) return { amount: 0, date: new Date().toDateString() };
    const data = JSON.parse(raw);
    if (data.date !== new Date().toDateString()) {
      return { amount: 0, date: new Date().toDateString() };
    }
    return data;
  } catch {
    return { amount: 0, date: new Date().toDateString() };
  }
}

export function WaterTracker({ goalLiters }: Props) {
  const { t } = useTranslation();
  const goalMl = goalLiters * 1000;
  const [amount, setAmount] = useState(() => getStoredWater().amount);

  const save = useCallback((ml: number) => {
    setAmount(ml);
    localStorage.setItem("water-tracker", JSON.stringify({ amount: ml, date: new Date().toDateString() }));
  }, []);

  useEffect(() => {
    const check = () => {
      const stored = getStoredWater();
      if (stored.date !== new Date().toDateString()) save(0);
    };
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [save]);

  const add = (ml: number) => save(Math.min(amount + ml, goalMl * 2));
  const reset = () => save(0);

  const percent = Math.min((amount / goalMl) * 100, 100);
  const liters = (amount / 1000).toFixed(1);
  const completed = amount >= goalMl;

  return (
    <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-sky" />
          <h3 className="text-sm font-medium text-muted-foreground">{t("waterTracker.title")}</h3>
        </div>
        <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <RotateCcw className="h-3 w-3" /> {t("waterTracker.reset")}
        </button>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="relative w-24 h-44 rounded-b-2xl rounded-t-lg border-2 border-sky/30 overflow-hidden bg-sky-light/30">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-3 rounded-t-md bg-sky/40" />
          <div className="absolute bottom-0 left-0 right-0 bg-sky/60 transition-all duration-700 ease-out" style={{ height: `${percent}%` }}>
            <div className="absolute top-0 left-0 right-0 h-2 bg-sky/30 rounded-t-full" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <span className="text-2xl font-bold tabular-nums text-foreground">{liters}</span>
            <span className="text-[10px] text-muted-foreground">/ {goalLiters}L</span>
          </div>
        </div>
        {completed && (
          <p className="text-xs font-medium text-primary mt-3 animate-fade-in-up opacity-0">{t("waterTracker.goalReached")}</p>
        )}
      </div>

      <div className="h-2.5 rounded-full bg-sky-light mb-4">
        <div className="h-full rounded-full bg-sky transition-all duration-500 ease-out" style={{ width: `${percent}%` }} />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[250, 500, 750].map((ml) => (
          <button
            key={ml}
            onClick={() => add(ml)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-input bg-background py-2.5 text-sm font-medium text-foreground hover:border-sky hover:text-sky transition-colors active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            {ml}ml
          </button>
        ))}
      </div>
    </div>
  );
}
