import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [active, setActive] = useState("balanced"); // Can be 'balanced', 'lowcarb', 'keto', 'highprotein', or 'custom'

  const [customProtein, setCustomProtein] = useState(30);
  const [customFat, setCustomFat] = useState(30);
  const [customCarbs, setCustomCarbs] = useState(40);

  const presets: { id: string; labelKey: string; split: MacroSplit }[] = [
    { id: "balanced", labelKey: "macroPresets.balanced", split: { protein: 30, fat: 30, carbs: 40 } },
    { id: "lowcarb", labelKey: "macroPresets.lowCarb", split: { protein: 40, fat: 40, carbs: 20 } },
    { id: "keto", labelKey: "macroPresets.keto", split: { protein: 20, fat: 75, carbs: 5 } },
    { id: "highprotein", labelKey: "macroPresets.highProtein", split: { protein: 40, fat: 30, carbs: 30 } },
    // Custom option will be handled separately
  ];

  useEffect(() => {
    let currentSplit: MacroSplit;
    if (active === "custom") {
      const total = customProtein + customFat + customCarbs;
      // Normalize to 100% if sum is not 100
      currentSplit = {
        protein: total === 0 ? 0 : (customProtein / total) * 100,
        fat: total === 0 ? 0 : (customFat / total) * 100,
        carbs: total === 0 ? 0 : (customCarbs / total) * 100,
      };
    } else {
      const preset = presets.find((p) => p.id === active);
      currentSplit = preset ? preset.split : presets[0].split; // Default to balanced if not found
    }

    onSplitChange(
      currentSplit,
      Math.round((targetCalories * currentSplit.protein / 100) / 4),
      Math.round((targetCalories * currentSplit.fat / 100) / 9),
      Math.round((targetCalories * currentSplit.carbs / 100) / 4),
    );
  }, [active, targetCalories, customProtein, customFat, customCarbs]);

  const handleCustomChange = (type: 'protein' | 'fat' | 'carbs', value: string) => {
    const numValue = Math.min(Math.max(parseInt(value) || 0, 0), 100); // Clamp between 0-100
    setActive("custom");
    if (type === 'protein') setCustomProtein(numValue);
    else if (type === 'fat') setCustomFat(numValue);
    else setCustomCarbs(numValue);
  };

  const currentMacroDisplay = active === "custom" 
    ? `${customProtein}/${customFat}/${customCarbs}`
    : presets.find(p => p.id === active)?.split 
      ? `${presets.find(p => p.id === active)?.split.protein}/${presets.find(p => p.id === active)?.split.fat}/${presets.find(p => p.id === active)?.split.carbs}`
      : "0/0/0"; // Fallback

  return (
    <div className="mb-5">
      <p className="text-xs font-medium text-muted-foreground mb-2">{t("macroPresets.dietPreset")}</p>
      <div className="flex flex-wrap gap-2 mb-4">
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
        <button
          onClick={() => setActive("custom")}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95
            ${active === "custom"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "border border-input bg-background text-foreground hover:border-muted-foreground/30"
            }`}
        >
          {t("macroPresets.custom")}
          <span className="ml-1 opacity-60">
            {currentMacroDisplay}
          </span>
        </button>
      </div>

      {active === "custom" && (
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="custom-protein" className="text-xs text-muted-foreground mb-1 block">{t("results.protein")} (%)</Label>
            <Input 
              id="custom-protein" 
              type="number" 
              value={customProtein} 
              onChange={(e) => handleCustomChange('protein', e.target.value)} 
              min={0} max={100} 
              className="text-center"
            />
          </div>
          <div>
            <Label htmlFor="custom-fat" className="text-xs text-muted-foreground mb-1 block">{t("results.fat")} (%)</Label>
            <Input 
              id="custom-fat" 
              type="number" 
              value={customFat} 
              onChange={(e) => handleCustomChange('fat', e.target.value)} 
              min={0} max={100} 
              className="text-center"
            />
          </div>
          <div>
            <Label htmlFor="custom-carbs" className="text-xs text-muted-foreground mb-1 block">{t("results.carbs")} (%)</Label>
            <Input 
              id="custom-carbs" 
              type="number" 
              value={customCarbs} 
              onChange={(e) => handleCustomChange('carbs', e.target.value)} 
              min={0} max={100} 
              className="text-center"
            />
          </div>
        </div>
      )}
    </div>
  );
}