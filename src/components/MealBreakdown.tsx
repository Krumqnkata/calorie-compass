import { Coffee, Sun, Sunset, Moon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  targetCalories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export function MealBreakdown({ targetCalories, protein, fat, carbs }: Props) {
  const { t } = useTranslation();

  const meals = [
    { nameKey: "mealBreakdown.breakfast", icon: Coffee, percent: 0.25, time: "7–9 AM" },
    { nameKey: "mealBreakdown.lunch", icon: Sun, percent: 0.35, time: "12–2 PM" },
    { nameKey: "mealBreakdown.snack", icon: Sunset, percent: 0.10, time: "3–4 PM" },
    { nameKey: "mealBreakdown.dinner", icon: Moon, percent: 0.30, time: "6–8 PM" },
  ];

  return (
    <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground mb-5">{t("mealBreakdown.title")}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {meals.map((meal) => {
          const cals = Math.round(targetCalories * meal.percent);
          const Icon = meal.icon;
          return (
            <div key={meal.nameKey} className="rounded-xl border bg-background p-4 text-center">
              <Icon className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-sm font-semibold text-foreground">{t(meal.nameKey)}</p>
              <p className="text-xs text-muted-foreground mb-2">{meal.time}</p>
              <p className="text-lg font-bold tabular-nums text-foreground">{cals}</p>
              <p className="text-[10px] text-muted-foreground mb-1">kcal</p>
              <div className="flex justify-center gap-2 text-[10px] text-muted-foreground">
                <span>P:{Math.round(protein * meal.percent)}g</span>
                <span>F:{Math.round(fat * meal.percent)}g</span>
                <span>C:{Math.round(carbs * meal.percent)}g</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
