import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Props {
  protein: number;
  fat: number;
  carbs: number;
}

const COLORS = [
  "hsl(160, 84%, 39%)", // emerald/primary - protein
  "hsl(38, 92%, 50%)",  // amber - fat
  "hsl(199, 89%, 48%)", // sky - carbs
];

export function MacroChart({ protein, fat, carbs }: Props) {
  const data = [
    { name: "Protein", value: protein },
    { name: "Fat", value: fat },
    { name: "Carbs", value: carbs },
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
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
