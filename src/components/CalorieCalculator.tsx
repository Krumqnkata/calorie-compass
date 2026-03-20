import { useState } from "react";
import { CalculatorForm } from "./CalculatorForm";
import { CalculatorResults } from "./CalculatorResults";

export type Gender = "male" | "female";
export type Goal = "lose" | "maintain" | "build";
export type ActivityLevel = "1.2" | "1.375" | "1.55" | "1.725" | "1.9";

export interface FormData {
  gender: Gender;
  age: string;
  weight: string;
  height: string;
  goal: Goal;
  activityLevel: ActivityLevel;
}

export interface Results {
  bmr: number;
  tdee: number;
  targetCalories: number;
  bmi: number;
  protein: number;
  fat: number;
  carbs: number;
}

export function CalorieCalculator() {
  const [results, setResults] = useState<Results | null>(null);
  const [showResults, setShowResults] = useState(false);

  const calculate = (data: FormData) => {
    const weight = parseFloat(data.weight);
    const height = parseFloat(data.height);
    const age = parseInt(data.age);
    const multiplier = parseFloat(data.activityLevel);

    const bmr =
      data.gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const tdee = bmr * multiplier;

    const targetCalories =
      data.goal === "lose"
        ? tdee - 500
        : data.goal === "build"
        ? tdee + 500
        : tdee;

    const bmi = weight / ((height / 100) ** 2);

    const protein = (targetCalories * 0.3) / 4;
    const fat = (targetCalories * 0.3) / 9;
    const carbs = (targetCalories * 0.4) / 4;

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      bmi: Math.round(bmi * 10) / 10,
      protein: Math.round(protein),
      fat: Math.round(fat),
      carbs: Math.round(carbs),
    });
    setShowResults(true);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:py-16">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-light px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Calorie & TDEE Calculator
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance leading-[1.1]">
            Know your numbers,
            <br />
            fuel your goals
          </h1>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Calculate your daily calorie needs and optimal macronutrient split based on your body and activity level.
          </p>
        </header>

        <CalculatorForm onCalculate={calculate} />

        {showResults && results && (
          <div className="mt-8 opacity-0 animate-fade-in-up">
            <CalculatorResults results={results} />
          </div>
        )}
      </div>
    </div>
  );
}
