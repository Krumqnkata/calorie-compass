import { useState, useRef } from "react";
import { CalculatorForm } from "./CalculatorForm";
import { CalculatorResults } from "./CalculatorResults";
import { ResultsHistory } from "./ResultsHistory";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  calculateBMI,
  calculateMacros,
  calculateWaterIntake,
  calculateIdealWeightRange,
  convertImperialToMetric,
  Gender,
  Goal,
} from "@/lib/calculations";

export type { Gender, Goal };
export type ActivityLevel = "1.2" | "1.375" | "1.55" | "1.725" | "1.9";
export type UnitSystem = "metric" | "imperial";

export interface FormData {
  gender: Gender;
  age: string;
  weight: string;
  height: string;
  heightFeet: string;
  heightInches: string;
  goal: Goal;
  activityLevel: ActivityLevel;
  unitSystem: UnitSystem;
  bodyFatPercent: string;
  // New measurement fields (optional)
  neck: string;
  waist: string;
  hip: string;
  chest: string;
}

export interface Results {
  bmr: number;
  tdee: number;
  targetCalories: number;
  bmi: number;
  protein: number;
  fat: number;
  carbs: number;
  waterLiters: number;
  goal: Goal;
  weightKg: number;
  idealWeightLow: number;
  idealWeightHigh: number;
  timestamp: number;
  // New measurement fields saved in history
  neck?: number;
  waist?: number;
  hip?: number;
  chest?: number;
}

export function CalorieCalculator() {
  const [results, setResults] = useState<Results | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [history, setHistory] = useLocalStorage<Results[]>("calorie-history", []);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const calculate = (data: FormData) => {
    let weightKg = parseFloat(data.weight);
    let heightCm = parseFloat(data.height);
    const age = parseInt(data.age);
    const multiplier = parseFloat(data.activityLevel);

    if (data.unitSystem === "imperial") {
      const metric = convertImperialToMetric(
        weightKg,
        parseFloat(data.heightFeet) || 0,
        parseFloat(data.heightInches) || 0
      );
      weightKg = metric.weightKg;
      heightCm = metric.heightCm;
    }

    const bmr = calculateBMR(data.gender, weightKg, heightCm, age);
    const tdee = calculateTDEE(bmr, multiplier);
    const targetCalories = calculateTargetCalories(tdee, data.goal);
    const bmi = calculateBMI(weightKg, heightCm);
    const macros = calculateMacros(targetCalories);
    const waterLiters = calculateWaterIntake(weightKg);
    const idealWeight = calculateIdealWeightRange(heightCm);

    const newResults: Results = {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      bmi: Math.round(bmi * 10) / 10,
      protein: Math.round(macros.protein),
      fat: Math.round(macros.fat),
      carbs: Math.round(macros.carbs),
      waterLiters,
      goal: data.goal,
      weightKg: Math.round(weightKg * 10) / 10,
      idealWeightLow: idealWeight.min,
      idealWeightHigh: idealWeight.max,
      timestamp: Date.now(),
      neck: parseFloat(data.neck) || undefined,
      waist: parseFloat(data.waist) || undefined,
      hip: parseFloat(data.hip) || undefined,
      chest: parseFloat(data.chest) || undefined,
    };

    setResults(newResults);
    setShowResults(true);

    const newHistory = [newResults, ...history].slice(0, 10);
    setHistory(newHistory);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const importHistory = (imported: Results[]) => {
    // Merge or replace? Let's prepend and dedup by timestamp
    const existingTimestamps = new Set(history.map(h => h.timestamp));
    const newItems = imported.filter(i => !existingTimestamps.has(i.timestamp));
    
    if (newItems.length === 0) return;

    const merged = [...newItems, ...history].sort((a, b) => b.timestamp - a.timestamp).slice(0, 50); // Keep last 50
    setHistory(merged);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:py-16">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-light px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {t("home.badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance leading-[1.1]">
            {t("home.title1")}
            <br />
            {t("home.title2")}
          </h1>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            {t("home.subtitle")}
          </p>
        </header>

        <CalculatorForm onCalculate={calculate} />

        {showResults && results && (
          <div ref={resultsRef} className="mt-8 opacity-0 animate-fade-in-up">
            <CalculatorResults results={results} />
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <ResultsHistory history={history} onClear={clearHistory} onImport={importHistory} />
          </div>
        )}
      </div>
    </div>
  );
}
