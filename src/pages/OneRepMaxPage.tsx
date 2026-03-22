import { useState } from "react";
import { Dumbbell } from "lucide-react";
import { calculateOneRepMax } from "@/lib/calculations";
import { useTranslation } from "react-i18next";

export function OneRepMaxPage() {
  const { t } = useTranslation();
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");

  const w = parseFloat(weight);
  const r = parseFloat(reps);
  const hasResult = w > 0 && r > 0;
  const result = calculateOneRepMax(w, r);

  const percentages = [
    { p: 100, label: "1RM" },
    { p: 95, label: "95%" },
    { p: 90, label: "90%" },
    { p: 85, label: "85%" },
    { p: 80, label: "80%" },
    { p: 75, label: "75%" },
    { p: 70, label: "70%" },
    { p: 60, label: "60%" },
    { p: 50, label: "50%" },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:py-16">
      <header className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 mb-4">
          <Dumbbell className="h-4 w-4" />
          {t("oneRepMax.badge")}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          {t("oneRepMax.title")}
        </h1>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          {t("oneRepMax.subtitle")}
        </p>
      </header>

      <div className="grid gap-8">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex justify-end mb-4">
             <div className="bg-muted p-1 rounded-lg inline-flex">
              <button
                onClick={() => setUnit("kg")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${unit === "kg" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                {t("common.kg")}
              </button>
              <button
                onClick={() => setUnit("lbs")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${unit === "lbs" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                {t("common.lbs")}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                {t("oneRepMax.weightLifted")} ({unit})
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 100"
                className="w-full rounded-lg border bg-background px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                {t("oneRepMax.repetitions")}
              </label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="e.g. 5"
                className="w-full rounded-lg border bg-background px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {hasResult && (
          <div className="grid gap-6 animate-fade-in-up">
            <div className="rounded-2xl bg-primary p-6 text-primary-foreground text-center shadow-lg">
              <p className="text-sm font-medium opacity-90 mb-1">{t("oneRepMax.estimated")}</p>
              <div className="text-5xl font-bold tracking-tight tabular-nums">
                {result.average}
                <span className="text-2xl ml-1 font-medium text-primary-foreground/70">{unit}</span>
              </div>
              <p className="text-xs mt-2 opacity-70">Average of Epley & Brzycki formulas</p>
            </div>

            <div className="rounded-2xl border bg-card overflow-hidden">
              <div className="p-4 border-b bg-muted/30">
                <h3 className="font-semibold text-sm">{t("oneRepMax.breakdown")}</h3>
              </div>
              <div className="divide-y">
                {percentages.map((row) => (
                  <div key={row.p} className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors">
                    <span className="text-sm font-medium text-muted-foreground">{row.label}</span>
                    <span className="text-sm font-bold tabular-nums">
                      {Math.round(result.average * (row.p / 100))} {unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
