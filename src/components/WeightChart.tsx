import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Results } from "./CalorieCalculator";

interface Props {
  history: Results[];
}

export function WeightChart({ history }: Props) {
  const { t } = useTranslation();

  // Prepare data: reverse history (oldest first) and map to chart format
  const data = [...history]
    .reverse()
    .map((item) => ({
      date: item.timestamp,
      weight: item.weightKg,
      // Create a display date string
      dateStr: format(new Date(item.timestamp), "d MMM"),
    }))
    .slice(-30); // Show last 30 entries max

  if (data.length < 2) return null;

  // Calculate domain for Y-axis (min weight - 2, max weight + 2)
  const minWeight = Math.min(...data.map((d) => d.weight));
  const maxWeight = Math.max(...data.map((d) => d.weight));

  return (
    <div className="w-full h-[300px] mt-8 p-4 bg-card rounded-xl border shadow-sm">
      <h3 className="text-sm font-semibold mb-4">{t("history.weightTrend")}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis
            dataKey="dateStr"
            tick={{ fontSize: 12, fill: "#888" }}
            tickLine={false}
            axisLine={false}
            minTickGap={30}
          />
          <YAxis
            domain={[minWeight - 1, maxWeight + 1]}
            tick={{ fontSize: 12, fill: "#888" }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              borderRadius: "8px",
              border: "1px solid hsl(var(--border))",
              fontSize: "12px",
            }}
            labelStyle={{ color: "hsl(var(--muted-foreground))" }}
            formatter={(value: number) => [`${value} kg`, t("form.weight")]}
          />
          <Area
            type="monotone"
            dataKey="weight"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorWeight)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
