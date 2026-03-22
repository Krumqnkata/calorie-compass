import { PortionCalculator } from "@/components/PortionCalculator";

export default function PortionCalculatorPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:py-16">
      <header className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Portion Macro Calculator
        </h1>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          Calculate exact macros for any food portion based on its nutritional label.
        </p>
      </header>
      <PortionCalculator />
    </div>
  );
}
