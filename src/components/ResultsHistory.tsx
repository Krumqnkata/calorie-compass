import { format } from "date-fns";
import { History, Trash2, Download, Upload } from "lucide-react";
import { Results, Goal } from "./CalorieCalculator";
import { useTranslation } from "react-i18next";
import { WeightChart } from "./WeightChart";
import { useRef } from "react";
import { toast } from "sonner";

interface Props {
  history: Results[];
  onClear: () => void;
  onImport: (data: Results[]) => void;
}

export function ResultsHistory({ history, onClear, onImport }: Props) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const goalEmoji = (goal: Goal) => {
    switch (goal) {
      case "lose":
        return "🔥";
      case "build":
        return "💪";
      default:
        return "⚖️";
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `calorie_history_${format(new Date(), "yyyy-MM-dd")}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("History exported successfully");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
            // Basic validation: check if items look like Results
            const isValid = importedData.every(item => item.timestamp && item.targetCalories);
            if (isValid) {
                onImport(importedData);
                toast.success("History imported successfully");
            } else {
                toast.error("Invalid file format");
            }
        } else {
            toast.error("Invalid JSON structure");
        }
      } catch (error) {
        toast.error("Failed to parse JSON file");
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = "";
  };

  return (
    <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">{t("history.title")}</h3>
        </div>
        
        <div className="flex items-center gap-2">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".json"
            />
            <button
                onClick={handleImportClick}
                className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded-md hover:bg-muted transition-colors"
                title="Import JSON"
            >
                <Upload className="h-3.5 w-3.5" />
                Import
            </button>
            <button
                onClick={handleExport}
                className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded-md hover:bg-muted transition-colors"
                title="Export JSON"
            >
                <Download className="h-3.5 w-3.5" />
                Export
            </button>
            <div className="h-4 w-px bg-border mx-1" />
            <button
            onClick={onClear}
            className="text-xs font-medium text-destructive hover:text-destructive/80 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-destructive/10 transition-colors"
            >
            <Trash2 className="h-3.5 w-3.5" />
            {t("history.clear")}
            </button>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {history.slice(0, 5).map((item, i) => (
          <div
            key={item.timestamp}
            className="group relative overflow-hidden rounded-xl border bg-muted/30 p-4 transition-all hover:bg-muted/50"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-bold text-foreground tabular-nums">
                    {item.targetCalories}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {t("common.kcal")}
                  </span>
                  <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-background border text-foreground/80">
                    {goalEmoji(item.goal)} {t(`form.${item.goal === "lose" ? "loseWeight" : item.goal === "build" ? "buildMuscle" : "maintain"}`)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{format(new Date(item.timestamp), "d MMM yyyy, HH:mm")}</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span>
                    {item.weightKg} {t("common.kg")}
                  </span>
                  {item.neck && <><span className="h-1 w-1 rounded-full bg-border" /><span>{t("form.neck")}: {item.neck} {t("common.cm")}</span></>}
                  {item.waist && <><span className="h-1 w-1 rounded-full bg-border" /><span>{t("form.waist")}: {item.waist} {t("common.cm")}</span></>}
                  {item.hip && <><span className="h-1 w-1 rounded-full bg-border" /><span>{t("bodyFat.hip")}: {item.hip} {t("common.cm")}</span></>}
                  {item.chest && <><span className="h-1 w-1 rounded-full bg-border" /><span>{t("form.chest")}: {item.chest} {t("common.cm")}</span></>}
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  Macros (P/F/C)
                </div>
                <div className="text-sm font-semibold tabular-nums text-foreground">
                  {item.protein}g / {item.fat}g / {item.carbs}g
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <WeightChart history={history} />
    </div>
  );
}
