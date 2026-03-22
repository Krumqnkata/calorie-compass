import { useState } from "react";
import { FormData, Gender, Goal, ActivityLevel, UnitSystem } from "./CalorieCalculator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ruler, Weight, Calendar, Flame } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  onCalculate: (data: FormData) => void;
}

export function CalculatorForm({ onCalculate }: Props) {
  const { t } = useTranslation();

  const activityOptions: { value: ActivityLevel; labelKey: string; descKey: string; multiplier: string }[] = [
    { value: "1.2", labelKey: "form.sedentary", descKey: "form.sedentaryDesc", multiplier: "×1.2" },
    { value: "1.375", labelKey: "form.lightlyActive", descKey: "form.lightlyActiveDesc", multiplier: "×1.375" },
    { value: "1.55", labelKey: "form.moderatelyActive", descKey: "form.moderatelyActiveDesc", multiplier: "×1.55" },
    { value: "1.725", labelKey: "form.veryActive", descKey: "form.veryActiveDesc", multiplier: "×1.725" },
    { value: "1.9", labelKey: "form.extraActive", descKey: "form.extraActiveDesc", multiplier: "×1.9" },
  ];

  const [form, setForm] = useState<FormData>({
    gender: "male",
    age: "",
    weight: "",
    height: "",
    heightFeet: "",
    heightInches: "",
    goal: "maintain",
    activityLevel: "1.55",
    unitSystem: "metric",
    bodyFatPercent: "",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleSubmit = () => {
    const newErrors: Record<string, boolean> = {};
    if (!form.age || parseInt(form.age) <= 0) newErrors.age = true;
    if (!form.weight || parseFloat(form.weight) <= 0) newErrors.weight = true;
    if (form.unitSystem === "metric") {
      if (!form.height || parseFloat(form.height) <= 0) newErrors.height = true;
    } else {
      if (!form.heightFeet || parseFloat(form.heightFeet) <= 0) newErrors.heightFeet = true;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onCalculate(form);
  };

  const update = (key: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: false }));
  };

  const inputClass = (field: string) =>
    `w-full rounded-lg border bg-background px-4 py-3 text-sm font-medium transition-colors
     placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring
     ${errors[field] ? "border-destructive ring-1 ring-destructive" : "border-input hover:border-muted-foreground/30"}`;

  const isMetric = form.unitSystem === "metric";

  return (
    <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
      {/* Unit System */}
      <fieldset className="mb-6">
        <label className="block text-sm font-medium text-muted-foreground mb-2">{t("form.unitSystem")}</label>
        <div className="grid grid-cols-2 gap-3">
          {(["metric", "imperial"] as UnitSystem[]).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => update("unitSystem", u)}
              className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all active:scale-[0.97]
                ${form.unitSystem === u
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-input bg-background text-foreground hover:border-muted-foreground/30"
                }`}
            >
              {u === "metric" ? t("form.metric") : t("form.imperial")}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Gender */}
      <fieldset className="mb-6">
        <label className="block text-sm font-medium text-muted-foreground mb-2">{t("form.gender")}</label>
        <div className="grid grid-cols-2 gap-3">
          {(["male", "female"] as Gender[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => update("gender", g)}
              className={`rounded-lg border px-4 py-3 text-sm font-medium transition-all active:scale-[0.97]
                ${form.gender === g
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-input bg-background text-foreground hover:border-muted-foreground/30"
                }`}
            >
              {g === "male" ? t("form.male") : t("form.female")}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Age / Weight / Height */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> {t("form.age")}
          </label>
          <input
            type="number"
            placeholder="25"
            min={1}
            max={120}
            value={form.age}
            onChange={(e) => update("age", e.target.value)}
            className={inputClass("age")}
          />
          {errors.age && <p className="text-xs text-destructive mt-1">{t("form.required")}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
            <Weight className="h-3.5 w-3.5" /> {t("form.weight")} ({isMetric ? t("common.kg") : t("common.lbs")})
          </label>
          <input
            type="number"
            placeholder={isMetric ? "70" : "154"}
            min={1}
            value={form.weight}
            onChange={(e) => update("weight", e.target.value)}
            className={inputClass("weight")}
          />
          {errors.weight && <p className="text-xs text-destructive mt-1">{t("form.required")}</p>}
        </div>
        {isMetric ? (
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
              <Ruler className="h-3.5 w-3.5" /> {t("form.heightCm")}
            </label>
            <input
              type="number"
              placeholder="175"
              min={1}
              value={form.height}
              onChange={(e) => update("height", e.target.value)}
              className={inputClass("height")}
            />
            {errors.height && <p className="text-xs text-destructive mt-1">{t("form.required")}</p>}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
              <Ruler className="h-3.5 w-3.5" /> {t("form.height")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="5 ft"
                min={1}
                max={8}
                value={form.heightFeet}
                onChange={(e) => update("heightFeet", e.target.value)}
                className={inputClass("heightFeet")}
              />
              <input
                type="number"
                placeholder="9 in"
                min={0}
                max={11}
                value={form.heightInches}
                onChange={(e) => update("heightInches", e.target.value)}
                className={inputClass("heightInches")}
              />
            </div>
            {errors.heightFeet && <p className="text-xs text-destructive mt-1">{t("form.required")}</p>}
          </div>
        )}
      </div>

      {/* Body Fat (optional) */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          {t("form.bodyFatOptional")} <span className="text-xs text-muted-foreground/60">{t("form.optional")}</span>
        </label>
        <input
          type="number"
          placeholder="e.g. 20"
          min={1}
          max={60}
          value={form.bodyFatPercent}
          onChange={(e) => update("bodyFatPercent", e.target.value)}
          className={inputClass("bodyFatPercent")}
        />
        {form.bodyFatPercent && (
          <p className="text-xs text-muted-foreground mt-1.5">
            {t("form.leanMass")} {Math.round(parseFloat(form.weight || "0") * (1 - parseFloat(form.bodyFatPercent) / 100))} {isMetric ? t("common.kg") : t("common.lbs")}
          </p>
        )}
      </div>

      {/* Goal */}
      <fieldset className="mb-6">
        <label className="block text-sm font-medium text-muted-foreground mb-2">{t("form.goal")}</label>
        <div className="grid grid-cols-3 gap-3">
          {([
            { value: "lose", labelKey: "form.loseWeight", emoji: "🔥" },
            { value: "maintain", labelKey: "form.maintain", emoji: "⚖️" },
            { value: "build", labelKey: "form.buildMuscle", emoji: "💪" },
          ] as { value: Goal; labelKey: string; emoji: string }[]).map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => update("goal", g.value)}
              className={`rounded-lg border px-3 py-3 text-sm font-medium transition-all active:scale-[0.97]
                ${form.goal === g.value
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-input bg-background text-foreground hover:border-muted-foreground/30"
                }`}
            >
              <span className="block text-lg mb-0.5">{g.emoji}</span>
              {t(g.labelKey)}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Activity Level */}
      <fieldset className="mb-8">
        <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
          <Flame className="h-3.5 w-3.5" /> {t("form.activityLevel")}
        </label>
        <Select value={form.activityLevel} onValueChange={(v) => update("activityLevel", v)}>
          <SelectTrigger className="w-full h-auto py-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {activityOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{t(opt.labelKey)} <span className="text-xs text-muted-foreground">{opt.multiplier}</span></span>
                  <span className="text-xs text-muted-foreground">{t(opt.descKey)}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </fieldset>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        className="w-full rounded-lg bg-primary text-primary-foreground py-3.5 text-sm font-semibold
                   transition-all hover:opacity-90 active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
      >
        <Flame className="h-4 w-4" />
        {t("form.calculate")}
      </button>
    </div>
  );
}
