export type Gender = "male" | "female";
export type Goal = "lose" | "maintain" | "build";

/**
 * Calculates Body Fat Percentage using the US Navy Method.
 * All measurements in cm.
 */
export function calculateBodyFat(
  gender: Gender,
  neck: number,
  waist: number,
  hip: number,
  height: number
): number {
  // Prevent log(0) or negative errors
  if (height <= 0 || neck <= 0 || waist <= 0) return 0;

  if (gender === "male") {
    // 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
    // Note: waist - neck must be > 0
    if (waist - neck <= 0) return 0;
    return (
      495 /
        (1.0324 -
          0.19077 * Math.log10(waist - neck) +
          0.15456 * Math.log10(height)) -
      450
    );
  } else {
    // 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
    if (waist + hip - neck <= 0) return 0;
    return (
      495 /
        (1.29579 -
          0.35004 * Math.log10(waist + hip - neck) +
          0.22100 * Math.log10(height)) -
      450
    );
  }
}

/**
 * Calculates BMR using the Mifflin-St Jeor Equation.
 * Weight in kg, height in cm.
 */
export function calculateBMR(
  gender: Gender,
  weight: number,
  height: number,
  age: number
): number {
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

export function calculateTDEE(bmr: number, activityMultiplier: number): number {
  return bmr * activityMultiplier;
}

export function calculateTargetCalories(tdee: number, goal: Goal): number {
  switch (goal) {
    case "lose":
      return tdee - 500;
    case "build":
      return tdee + 500;
    case "maintain":
    default:
      return tdee;
  }
}

export function calculateBMI(weight: number, heightCm: number): number {
  if (heightCm <= 0) return 0;
  return weight / Math.pow(heightCm / 100, 2);
}

export function calculateIdealWeightRange(heightCm: number): {
  min: number;
  max: number;
} {
  const heightM = heightCm / 100;
  return {
    min: Math.round(18.5 * heightM * heightM),
    max: Math.round(24.9 * heightM * heightM),
  };
}

export function calculateWaterIntake(weightKg: number): number {
  // 35ml per kg
  return Math.round((weightKg * 35) / 100) / 10;
}

export function calculateMacros(targetCalories: number) {
  return {
    protein: (targetCalories * 0.3) / 4,
    fat: (targetCalories * 0.3) / 9,
    carbs: (targetCalories * 0.4) / 4,
  };
}

export function convertImperialToMetric(
  weightLbs: number,
  feet: number,
  inches: number
) {
  return {
    weightKg: weightLbs * 0.453592,
    heightCm: (feet * 12 + inches) * 2.54,
  };
}

/**
 * Calculates One Rep Max (1RM) using multiple formulas.
 * Weight in any unit (kg/lbs), reps > 0.
 */
export function calculateOneRepMax(weight: number, reps: number) {
  if (reps <= 0 || weight <= 0) return { epley: 0, brzycki: 0, average: 0 };
  if (reps === 1) return { epley: weight, brzycki: weight, average: weight };

  // Epley Formula: w * (1 + r/30)
  const epley = weight * (1 + reps / 30);

  // Brzycki Formula: w / (1.0278 - 0.0278 * r)
  // Note: Brzycki is less accurate for high reps (>10)
  const brzycki = weight / (1.0278 - 0.0278 * reps);

  return {
    epley: Math.round(epley),
    brzycki: Math.round(brzycki),
    average: Math.round((epley + brzycki) / 2),
  };
}
