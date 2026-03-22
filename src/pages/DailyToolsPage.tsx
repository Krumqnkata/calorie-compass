import { WaterTracker } from "@/components/WaterTracker";
import { FastingTimer } from "@/components/FastingTimer";

export default function DailyToolsPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:py-16">
      <header className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Daily Health Tools
        </h1>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          Track your hydration and manage intermittent fasting — all offline.
        </p>
      </header>
      <div className="space-y-6">
        <WaterTracker goalLiters={2.5} />
        <FastingTimer />
      </div>
    </div>
  );
}
