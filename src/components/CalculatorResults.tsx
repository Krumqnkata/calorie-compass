import { Results } from "./CalorieCalculator";
import { MacroChart } from "./MacroChart";
import { MealBreakdown } from "./MealBreakdown";
import { GoalTips } from "./GoalTips";
import { AnimatedNumber } from "./AnimatedNumber";
import { PdfExportButton } from "./PdfExportButton";
import { Droplets, Heart, Target, Scale, Dumbbell, TrendingDown, TrendingUp } from "lucide-react";

interface Props {
  results: Results;
}

export function CalculatorResults({ results }: Props) {
  const goalIcon = results.goal === "lose" ? <TrendingDown className="h-5 w-5" /> : results.goal === "build" ? <TrendingUp className="h-5 w-5" /> : <Target className="h-5 w-5" />;
  const goalLabel = results.goal === "lose" ? "Deficit" : results.goal === "build" ? "Surplus" : "Maintenance";

  return (
    <div className="space-y-6">
      {/* Target Calories */}
      <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-emerald-light px-3 py-1 text-xs font-medium text-primary">
          {goalIcon}
          {goalLabel}
        </div>
        <p className="text-sm font-medium text-muted-foreground mb-1">Target Daily Calories</p>
        <p className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground tabular-nums">
          <AnimatedNumber value={results.targetCalories} />
        </p>
        <p className="text-sm text-muted-foreground mt-1">kcal / day</p>
        {results.goal !== "maintain" && (
          <p className="text-xs text-muted-foreground mt-2">
            TDEE: {results.tdee.toLocaleString()} kcal {results.goal === "lose" ? "− 500" : "+ 500"}
          </p>
        )}
      </div>

      {/* Macros */}
      <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground mb-6">Macronutrient Split</h3>
        <div className="flex flex-col sm:flex-row gap-8 items-center">
          <div className="w-48 h-48 flex-shrink-0">
            <MacroChart protein={results.protein} fat={results.fat} carbs={results.carbs} />
          </div>
          <div className="flex-1 w-full space-y-5">
            <MacroRow label="Protein" grams={results.protein} percent={30} color="bg-primary" barBg="bg-emerald-light" cals={results.protein * 4} />
            <MacroRow label="Fat" grams={results.fat} percent={30} color="bg-amber" barBg="bg-amber-light" cals={results.fat * 9} />
            <MacroRow label="Carbs" grams={results.carbs} percent={40} color="bg-sky" barBg="bg-sky-light" cals={results.carbs * 4} />
          </div>
        </div>
      </div>

      {/* Meal Breakdown */}
      <MealBreakdown targetCalories={results.targetCalories} protein={results.protein} fat={results.fat} carbs={results.carbs} />

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard icon={<Heart className="h-4 w-4 text-primary" />} label="BMR" value={results.bmr.toLocaleString()} unit="kcal" />
        <MetricCard icon={<Scale className="h-4 w-4 text-amber" />} label="BMI" value={`${results.bmi}`} unit={bmiCategory(results.bmi)} />
        <MetricCard icon={<Droplets className="h-4 w-4 text-sky" />} label="Water" value={`${results.waterLiters}`} unit="liters / day" />
        <MetricCard icon={<Dumbbell className="h-4 w-4 text-primary" />} label="Ideal Weight" value={`${results.idealWeightLow}–${results.idealWeightHigh}`} unit="kg" />
      </div>

      {/* BMI Visual Bar */}
      <BmiBar bmi={results.bmi} />

      {/* Tips */}
      <GoalTips goal={results.goal} targetCalories={results.targetCalories} protein={results.protein} />

      {/* PDF Export */}
      <PdfExportButton results={results} />
    </div>
  );
}

function MacroRow({
  label,
  grams,
  percent,
  color,
  barBg,
  cals,
}: {
  label: string;
  grams: number;
  percent: number;
  color: string;
  barBg: string;
  cals: number;
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
        <div
          className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
          style={{ width: `${percent}%` }}
        />
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

function BmiBar({ bmi }: { bmi: number }) {
  // BMI scale: 15 to 40
  const position = Math.min(Math.max(((bmi - 15) / 25) * 100, 0), 100);
  const segments = [
    { label: "Underweight", range: "< 18.5", width: "14%", color: "bg-sky" },
    { label: "Normal", range: "18.5–24.9", width: "26%", color: "bg-primary" },
    { label: "Overweight", range: "25–29.9", width: "20%", color: "bg-amber" },
    { label: "Obese", range: "30+", width: "40%", color: "bg-destructive" },
  ];

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex justify-between items-baseline mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">BMI Scale</h3>
        <span className="text-sm font-bold tabular-nums text-foreground">{bmi}</span>
      </div>
      <div className="relative">
        <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
          {segments.map((seg) => (
            <div key={seg.label} className={`${seg.color} opacity-80`} style={{ width: seg.width }} />
          ))}
        </div>
        <div
          className="absolute top-0 w-3 h-3 rounded-full bg-foreground border-2 border-card shadow-md transition-all duration-700"
          style={{ left: `calc(${position}% - 6px)` }}
        />
        <div className="flex justify-between mt-2">
          {segments.map((seg) => (
            <span key={seg.label} className="text-[10px] text-muted-foreground">{seg.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}
