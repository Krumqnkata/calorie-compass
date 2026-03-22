import { useState, useRef } from "react";
import { CalculatorForm } from "./CalculatorForm";
import { CalculatorResults } from "./CalculatorResults";
import { ResultsHistory } from "./ResultsHistory";

export type Gender = "male" | "female";
export type Goal = "lose" | "maintain" | "build";
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
}

function loadHistory(): Results[] {
  try {
    return JSON.parse(localStorage.getItem("calorie-history") || "[]");
  } catch {
    return [];
  }
}

function saveHistory(history: Results[]) {
  localStorage.setItem("calorie-history", JSON.stringify(history));
}

export function CalorieCalculator() {
  const [results, setResults] = useState<Results | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [history, setHistory] = useState<Results[]>(loadHistory);
  const resultsRef = useRef<HTMLDivElement>(null);

  const calculate = (data: FormData) => {
    let weightKg = parseFloat(data.weight);
    let heightCm = parseFloat(data.height);
    const age = parseInt(data.age);
    const multiplier = parseFloat(data.activityLevel);

    if (data.unitSystem === "imperial") {
      weightKg = weightKg * 0.453592;
      const feet = parseFloat(data.heightFeet) || 0;
      const inches = parseFloat(data.heightInches) || 0;
      heightCm = (feet * 12 + inches) * 2.54;
    }

    const bmr =
      data.gender === "male"
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

    const tdee = bmr * multiplier;
    const targetCalories =
      data.goal === "lose" ? tdee - 500 : data.goal === "build" ? tdee + 500 : tdee;

    const bmi = weightKg / ((heightCm / 100) ** 2);
    const protein = (targetCalories * 0.3) / 4;
    const fat = (targetCalories * 0.3) / 9;
    const carbs = (targetCalories * 0.4) / 4;
    const waterLiters = Math.round((weightKg * 35) / 100) / 10;
    const heightM = heightCm / 100;
    const idealWeightLow = Math.round(18.5 * heightM * heightM);
    const idealWeightHigh = Math.round(24.9 * heightM * heightM);

    const newResults: Results = {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      bmi: Math.round(bmi * 10) / 10,
      protein: Math.round(protein),
      fat: Math.round(fat),
      carbs: Math.round(carbs),
      waterLiters,
      goal: data.goal,
      weightKg: Math.round(weightKg * 10) / 10,
      idealWeightLow,
      idealWeightHigh,
      timestamp: Date.now(),
    };

    setResults(newResults);
    setShowResults(true);

    const newHistory = [newResults, ...history].slice(0, 10);
    setHistory(newHistory);
    saveHistory(newHistory);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("calorie-history");
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:py-16">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-light px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Calorie & TDEE Calculator
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance leading-[1.1]">
            Know your numbers,
            <br />
            fuel your goals
          </h1>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Calculate your daily calorie needs, macros, water intake, and more — personalized to your body and lifestyle.
          </p>
        </header>

        <CalculatorForm onCalculate={calculate} />

        {showResults && results && (
          <div ref={resultsRef} className="mt-8 opacity-0 animate-fade-in-up">
            <CalculatorResults results={results} />
          </div>
        )}

        {history.length > 1 && (
          <div className="mt-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <ResultsHistory history={history} onClear={clearHistory} />
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
