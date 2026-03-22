import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SampleMealPlan } from "@/components/SampleMealPlan";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MealPlanPage() {
  const { t } = useTranslation();
  const [calories, setCalories] = useState("2200");
  const cal = parseInt(calories) || 2200;

  const protein = Math.round((cal * 0.3) / 4);
  const fat = Math.round((cal * 0.3) / 9);
  const carbs = Math.round((cal * 0.4) / 4);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:py-16">
      <header className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          {t("mealPlanPage.pageTitle")}
        </h1>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          {t("mealPlanPage.pageSubtitle")}
        </p>
      </header>

      <div className="rounded-2xl border bg-card p-6 shadow-sm mb-6">
        <Label className="text-sm text-muted-foreground mb-2 block">{t("mealPlanPage.targetCalories")}</Label>
        <Input
          type="number"
          min="1000"
          max="6000"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          className="max-w-[200px]"
        />
      </div>

      <SampleMealPlan targetCalories={cal} protein={protein} fat={fat} carbs={carbs} />
    </div>
  );
}
