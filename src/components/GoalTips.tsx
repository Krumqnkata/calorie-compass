import { Goal } from "./CalorieCalculator";
import { Lightbulb } from "lucide-react";

interface Props {
  goal: Goal;
  targetCalories: number;
  protein: number;
}

const tips: Record<Goal, string[]> = {
  lose: [
    "Aim for a 500 cal deficit — that's ~0.45 kg (1 lb) lost per week.",
    "Prioritize protein to preserve muscle mass during your cut.",
    "Eat slowly and drink water before meals to feel full sooner.",
    "Track your intake for at least a week to build awareness.",
    "Sleep 7–9 hours — poor sleep increases hunger hormones.",
  ],
  maintain: [
    "You're fueling at maintenance — great for body recomposition.",
    "Focus on whole foods for micronutrient density.",
    "Strength train 3–4× per week to maintain lean mass.",
    "Stay consistent — small daily habits beat occasional perfection.",
    "Reassess every 4–6 weeks as your activity changes.",
  ],
  build: [
    "A 500 cal surplus supports lean muscle gain of ~0.25 kg/week.",
    "Hit your protein target every day — it's the #1 muscle-building factor.",
    "Progressive overload in the gym drives growth, not just food.",
    "Spread protein across 4 meals for optimal muscle protein synthesis.",
    "Don't rush — gaining too fast leads to excess fat, not more muscle.",
  ],
};

export function GoalTips({ goal }: Props) {
  const goalTips = tips[goal];

  return (
    <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-4 w-4 text-amber" />
        <h3 className="text-sm font-medium text-muted-foreground">
          Tips for {goal === "lose" ? "Weight Loss" : goal === "build" ? "Muscle Building" : "Maintenance"}
        </h3>
      </div>
      <ul className="space-y-2.5">
        {goalTips.map((tip, i) => (
          <li key={i} className="flex gap-3 text-sm text-foreground">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-light text-primary text-xs font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
