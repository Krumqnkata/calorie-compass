import { Results } from "./CalorieCalculator";
import { FileDown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  results: Results;
}

export function PdfExportButton({ results }: Props) {
  const { t } = useTranslation();

  const handleExport = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 210;
    const margin = 20;
    const contentW = W - margin * 2;
    let y = margin;

    const emerald: [number, number, number] = [16, 185, 129];
    const amber: [number, number, number] = [245, 158, 11];
    const sky: [number, number, number] = [14, 165, 233];
    const dark: [number, number, number] = [30, 41, 59];
    const muted: [number, number, number] = [100, 116, 139];
    const lightBg: [number, number, number] = [241, 245, 249];

    doc.setFillColor(...emerald);
    doc.roundedRect(margin, y, contentW, 14, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("Calorie & TDEE Report", margin + 6, y + 9);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), W - margin - 6, y + 9, { align: "right" });
    y += 22;

    doc.setFillColor(...lightBg);
    doc.roundedRect(margin, y, contentW, 32, 3, 3, "F");
    doc.setTextColor(...muted);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("TARGET DAILY CALORIES", W / 2, y + 10, { align: "center" });
    doc.setTextColor(...dark);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text(`${results.targetCalories.toLocaleString()}`, W / 2, y + 24, { align: "center" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...muted);
    doc.text("kcal / day", W / 2, y + 30, { align: "center" });
    y += 40;

    doc.setTextColor(...dark);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Macronutrient Breakdown", margin, y);
    y += 8;

    const macros = [
      { name: "Protein", grams: results.protein, percent: 30, cals: results.protein * 4, color: emerald },
      { name: "Fat", grams: results.fat, percent: 30, cals: results.fat * 9, color: amber },
      { name: "Carbs", grams: results.carbs, percent: 40, cals: results.carbs * 4, color: sky },
    ];

    for (const macro of macros) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...dark);
      doc.text(macro.name, margin, y + 4);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...muted);
      doc.text(`${macro.grams}g · ${Math.round(macro.cals)} kcal (${macro.percent}%)`, W - margin, y + 4, { align: "right" });
      y += 7;
      doc.setFillColor(230, 230, 230);
      doc.roundedRect(margin, y, contentW, 4, 2, 2, "F");
      doc.setFillColor(...macro.color);
      const barW = (contentW * macro.percent) / 100;
      doc.roundedRect(margin, y, barW, 4, 2, 2, "F");
      y += 10;
    }

    y += 4;

    doc.setTextColor(...dark);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Key Metrics", margin, y);
    y += 7;

    const bmiCat = results.bmi < 18.5 ? "Underweight" : results.bmi < 25 ? "Normal" : results.bmi < 30 ? "Overweight" : "Obese";
    const metrics = [
      { label: "BMR", value: `${results.bmr.toLocaleString()} kcal` },
      { label: "TDEE", value: `${results.tdee.toLocaleString()} kcal` },
      { label: "BMI", value: `${results.bmi} (${bmiCat})` },
      { label: "Water Intake", value: `${results.waterLiters} L / day` },
      { label: "Ideal Weight", value: `${results.idealWeightLow}–${results.idealWeightHigh} kg` },
    ];

    const colW = contentW / 2 - 2;
    metrics.forEach((m, i) => {
      const col = i % 2;
      const x = margin + col * (colW + 4);
      if (col === 0 && i > 0) y += 16;
      doc.setFillColor(...lightBg);
      doc.roundedRect(x, y, colW, 14, 2, 2, "F");
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...muted);
      doc.text(m.label, x + 4, y + 5);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...dark);
      doc.text(m.value, x + 4, y + 11);
    });

    if (metrics.length % 2 !== 0) y += 16;
    else y += 16;
    y += 6;

    doc.setTextColor(...dark);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Suggested Meal Plan", margin, y);
    y += 7;

    const meals = [
      { name: "Breakfast", pct: 0.25, time: "7–9 AM" },
      { name: "Lunch", pct: 0.35, time: "12–2 PM" },
      { name: "Snack", pct: 0.10, time: "3–4 PM" },
      { name: "Dinner", pct: 0.30, time: "6–8 PM" },
    ];

    const mealColW = (contentW - 12) / 4;
    meals.forEach((meal, i) => {
      const x = margin + i * (mealColW + 4);
      const cals = Math.round(results.targetCalories * meal.pct);
      doc.setFillColor(...lightBg);
      doc.roundedRect(x, y, mealColW, 22, 2, 2, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...dark);
      doc.text(meal.name, x + mealColW / 2, y + 6, { align: "center" });
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...muted);
      doc.text(meal.time, x + mealColW / 2, y + 11, { align: "center" });
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...dark);
      doc.text(`${cals}`, x + mealColW / 2, y + 18, { align: "center" });
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...muted);
      doc.text("kcal", x + mealColW / 2, y + 22, { align: "center" });
    });

    y += 30;

    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y, W - margin, y);
    y += 5;
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...muted);
    doc.text("Generated by Calorie & TDEE Calculator. For informational purposes only — consult a healthcare professional.", W / 2, y, { align: "center" });

    doc.save("calorie-report.pdf");
  };

  return (
    <button
      onClick={handleExport}
      className="w-full rounded-lg border bg-card text-foreground py-3 text-sm font-medium
                 transition-all hover:bg-accent active:scale-[0.98] flex items-center justify-center gap-2"
    >
      <FileDown className="h-4 w-4" />
      {t("results.downloadPdf")}
    </button>
  );
}
