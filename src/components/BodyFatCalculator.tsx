import { useState } from "react";
import { Ruler } from "lucide-react";

export function BodyFatCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    const n = parseFloat(neck);
    const w = parseFloat(waist);
    const h = parseFloat(hip);

    if (!n || !w || n <= 0 || w <= 0) {
      setError("Please fill in all required fields.");
      return;
    }
    if (gender === "female" && (!h || h <= 0)) {
      setError("Hip circumference is required for females.");
      return;
    }
    setError("");

    // U.S. Navy Method (cm)
    let bf: number;
    if (gender === "male") {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(170)) - 450;
    } else {
      bf = 495 / (1.29579 - 0.35004 * Math.log10(w + h - n) + 0.22100 * Math.log10(170)) - 450;
    }
    setResult(Math.round(bf * 10) / 10);
  };

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm font-medium transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring hover:border-muted-foreground/30";

  const bfCategory = (bf: number, g: string) => {
    if (g === "male") {
      if (bf < 6) return { label: "Essential", color: "text-sky" };
      if (bf < 14) return { label: "Athletic", color: "text-primary" };
      if (bf < 18) return { label: "Fit", color: "text-primary" };
      if (bf < 25) return { label: "Average", color: "text-amber" };
      return { label: "Above average", color: "text-destructive" };
    }
    if (bf < 14) return { label: "Essential", color: "text-sky" };
    if (bf < 21) return { label: "Athletic", color: "text-primary" };
    if (bf < 25) return { label: "Fit", color: "text-primary" };
    if (bf < 32) return { label: "Average", color: "text-amber" };
    return { label: "Above average", color: "text-destructive" };
  };

  return (
    <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Ruler className="h-5 w-5 text-primary" />
        <h3 className="text-base font-semibold text-foreground">Body Fat % Calculator</h3>
        <span className="ml-auto text-[10px] text-muted-foreground rounded-full bg-muted px-2 py-0.5">U.S. Navy Method</span>
      </div>

      {/* Gender */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {(["male", "female"] as const).map((g) => (
          <button
            key={g}
            onClick={() => setGender(g)}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all active:scale-[0.97]
              ${gender === g ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-input bg-background text-foreground hover:border-muted-foreground/30"}`}
          >
            {g === "male" ? "♂ Male" : "♀ Female"}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1.5">Neck (cm)</label>
          <input type="number" placeholder="38" value={neck} onChange={(e) => setNeck(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1.5">Waist (cm)</label>
          <input type="number" placeholder="85" value={waist} onChange={(e) => setWaist(e.target.value)} className={inputClass} />
        </div>
        {gender === "female" && (
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Hip (cm)</label>
            <input type="number" placeholder="95" value={hip} onChange={(e) => setHip(e.target.value)} className={inputClass} />
          </div>
        )}
      </div>

      {error && <p className="text-xs text-destructive mb-3">{error}</p>}

      <button
        onClick={calculate}
        className="w-full rounded-lg bg-primary text-primary-foreground py-3 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] shadow-sm"
      >
        Estimate Body Fat %
      </button>

      {result !== null && (
        <div className="mt-5 text-center p-5 rounded-xl bg-muted/50 animate-fade-in-up opacity-0">
          <p className="text-sm text-muted-foreground mb-1">Estimated Body Fat</p>
          <p className="text-4xl font-bold tabular-nums text-foreground">{result}%</p>
          <p className={`text-sm font-medium mt-1 ${bfCategory(result, gender).color}`}>
            {bfCategory(result, gender).label}
          </p>
        </div>
      )}
    </div>
  );
}
