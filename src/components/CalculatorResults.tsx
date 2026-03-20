import { Results } from "./CalorieCalculator";
import { MacroChart } from "./MacroChart";

interface Props {
  results: Results;
}

export function CalculatorResults({ results }: Props) {
  return (
    <div className="space-y-6">
      {/* Target Calories */}
      <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm text-center">
        <p className="text-sm font-medium text-muted-foreground mb-1">Target Daily Calories</p>
        <p className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground tabular-nums">
          {results.targetCalories.toLocaleString()}
        </p>
        <p className="text-sm text-muted-foreground mt-1">kcal / day</p>
      </div>

      {/* Macros */}
      <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground mb-6">Macronutrient Split</h3>
        <div className="flex flex-col sm:flex-row gap-8 items-center">
          <div className="w-48 h-48 flex-shrink-0">
            <MacroChart protein={results.protein} fat={results.fat} carbs={results.carbs} />
          </div>
          <div className="flex-1 w-full space-y-5">
            <MacroRow label="Protein" grams={results.protein} percent={30} color="bg-primary" barBg="bg-emerald-light" />
            <MacroRow label="Fat" grams={results.fat} percent={30} color="bg-amber" barBg="bg-amber-light" />
            <MacroRow label="Carbs" grams={results.carbs} percent={40} color="bg-sky" barBg="bg-sky-light" />
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard label="BMR" value={`${results.bmr.toLocaleString()}`} unit="kcal" />
        <MetricCard label="BMI" value={`${results.bmi}`} unit={bmiCategory(results.bmi)} />
      </div>
    </div>
  );
}

function MacroRow({
  label,
  grams,
  percent,
  color,
  barBg,
}: {
  label: string;
  grams: number;
  percent: number;
  color: string;
  barBg: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm tabular-nums text-muted-foreground">
          {grams}g <span className="text-xs">({percent}%)</span>
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

function MetricCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold tabular-nums text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{unit}</p>
    </div>
  );
}

function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}
