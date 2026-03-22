import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export interface MacroSplit {
  protein: number;
  fat: number;
  carbs: number;
}

interface Props {
  targetCalories: number;
  onSplitChange: (split: MacroSplit, proteinG: number, fatG: number, carbsG: number) => void;
}

export function MacroPresets({ targetCalories, onSplitChange }: Props) {
  const { t } = useTranslation();
  const [active, setActive] = useState("balanced");

  const presets: { id: string; labelKey: string; split: MacroSplit }[] = [
    { id: "balanced", labelKey: "macroPresets.balanced", split: { protein: 30, fat: 30, carbs: 40 } },
    { id: "lowcarb", labelKey: "macroPresets.lowCarb", split: { protein: 40, fat: 40, carbs: 20 } },
    { id: "keto", labelKey: "macroPresets.keto", split: { protein: 20, fat: 75, carbs: 5 } },
    { id: "highprotein", labelKey: "macroPresets.highProtein", split: { protein: 40, fat: 30, carbs: 30 } },
  ];

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
      <p className="text-xs font-medium text-muted-foreground mb-2">{t("macroPresets.dietPreset")}</p>
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
            {t(p.labelKey)}
            <span className="ml-1 opacity-60">
              {p.split.protein}/{p.split.fat}/{p.split.carbs}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
