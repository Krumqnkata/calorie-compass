import { useState, useEffect } from "react";

export interface MacroSplit {
  protein: number;
  fat: number;
  carbs: number;
}

const presets: { id: string; label: string; split: MacroSplit }[] = [
  { id: "balanced", label: "Balanced", split: { protein: 30, fat: 30, carbs: 40 } },
  { id: "lowcarb", label: "Low Carb", split: { protein: 40, fat: 40, carbs: 20 } },
  { id: "keto", label: "Keto", split: { protein: 20, fat: 75, carbs: 5 } },
  { id: "highprotein", label: "High Protein", split: { protein: 40, fat: 30, carbs: 30 } },
];

interface Props {
  targetCalories: number;
  onSplitChange: (split: MacroSplit, proteinG: number, fatG: number, carbsG: number) => void;
}

export function MacroPresets({ targetCalories, onSplitChange }: Props) {
  const [active, setActive] = useState("balanced");

  useEffect(() => {
    const preset = presets.find((p) => p.id === active);
    if (!preset) return;
    const { protein, fat, carbs } = preset.split;
    onSplitChange(
      preset.split,
      Math.round((targetCalories * protein / 100) / 4),
      Math.round((targetCalories * fat / 100) / 9),
      Math.round((targetCalories * carbs / 100) / 4),
    );
  }, [active, targetCalories]);

  return (
    <div className="mb-5">
      <p className="text-xs font-medium text-muted-foreground mb-2">Diet Preset</p>
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95
              ${active === p.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-input bg-background text-foreground hover:border-muted-foreground/30"
              }`}
          >
            {p.label}
            <span className="ml-1 opacity-60">
              {p.split.protein}/{p.split.fat}/{p.split.carbs}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
