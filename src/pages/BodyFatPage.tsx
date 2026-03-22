import { BodyFatCalculator } from "@/components/BodyFatCalculator";

export default function BodyFatPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:py-16">
      <header className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Body Fat Calculator
        </h1>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          Estimate your body fat percentage using the U.S. Navy Method.
        </p>
      </header>
      <BodyFatCalculator />
    </div>
  );
}
