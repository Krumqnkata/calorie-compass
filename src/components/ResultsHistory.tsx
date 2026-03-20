import { Results } from "./CalorieCalculator";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { History, Trash2 } from "lucide-react";

interface Props {
  history: Results[];
  onClear: () => void;
}

export function ResultsHistory({ history, onClear }: Props) {
  const data = [...history].reverse().map((r, i) => ({
    name: new Date(r.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    calories: r.targetCalories,
    index: i,
  }));

  return (
    <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">Calculation History</h3>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
        >
          <Trash2 className="h-3 w-3" /> Clear
        </button>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={45} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(150, 12%, 90%)",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="calories" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
