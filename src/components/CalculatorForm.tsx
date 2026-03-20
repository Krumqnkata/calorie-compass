import { useState } from "react";
import { FormData, Gender, Goal, ActivityLevel } from "./CalorieCalculator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const activityOptions: { value: ActivityLevel; label: string; desc: string }[] = [
  { value: "1.2", label: "Sedentary", desc: "Little or no exercise" },
  { value: "1.375", label: "Lightly active", desc: "Light exercise 1-3 days/week" },
  { value: "1.55", label: "Moderately active", desc: "Moderate exercise 3-5 days/week" },
  { value: "1.725", label: "Very active", desc: "Hard exercise 6-7 days/week" },
  { value: "1.9", label: "Extra active", desc: "Very hard physical job / training 2×/day" },
];

interface Props {
  onCalculate: (data: FormData) => void;
}

export function CalculatorForm({ onCalculate }: Props) {
  const [form, setForm] = useState<FormData>({
    gender: "male",
    age: "",
    weight: "",
    height: "",
    goal: "maintain",
    activityLevel: "1.55",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleSubmit = () => {
    const newErrors: Record<string, boolean> = {};
    if (!form.age || parseInt(form.age) <= 0) newErrors.age = true;
    if (!form.weight || parseFloat(form.weight) <= 0) newErrors.weight = true;
    if (!form.height || parseFloat(form.height) <= 0) newErrors.height = true;

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

  return (
    <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
      {/* Gender */}
      <fieldset className="mb-6">
        <label className="block text-sm font-medium text-muted-foreground mb-2">Gender</label>
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
              {g === "male" ? "♂ Male" : "♀ Female"}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Age / Weight / Height */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Age</label>
          <input
            type="number"
            placeholder="25"
            min={1}
            max={120}
            value={form.age}
            onChange={(e) => update("age", e.target.value)}
            className={inputClass("age")}
          />
          {errors.age && <p className="text-xs text-destructive mt-1">Required</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Weight (kg)</label>
          <input
            type="number"
            placeholder="70"
            min={1}
            value={form.weight}
            onChange={(e) => update("weight", e.target.value)}
            className={inputClass("weight")}
          />
          {errors.weight && <p className="text-xs text-destructive mt-1">Required</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Height (cm)</label>
          <input
            type="number"
            placeholder="175"
            min={1}
            value={form.height}
            onChange={(e) => update("height", e.target.value)}
            className={inputClass("height")}
          />
          {errors.height && <p className="text-xs text-destructive mt-1">Required</p>}
        </div>
      </div>

      {/* Goal */}
      <fieldset className="mb-6">
        <label className="block text-sm font-medium text-muted-foreground mb-2">Goal</label>
        <div className="grid grid-cols-3 gap-3">
          {([
            { value: "lose", label: "Lose Weight", emoji: "🔥" },
            { value: "maintain", label: "Maintain", emoji: "⚖️" },
            { value: "build", label: "Build Muscle", emoji: "💪" },
          ] as { value: Goal; label: string; emoji: string }[]).map((g) => (
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
              {g.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Activity Level */}
      <fieldset className="mb-8">
        <label className="block text-sm font-medium text-muted-foreground mb-2">Activity Level</label>
        <Select value={form.activityLevel} onValueChange={(v) => update("activityLevel", v)}>
          <SelectTrigger className="w-full h-auto py-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {activityOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{opt.label}</span>
                  <span className="text-xs text-muted-foreground">{opt.desc}</span>
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
                   transition-all hover:opacity-90 active:scale-[0.98] shadow-sm"
      >
        Calculate Macros & Calories
      </button>
    </div>
  );
}
