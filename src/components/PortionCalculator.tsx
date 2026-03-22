import { useState } from "react";
import { Calculator } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useTranslation } from "react-i18next";

export function PortionCalculator() {
  const { t } = useTranslation();
  const [base, setBase] = useState({ weight: "100", calories: "", protein: "", fat: "", carbs: "" });
  const [portion, setPortion] = useState("");

  const calc = (val: string) => {
    const b = parseFloat(base.weight) || 0;
    const v = parseFloat(val) || 0;
    const p = parseFloat(portion) || 0;
    return b > 0 ? Math.round((v / b) * p * 10) / 10 : 0;
  };

  const results = {
    calories: calc(base.calories),
    protein: calc(base.protein),
    fat: calc(base.fat),
    carbs: calc(base.carbs),
  };

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">{t("portionCalc.title")}</h3>
      </div>

      <p className="text-xs text-muted-foreground mb-4">{t("portionCalc.description")}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        <Field label={t("portionCalc.baseWeight")} value={base.weight} onChange={(v) => setBase({ ...base, weight: v })} />
        <Field label={t("portionCalc.calories")} value={base.calories} onChange={(v) => setBase({ ...base, calories: v })} placeholder="kcal" />
        <Field label={t("portionCalc.protein")} value={base.protein} onChange={(v) => setBase({ ...base, protein: v })} />
        <Field label={t("portionCalc.fats")} value={base.fat} onChange={(v) => setBase({ ...base, fat: v })} />
        <Field label={t("portionCalc.carbs")} value={base.carbs} onChange={(v) => setBase({ ...base, carbs: v })} />
        <Field label={t("portionCalc.yourPortion")} value={portion} onChange={setPortion} highlight />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultCard label={t("portionCalc.calories")} value={results.calories} unit="kcal" />
        <ResultCard label={t("results.protein")} value={results.protein} unit="g" />
        <ResultCard label={t("portionCalc.fats")} value={results.fat} unit="g" />
        <ResultCard label={t("portionCalc.carbs")} value={results.carbs} unit="g" />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, highlight }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; highlight?: boolean;
}) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground mb-1 block">{label}</Label>
      <Input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "0"}
        className={highlight ? "border-primary ring-1 ring-primary/20" : ""}
      />
    </div>
  );
}

function ResultCard({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="rounded-xl bg-muted/50 p-3 text-center">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-lg font-bold tabular-nums text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{unit}</p>
    </div>
  );
}
