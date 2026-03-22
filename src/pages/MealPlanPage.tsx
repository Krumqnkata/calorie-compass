import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { generateDailyPlan, DailyPlan, Meal } from "@/lib/meals.db";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Coffee, Sun, Sunset, Moon, RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Results } from "@/components/CalorieCalculator"; // Import Results interface

export default function MealPlanPage() {
  const { t, i18n } = useTranslation();
  
  // Get last targetCalories from localStorage
  const getLastTargetCalories = () => {
    try {
      const historyJson = localStorage.getItem("calorie-history");
      if (historyJson) {
        const history: Results[] = JSON.parse(historyJson);
        if (history.length > 0) {
          return history[0].targetCalories.toString();
        }
      }
    } catch (e) {
      console.error("Failed to load history from localStorage:", e);
    }
    return "2200"; // Default value
  };

  const [calories, setCalories] = useState(getLastTargetCalories);
  const [plan, setPlan] = useState<DailyPlan | null>(null);

  const cal = parseInt(calories) || 2200;

  useEffect(() => {
    handleGenerate(); // Generate initial plan based on loaded calories
  }, [cal]); // Re-generate if calorie target changes

  const handleGenerate = () => {
    setPlan(generateDailyPlan(cal));
  };

  const getMealName = (meal: Meal) => {
    return i18n.language === "bg" ? meal.name.bg : meal.name.en;
  };

  const MealCard = ({ meal, icon: Icon, title, getMealName }: { meal: Meal; icon: any; title: string; getMealName: (meal: Meal) => string }) => (
    <div className="rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">{title}</h3>
      </div>
      <div className="space-y-1">
        <p className="font-bold text-lg leading-tight">{getMealName(meal)}</p>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-2">
          <span className="bg-muted px-2 py-1 rounded-md text-foreground font-medium">{meal.calories} kcal</span>
          <span className="px-1">{meal.protein}g P</span>
          <span className="px-1">{meal.fat}g F</span>
          <span className="px-1">{meal.carbs}g C</span>
        </div>
      </div>
    </div>
  );

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

      <div className="rounded-2xl border bg-card p-6 shadow-sm mb-8 flex flex-col sm:flex-row items-end gap-4">
        <div className="w-full">
          <Label className="text-sm text-muted-foreground mb-2 block">{t("mealPlanPage.targetCalories")}</Label>
          <Input
            type="number"
            min="1000"
            max="6000"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="w-full"
          />
        </div>
        <Button onClick={handleGenerate} className="w-full sm:w-auto" size="lg">
          <RefreshCw className="mr-2 h-4 w-4" />
          {t("sampleMealPlan.regenerate")}
        </Button>
      </div>

      {plan && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="grid gap-4 sm:grid-cols-2">
            <MealCard meal={plan.breakfast} icon={Coffee} title={t("mealBreakdown.breakfast")} getMealName={getMealName} />
            <MealCard meal={plan.lunch} icon={Sun} title={t("mealBreakdown.lunch")} getMealName={getMealName} />
            <MealCard meal={plan.snack} icon={Sunset} title={t("mealBreakdown.snack")} getMealName={getMealName} />
            <MealCard meal={plan.dinner} icon={Moon} title={t("mealBreakdown.dinner")} getMealName={getMealName} />
          </div>

          <div className="rounded-xl bg-muted/50 p-6 border text-center">
            <p className="text-sm font-medium text-muted-foreground mb-2">Total Daily Intake</p>
            <div className="flex justify-center items-center gap-6">
              <div className="text-center">
                <span className="block text-2xl font-bold text-foreground">{plan.totalCalories}</span>
                <span className="text-xs text-muted-foreground">kcal</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <span className="block text-xl font-bold text-foreground">{plan.totalProtein}g</span>
                <span className="text-xs text-muted-foreground">Protein</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold text-foreground">{plan.totalFat}g</span>
                <span className="text-xs text-muted-foreground">Fat</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold text-foreground">{plan.totalCarbs}g</span>
                <span className="text-xs text-muted-foreground">Carbs</span>
              </div>
            </div>
            
            {Math.abs(plan.totalCalories - cal) > 200 && (
               <Alert className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <AlertTitle className="text-yellow-800 dark:text-yellow-300">Calorie Mismatch</AlertTitle>
                <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                  This plan is {Math.abs(plan.totalCalories - cal)} kcal {plan.totalCalories > cal ? "over" : "under"} your target. Adjust portion sizes accordingly.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
