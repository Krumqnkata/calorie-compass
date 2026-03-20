import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  protein: number;
  fat: number;
  carbs: number;
}

const COLORS = [
  "hsl(160, 84%, 39%)",
  "hsl(38, 92%, 50%)",
  "hsl(199, 89%, 48%)",
];

export function MacroChart({ protein, fat, carbs }: Props) {
  const data = [
    { name: "Protein", value: protein, unit: "g" },
    { name: "Fat", value: fat, unit: "g" },
    { name: "Carbs", value: carbs, unit: "g" },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={4}
          dataKey="value"
          strokeWidth={0}
          animationBegin={0}
          animationDuration={800}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [`${value}g`, name]}
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid hsl(150, 12%, 90%)",
            fontSize: "12px",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
