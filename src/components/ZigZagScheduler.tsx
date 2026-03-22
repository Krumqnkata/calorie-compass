import { useTranslation } from "react-i18next";
import { Gauge } from "lucide-react";

interface Props {
  targetCalories: number;
}

export function ZigZagScheduler({ targetCalories }: Props) {
  const { t } = useTranslation();

  // Define the zigzag pattern: 5 low days, 2 high days
  const numHighDays = 2;
  const numLowDays = 5;
  const highDayMultiplier = 1.15; // 15% above target
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; // To be translated

  // Calculate total weekly calories
  const weeklyTotalCalories = targetCalories * 7;

  // Calculate high day calories
  const highDayCalories = Math.round(targetCalories * highDayMultiplier);

  // Calculate calories for low days
  const lowDaysTotalCalories = weeklyTotalCalories - (highDayCalories * numHighDays);
  const lowDayCalories = Math.round(lowDaysTotalCalories / numLowDays);

  // Distribute high/low days (simple pattern for now: 2 high days on specific days)
  const schedule: { day: string; calories: number; type: "high" | "low" }[] = [];
  const highDaysIndices = [3, 6]; // Example: Wednesday and Saturday are high days

  for (let i = 0; i < 7; i++) {
    const day = daysOfWeek[i];
    const isHighDay = highDaysIndices.includes(i);
    schedule.push({
      day: day,
      calories: isHighDay ? highDayCalories : lowDayCalories,
      type: isHighDay ? "high" : "low",
    });
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Gauge className="h-5 w-5 text-purple-500" />
        <h3 className="text-sm font-medium text-muted-foreground">{t("zigzag.title")}</h3>
      </div>

      <p className="text-xs text-muted-foreground mb-4">{t("zigzag.description")}</p>

      <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground mb-2">
        {schedule.map((day) => (
          <div key={day.day}>{t(`common.days.${day.day}`)}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center text-base font-bold tabular-nums">
        {schedule.map((day, index) => (
          <div
            key={index}
            className={`py-2 rounded-lg ${day.type === "high" ? "bg-primary text-primary-foreground" : "bg-muted/50 text-foreground"}`}
          >
            {day.calories}
          </div>
        ))}
      </div>
    </div>
  );
}
