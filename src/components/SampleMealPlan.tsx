import { useState } from "react";
import { Coffee, Sun, Sunset, Moon, RefreshCw } from "lucide-react";

interface Props {
  targetCalories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface MealItem {
  name: string;
  cal: number;
  prot: number;
  fat: number;
  carb: number;
}

const mealDb: Record<string, MealItem[]> = {
  breakfast: [
    { name: "Greek yogurt parfait with granola & berries", cal: 350, prot: 22, fat: 10, carb: 42 },
    { name: "Scrambled eggs (3) with whole-wheat toast & avocado", cal: 420, prot: 26, fat: 22, carb: 30 },
    { name: "Oatmeal with banana, peanut butter & honey", cal: 380, prot: 14, fat: 14, carb: 52 },
    { name: "Protein smoothie with spinach, banana & almond milk", cal: 310, prot: 28, fat: 8, carb: 36 },
    { name: "Cottage cheese pancakes with maple syrup", cal: 360, prot: 24, fat: 10, carb: 44 },
  ],
  lunch: [
    { name: "Grilled chicken salad with quinoa & vinaigrette", cal: 480, prot: 38, fat: 16, carb: 40 },
    { name: "Turkey & avocado whole-wheat wrap", cal: 440, prot: 30, fat: 18, carb: 42 },
    { name: "Salmon bowl with brown rice & steamed veggies", cal: 520, prot: 36, fat: 20, carb: 48 },
    { name: "Lentil soup with crusty bread & side salad", cal: 420, prot: 22, fat: 10, carb: 58 },
    { name: "Chicken stir-fry with mixed vegetables & rice", cal: 500, prot: 34, fat: 14, carb: 56 },
  ],
  dinner: [
    { name: "Baked salmon with sweet potato & asparagus", cal: 520, prot: 40, fat: 18, carb: 44 },
    { name: "Lean beef stir-fry with broccoli & brown rice", cal: 550, prot: 38, fat: 20, carb: 50 },
    { name: "Grilled chicken breast with roasted vegetables", cal: 450, prot: 42, fat: 14, carb: 30 },
    { name: "Pasta with turkey bolognese & side salad", cal: 520, prot: 34, fat: 16, carb: 58 },
    { name: "Tofu & vegetable curry with jasmine rice", cal: 480, prot: 22, fat: 18, carb: 56 },
  ],
  snack: [
    { name: "Apple slices with almond butter", cal: 200, prot: 6, fat: 14, carb: 18 },
    { name: "Protein bar & a handful of almonds", cal: 280, prot: 22, fat: 14, carb: 20 },
    { name: "Hummus with carrot & celery sticks", cal: 180, prot: 6, fat: 10, carb: 18 },
    { name: "Trail mix (nuts, seeds & dark chocolate)", cal: 250, prot: 8, fat: 16, carb: 20 },
    { name: "Rice cakes with cottage cheese & berries", cal: 190, prot: 12, fat: 4, carb: 28 },
  ],
};

const icons = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  snack: Sunset,
};

function pickRandom(arr: MealItem[]): MealItem {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePlan() {
  return {
    breakfast: pickRandom(mealDb.breakfast),
    lunch: pickRandom(mealDb.lunch),
    dinner: pickRandom(mealDb.dinner),
    snack: pickRandom(mealDb.snack),
  };
}

export function SampleMealPlan({ targetCalories }: Props) {
  const [plan, setPlan] = useState(generatePlan);

  const totalCal = plan.breakfast.cal + plan.lunch.cal + plan.dinner.cal + plan.snack.cal;
  const scale = targetCalories / totalCal;

  const meals = [
    { key: "breakfast", label: "Breakfast", time: "7–9 AM", item: plan.breakfast },
    { key: "lunch", label: "Lunch", time: "12–2 PM", item: plan.lunch },
    { key: "snack", label: "Snack", time: "3–4 PM", item: plan.snack },
    { key: "dinner", label: "Dinner", time: "6–8 PM", item: plan.dinner },
  ];

  return (
    <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-medium text-muted-foreground">Sample Meal Plan</h3>
        <button
          onClick={() => setPlan(generatePlan())}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:opacity-80 transition-opacity"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Regenerate
        </button>
      </div>
      <div className="space-y-3">
        {meals.map((m) => {
          const Icon = icons[m.key as keyof typeof icons];
          const cal = Math.round(m.item.cal * scale);
          const p = Math.round(m.item.prot * scale);
          const f = Math.round(m.item.fat * scale);
          const c = Math.round(m.item.carb * scale);
          return (
            <div key={m.key} className="rounded-xl border bg-background p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-emerald-light p-2 mt-0.5">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-foreground">{m.label}</span>
                    <span className="text-[10px] text-muted-foreground">{m.time}</span>
                    <span className="ml-auto text-sm font-bold tabular-nums text-foreground">{cal} kcal</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{m.item.name}</p>
                  <div className="flex gap-3 mt-1.5 text-[10px] text-muted-foreground">
                    <span className="text-primary font-medium">P: {p}g</span>
                    <span className="text-amber font-medium">F: {f}g</span>
                    <span className="text-sky font-medium">C: {c}g</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-muted-foreground text-center mt-4">
        Portions scaled to ~{targetCalories.toLocaleString()} kcal target. Actual values may vary.
      </p>
    </div>
  );
}
