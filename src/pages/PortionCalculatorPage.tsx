import { useTranslation } from "react-i18next";
import { PortionCalculator } from "@/components/PortionCalculator";

export default function PortionCalculatorPage() {
  const { t } = useTranslation();
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:py-16">
      <header className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          {t("portionCalc.pageTitle")}
        </h1>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          {t("portionCalc.pageSubtitle")}
        </p>
      </header>
      <PortionCalculator />
    </div>
  );
}
