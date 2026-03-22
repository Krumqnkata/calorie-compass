export interface Meal {
  id: string;
  name: { en: string; bg: string };
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  type: "breakfast" | "lunch" | "dinner" | "snack";
}

export const meals: Meal[] = [
  // Breakfasts
  { id: "b1", name: { en: "Oatmeal with Berries", bg: "Овесени ядки с плодове" }, calories: 350, protein: 12, fat: 6, carbs: 60, type: "breakfast" },
  { id: "b2", name: { en: "Scrambled Eggs on Toast", bg: "Бъркани яйца върху препечен хляб" }, calories: 400, protein: 22, fat: 20, carbs: 30, type: "breakfast" },
  { id: "b3", name: { en: "Greek Yogurt Parfait", bg: "Парфе с гръцко кисело мляко" }, calories: 300, protein: 18, fat: 5, carbs: 40, type: "breakfast" },
  { id: "b4", name: { en: "Avocado Toast with Egg", bg: "Тост с авокадо и яйце" }, calories: 450, protein: 16, fat: 25, carbs: 35, type: "breakfast" },
  { id: "b5", name: { en: "Protein Pancakes", bg: "Протеинови палачинки" }, calories: 500, protein: 35, fat: 12, carbs: 55, type: "breakfast" },

  // Lunches
  { id: "l1", name: { en: "Chicken Caesar Salad", bg: "Салата Цезар с пилешко" }, calories: 550, protein: 40, fat: 30, carbs: 20, type: "lunch" },
  { id: "l2", name: { en: "Tuna Wrap", bg: "Врап с риба тон" }, calories: 450, protein: 35, fat: 15, carbs: 45, type: "lunch" },
  { id: "l3", name: { en: "Quinoa Bowl with Veggies", bg: "Купа с киноа и зеленчуци" }, calories: 500, protein: 15, fat: 18, carbs: 65, type: "lunch" },
  { id: "l4", name: { en: "Turkey Sandwich", bg: "Сандвич с пуешко" }, calories: 400, protein: 28, fat: 10, carbs: 45, type: "lunch" },
  { id: "l5", name: { en: "Lentil Soup with Bread", bg: "Леща с хляб" }, calories: 450, protein: 20, fat: 10, carbs: 60, type: "lunch" },

  // Dinners
  { id: "d1", name: { en: "Grilled Salmon with Asparagus", bg: "Печена сьомга с аспержи" }, calories: 600, protein: 45, fat: 35, carbs: 10, type: "dinner" },
  { id: "d2", name: { en: "Beef Stir-Fry", bg: "Телешко със зеленчуци на тиган" }, calories: 650, protein: 50, fat: 25, carbs: 40, type: "dinner" },
  { id: "d3", name: { en: "Chicken Breast with Rice", bg: "Пилешки гърди с ориз" }, calories: 550, protein: 45, fat: 10, carbs: 65, type: "dinner" },
  { id: "d4", name: { en: "Vegetarian Chili", bg: "Вегетарианско чили" }, calories: 500, protein: 20, fat: 15, carbs: 60, type: "dinner" },
  { id: "d5", name: { en: "Pasta Bolognese", bg: "Паста Болонезе" }, calories: 700, protein: 30, fat: 25, carbs: 80, type: "dinner" },

  // Snacks
  { id: "s1", name: { en: "Apple with Almond Butter", bg: "Ябълка с бадемово масло" }, calories: 200, protein: 4, fat: 12, carbs: 20, type: "snack" },
  { id: "s2", name: { en: "Protein Shake", bg: "Протеинов шейк" }, calories: 150, protein: 25, fat: 2, carbs: 5, type: "snack" },
  { id: "s3", name: { en: "Mixed Nuts", bg: "Микс ядки" }, calories: 250, protein: 8, fat: 22, carbs: 8, type: "snack" },
  { id: "s4", name: { en: "Cottage Cheese with Fruit", bg: "Извара с плодове" }, calories: 200, protein: 15, fat: 5, carbs: 20, type: "snack" },
  { id: "s5", name: { en: "Hummus with Carrots", bg: "Хумус с моркови" }, calories: 180, protein: 6, fat: 10, carbs: 15, type: "snack" },
];

export interface DailyPlan {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snack: Meal; // Assuming 1 snack for simplicity, could be array
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
}

/**
 * Randomly selects meals to approximate target calories.
 * A simple greedy approach or random sampling.
 */
export function generateDailyPlan(targetCalories: number): DailyPlan {
  // Filter meals by type
  const breakfasts = meals.filter(m => m.type === "breakfast");
  const lunches = meals.filter(m => m.type === "lunch");
  const dinners = meals.filter(m => m.type === "dinner");
  const snacks = meals.filter(m => m.type === "snack");

  // Simple random selection for now
  // Ideally, this would use a knapsack-like algorithm or constraints solver,
  // but for a simple "suggestion" tool, randomizing within categories is okay 
  // and then maybe scaling or suggesting multiple snacks could be advanced.
  // Let's stick to 1 of each main meal + 1 snack.

  const breakfast = breakfasts[Math.floor(Math.random() * breakfasts.length)];
  const lunch = lunches[Math.floor(Math.random() * lunches.length)];
  const dinner = dinners[Math.floor(Math.random() * dinners.length)];
  let snack = snacks[Math.floor(Math.random() * snacks.length)];

  let totalCalories = breakfast.calories + lunch.calories + dinner.calories + snack.calories;
  
  // Very basic adjustment: if way under, add another snack or pick bigger meals (future improvement)
  // For now, we return what we found and the UI can show the gap.

  return {
    breakfast,
    lunch,
    dinner,
    snack,
    totalCalories,
    totalProtein: breakfast.protein + lunch.protein + dinner.protein + snack.protein,
    totalFat: breakfast.fat + lunch.fat + dinner.fat + snack.fat,
    totalCarbs: breakfast.carbs + lunch.carbs + dinner.carbs + snack.carbs,
  };
}
