import * as z from "zod";

export const calculatorFormSchema = z.object({
  gender: z.enum(["male", "female"]),
  age: z.coerce.number().min(1, "Required").max(120, "Invalid age"),
  weight: z.coerce.number().min(1, "Required"),
  height: z.coerce.number().optional(), // For metric
  heightFeet: z.coerce.number().optional(), // For imperial
  heightInches: z.coerce.number().optional(), // For imperial
  unitSystem: z.enum(["metric", "imperial"]),
  activityLevel: z.enum(["1.2", "1.375", "1.55", "1.725", "1.9"]),
  goal: z.enum(["lose", "maintain", "build"]),
  bodyFatPercent: z.coerce.number().min(0).max(100).optional(),
  // Optional measurement fields
  neck: z.coerce.number().min(0).optional(),
  waist: z.coerce.number().min(0).optional(),
  hip: z.coerce.number().min(0).optional(),
  chest: z.coerce.number().min(0).optional(),
}).refine((data) => {
  if (data.unitSystem === "metric") {
    return !!data.height && data.height > 0;
  } else {
    return (!!data.heightFeet && data.heightFeet > 0) || (!!data.heightInches && data.heightInches >= 0);
  }
}, {
  message: "Height is required",
  path: ["height"], // Attach error to height field generally
});

export type CalculatorFormValues = z.infer<typeof calculatorFormSchema>;
