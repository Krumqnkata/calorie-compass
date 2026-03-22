import { useState } from "react";
import { Ruler } from "lucide-react";
import { useTranslation } from "react-i18next";
import { calculateBodyFat } from "@/lib/calculations";

export function BodyFatCalculator() {
  const { t } = useTranslation();
  const [gender, setGender] = useState<"male" | "female">("male");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    const n = parseFloat(neck);
    const w = parseFloat(waist);
    const h = parseFloat(hip) || 0;
    const ht = parseFloat(height);

    if (!n || !w || !ht || n <= 0 || w <= 0 || ht <= 0) {
      setError(t("bodyFat.fillRequired"));
      return;
    }
    if (gender === "female" && (!h || h <= 0)) {
      setError(t("bodyFat.hipRequired"));
      return;
    }
    setError("");

    const bf = calculateBodyFat(gender, n, w, h, ht);
    setResult(Math.round(bf * 10) / 10);
  };

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm font-medium transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring hover:border-muted-foreground/30";

  const bfCategory = (bf: number, g: string) => {
    if (g === "male") {
      if (bf < 6) return { label: t("bodyFat.essential"), color: "text-sky" };
      if (bf < 14) return { label: t("bodyFat.athletic"), color: "text-primary" };
      if (bf < 18) return { label: t("bodyFat.fit"), color: "text-primary" };
      if (bf < 25) return { label: t("bodyFat.average"), color: "text-amber" };
      return { label: t("bodyFat.aboveAverage"), color: "text-destructive" };
    }
    if (bf < 14) return { label: t("bodyFat.essential"), color: "text-sky" };
    if (bf < 21) return { label: t("bodyFat.athletic"), color: "text-primary" };
    if (bf < 25) return { label: t("bodyFat.fit"), color: "text-primary" };
    if (bf < 32) return { label: t("bodyFat.average"), color: "text-amber" };
    return { label: t("bodyFat.aboveAverage"), color: "text-destructive" };
  };

  return (
    <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Ruler className="h-5 w-5 text-primary" />
        <h3 className="text-base font-semibold text-foreground">{t("bodyFat.title")}</h3>
        <span className="ml-auto text-[10px] text-muted-foreground rounded-full bg-muted px-2 py-0.5">{t("bodyFat.navy")}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {(["male", "female"] as const).map((g) => (
          <button
            key={g}
            onClick={() => setGender(g)}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all active:scale-[0.97]
              ${gender === g ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-input bg-background text-foreground hover:border-muted-foreground/30"}`}
          >
            {g === "male" ? t("form.male") : t("form.female")}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t("bodyFat.neck")}</label>
          <input type="number" placeholder="38" value={neck} onChange={(e) => setNeck(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t("bodyFat.waist")}</label>
          <input type="number" placeholder="85" value={waist} onChange={(e) => setWaist(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t("form.height")} (cm)</label>
          <input type="number" placeholder="175" value={height} onChange={(e) => setHeight(e.target.value)} className={inputClass} />
        </div>
        {gender === "female" && (
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t("bodyFat.hip")}</label>
            <input type="number" placeholder="95" value={hip} onChange={(e) => setHip(e.target.value)} className={inputClass} />
          </div>
        )}
      </div>

      {error && <p className="text-xs text-destructive mb-3">{error}</p>}

      <button
        onClick={calculate}
        className="w-full rounded-lg bg-primary text-primary-foreground py-3 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] shadow-sm"
      >
        {t("bodyFat.estimate")}
      </button>

      {result !== null && (
        <div className="mt-5 text-center p-5 rounded-xl bg-muted/50 animate-fade-in-up opacity-0">
          <p className="text-sm text-muted-foreground mb-1">{t("bodyFat.result")}</p>
          <p className="text-4xl font-bold tabular-nums text-foreground">{result}%</p>
          <p className={`text-sm font-medium mt-1 ${bfCategory(result, gender).color}`}>
            {bfCategory(result, gender).label}
          </p>
        </div>
      )}
    </div>
  );
}
