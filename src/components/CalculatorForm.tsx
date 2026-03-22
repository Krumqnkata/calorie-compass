import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormData, Gender, Goal, ActivityLevel, UnitSystem } from "./CalorieCalculator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ruler, Weight, Calendar, Flame, UserRound } from "lucide-react"; // Import Body icon for measurements
import { useTranslation } from "react-i18next";
import { calculatorFormSchema, CalculatorFormValues } from "@/lib/schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"; // For collapsible section

interface Props {
  onCalculate: (data: FormData) => void;
}

export function CalculatorForm({ onCalculate }: Props) {
  const { t } = useTranslation();

  const activityOptions: { value: ActivityLevel; labelKey: string; descKey: string; multiplier: string }[] = [
    { value: "1.2", labelKey: "form.sedentary", descKey: "form.sedentaryDesc", multiplier: "×1.2" },
    { value: "1.375", labelKey: "form.lightlyActive", descKey: "form.lightlyActiveDesc", multiplier: "×1.375" },
    { value: "1.55", labelKey: "form.moderatelyActive", descKey: "form.moderatelyActiveDesc", multiplier: "×1.55" },
    { value: "1.725", labelKey: "form.veryActive", descKey: "form.veryActiveDesc", multiplier: "×1.725" },
    { value: "1.9", labelKey: "form.extraActive", descKey: "form.extraActiveDesc", multiplier: "×1.9" },
  ];

  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorFormSchema),
    defaultValues: {
      gender: "male",
      age: 25,
      weight: 70,
      height: 175,
      heightFeet: 5,
      heightInches: 9,
      goal: "maintain",
      activityLevel: "1.55",
      unitSystem: "metric",
      bodyFatPercent: 0,
      neck: 0,
      waist: 0,
      hip: 0,
      chest: 0,
    },
  });

  const onSubmit = (data: CalculatorFormValues) => {
    // Map Zod values to the FormData interface expected by the parent
    // Note: Zod returns numbers, but legacy interface expects strings for some fields.
    // We should ideally update the parent interface, but for now we cast to string to maintain compatibility.
    const payload: FormData = {
      gender: data.gender,
      age: data.age.toString(),
      weight: data.weight.toString(),
      height: (data.height || 0).toString(),
      heightFeet: (data.heightFeet || 0).toString(),
      heightInches: (data.heightInches || 0).toString(),
      goal: data.goal,
      activityLevel: data.activityLevel,
      unitSystem: data.unitSystem,
      bodyFatPercent: (data.bodyFatPercent || "").toString(),
      neck: (data.neck || "").toString(),
      waist: (data.waist || "").toString(),
      hip: (data.hip || "").toString(),
      chest: (data.chest || "").toString(),
    };
    onCalculate(payload);
  };

  const isMetric = form.watch("unitSystem") === "metric";
  const bodyFat = form.watch("bodyFatPercent");
  const weight = form.watch("weight");

  return (
    <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Unit System */}
          <FormField
            control={form.control}
            name="unitSystem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.unitSystem")}</FormLabel>
                <div className="grid grid-cols-2 gap-3">
                  {(["metric", "imperial"] as UnitSystem[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => field.onChange(u)}
                      className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all active:scale-[0.97]
                        ${field.value === u
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-input bg-background text-foreground hover:border-muted-foreground/30"
                        }`}
                    >
                      {u === "metric" ? t("form.metric") : t("form.imperial")}
                    </button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.gender")}</FormLabel>
                <div className="grid grid-cols-2 gap-3">
                  {(["male", "female"] as Gender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => field.onChange(g)}
                      className={`rounded-lg border px-4 py-3 text-sm font-medium transition-all active:scale-[0.97]
                        ${field.value === g
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-input bg-background text-foreground hover:border-muted-foreground/30"
                        }`}
                    >
                      {g === "male" ? t("form.male") : t("form.female")}
                    </button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Age / Weight / Height */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> {t("form.age")}
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Weight className="h-3.5 w-3.5" /> {t("form.weight")} ({isMetric ? t("common.kg") : t("common.lbs")})
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isMetric ? (
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Ruler className="h-3.5 w-3.5" /> {t("form.heightCm")}
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="space-y-2">
                 <FormLabel className="flex items-center gap-1.5">
                    <Ruler className="h-3.5 w-3.5" /> {t("form.height")}
                  </FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="heightFeet"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" placeholder="ft" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="heightInches"
                      render={({ field }) => (
                         <FormItem>
                          <FormControl>
                            <Input type="number" placeholder="in" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormMessage>{form.formState.errors.height?.message}</FormMessage>
              </div>
            )}
          </div>

          {/* Body Fat (optional) */}
          <FormField
            control={form.control}
            name="bodyFatPercent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("form.bodyFatOptional")} <span className="text-xs text-muted-foreground/60">{t("form.optional")}</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 20" {...field} value={field.value || ""} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                </FormControl>
                {bodyFat && bodyFat > 0 && weight && (
                   <p className="text-xs text-muted-foreground mt-1.5">
                    {t("form.leanMass")} {Math.round(weight * (1 - bodyFat / 100))} {isMetric ? t("common.kg") : t("common.lbs")}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Optional Measurements */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 -mx-2 px-2 rounded-lg">
              <UserRound className="h-4 w-4" />
              {t("form.optionalMeasurements")}
              <span className="ml-auto text-xs opacity-60">(click to expand)</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4 animate-in fade-in-0 slide-in-from-top-1 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="neck"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("bodyFat.neck")} ({isMetric ? t("common.cm") : t("common.in")})</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="38" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="waist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("bodyFat.waist")} ({isMetric ? t("common.cm") : t("common.in")})</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="85" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("bodyFat.hip")} ({isMetric ? t("common.cm") : t("common.in")})</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="95" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="chest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.chest")} ({isMetric ? t("common.cm") : t("common.in")})</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Goal */}
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.goal")}</FormLabel>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { value: "lose", labelKey: "form.loseWeight", emoji: "🔥" },
                    { value: "maintain", labelKey: "form.maintain", emoji: "⚖️" },
                    { value: "build", labelKey: "form.buildMuscle", emoji: "💪" },
                  ] as { value: Goal; labelKey: string; emoji: string }[]).map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => field.onChange(g.value)}
                      className={`rounded-lg border px-3 py-3 text-sm font-medium transition-all active:scale-[0.97]
                        ${field.value === g.value
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-input bg-background text-foreground hover:border-muted-foreground/30"
                        }`}
                    >
                      <span className="block text-lg mb-0.5">{g.emoji}</span>
                      {t(g.labelKey)}
                    </button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Activity Level */}
          <FormField
            control={form.control}
            name="activityLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5" /> {t("form.activityLevel")}
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full h-auto py-3">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {activityOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{t(opt.labelKey)} <span className="text-xs text-muted-foreground">{opt.multiplier}</span></span>
                          <span className="text-xs text-muted-foreground">{t(opt.descKey)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-primary text-primary-foreground py-3.5 text-sm font-semibold
                      transition-all hover:opacity-90 active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
          >
            <Flame className="h-4 w-4" />
            {t("form.calculate")}
          </button>
        </form>
      </Form>
    </div>
  );
}
