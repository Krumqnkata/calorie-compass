import { Goal } from "./CalorieCalculator";
import { Lightbulb } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  goal: Goal;
  targetCalories: number;
  protein: number;
}

export function GoalTips({ goal }: Props) {
  const { t } = useTranslation();

  const goalLabelMap: Record<Goal, string> = {
    lose: t("goalTips.weightLoss"),
    build: t("goalTips.muscleBuilding"),
    maintain: t("goalTips.maintenanceGoal"),
  };

  const goalTips = t(`goalTips.${goal}`, { returnObjects: true }) as string[];

  return (
    <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-4 w-4 text-amber" />
        <h3 className="text-sm font-medium text-muted-foreground">
          {t("goalTips.tipsFor", { goal: goalLabelMap[goal] })}
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
