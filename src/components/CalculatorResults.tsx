import { useState } from "react";
import { Results } from "./CalorieCalculator";
import { MacroChart } from "./MacroChart";
import { MealBreakdown } from "./MealBreakdown";
import { GoalTips } from "./GoalTips";
import { AnimatedNumber } from "./AnimatedNumber";
import { PdfExportButton } from "./PdfExportButton";
import { MacroPresets, MacroSplit } from "./MacroPresets";
import { SampleMealPlan } from "./SampleMealPlan";
import { BMIGauge } from "./BMIGauge";
import { ZigZagScheduler } from "./ZigZagScheduler";
import { Droplets, Heart, Target, Scale, Dumbbell, TrendingDown, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  results: Results;
}

export function CalculatorResults({ results }: Props) {
  const { t } = useTranslation();
  const [macros, setMacros] = useState({
    split: { protein: 30, fat: 30, carbs: 40 } as MacroSplit,
    protein: results.protein,
    fat: results.fat,
    carbs: results.carbs,
  });

  const goalIcon = results.goal === "lose" ? <TrendingDown className="h-5 w-5" /> : results.goal === "build" ? <TrendingUp className="h-5 w-5" /> : <Target className="h-5 w-5" />;
  const goalLabel = results.goal === "lose" ? t("results.deficit") : results.goal === "build" ? t("results.surplus") : t("results.maintenance");

  const handleSplitChange = (_split: MacroSplit, proteinG: number, fatG: number, carbsG: number) => {
    setMacros({ split: _split, protein: proteinG, fat: fatG, carbs: carbsG });
  };

  const bmiCategory = (bmi: number): string => {
    if (bmi < 18.5) return t("results.underweight");
    if (bmi < 25) return t("results.normal");
    if (bmi < 30) return t("results.overweight");
    return t("results.obese");
  };

  return (
    <div className="space-y-6">
      {/* Target Calories */}
      <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-emerald-light px-3 py-1 text-xs font-medium text-primary">
          {goalIcon}
          {goalLabel}
        </div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{t("results.targetDaily")}</p>
        <p className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground tabular-nums">
          <AnimatedNumber value={results.targetCalories} />
        </p>
        <p className="text-sm text-muted-foreground mt-1">{t("results.kcalDay")}</p>
        {results.goal !== "maintain" && (
          <p className="text-xs text-muted-foreground mt-2">
            TDEE: {results.tdee.toLocaleString()} kcal {results.goal === "lose" ? "− 500" : "+ 500"}
          </p>
        )}
      </div>

      {/* Macros with presets */}
      <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">{t("results.macroSplit")}</h3>
        <MacroPresets targetCalories={results.targetCalories} onSplitChange={handleSplitChange} />
        <div className="flex flex-col sm:flex-row gap-8 items-center">
          <div className="w-48 h-48 flex-shrink-0">
            <MacroChart protein={macros.protein} fat={macros.fat} carbs={macros.carbs} />
          </div>
          <div className="flex-1 w-full space-y-5">
            <MacroRow label={t("results.protein")} grams={macros.protein} percent={macros.split.protein} color="bg-primary" barBg="bg-emerald-light" cals={macros.protein * 4} />
            <MacroRow label={t("results.fat")} grams={macros.fat} percent={macros.split.fat} color="bg-amber" barBg="bg-amber-light" cals={macros.fat * 9} />
            <MacroRow label={t("results.carbs")} grams={macros.carbs} percent={macros.split.carbs} color="bg-sky" barBg="bg-sky-light" cals={macros.carbs * 4} />
          </div>
        </div>
      </div>

      {/* Meal Breakdown */}
      <MealBreakdown targetCalories={results.targetCalories} protein={macros.protein} fat={macros.fat} carbs={macros.carbs} />

      {/* Sample Meal Plan */}
      <SampleMealPlan targetCalories={results.targetCalories} protein={macros.protein} fat={macros.fat} carbs={macros.carbs} />

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard icon={<Heart className="h-4 w-4 text-primary" />} label={t("results.bmr")} value={results.bmr.toLocaleString()} unit={t("common.kcal")} />
        <MetricCard icon={<Scale className="h-4 w-4 text-amber" />} label={t("results.bmi")} value={`${results.bmi}`} unit={bmiCategory(results.bmi)} />
        <MetricCard icon={<Droplets className="h-4 w-4 text-sky" />} label={t("results.water")} value={`${results.waterLiters}`} unit={t("results.litersDay")} />
        <MetricCard icon={<Dumbbell className="h-4 w-4 text-primary" />} label={t("results.idealWeight")} value={`${results.idealWeightLow}–${results.idealWeightHigh}`} unit={t("common.kg")} />
      </div>

      {/* BMI Gauge */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">{t("results.bmiScale")}</h3>
        <BMIGauge bmi={results.bmi} />
      </div>

      {/* ZigZag Scheduler */}
      {results.goal === "lose" && ( // Only show for losing weight goal
        <ZigZagScheduler targetCalories={results.targetCalories} />
      )}

      {/* Tips */}
      <GoalTips goal={results.goal} targetCalories={results.targetCalories} protein={macros.protein} />

      {/* PDF Export */}
      <PdfExportButton results={results} />
    </div>
  );
}

function MacroRow({ label, grams, percent, color, barBg, cals }: {
  label: string; grams: number; percent: number; color: string; barBg: string; cals: number;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm tabular-nums text-muted-foreground">
          {grams}g · {Math.round(cals)} kcal <span className="text-xs">({percent}%)</span>
        </span>
      </div>
      <div className={`h-2.5 rounded-full ${barBg}`}>
        <div className={`h-full rounded-full ${color} transition-all duration-700 ease-out`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: string; unit: string }) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-1.5 mb-2">
        {icon}
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      </div>
      <p className="text-xl font-bold tabular-nums text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{unit}</p>
    </div>
  );
}
