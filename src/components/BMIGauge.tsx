import { useTranslation } from "react-i18next";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  bmi: number;
}

export function BMIGauge({ bmi }: Props) {
  const { t } = useTranslation();

  // Define ranges for the gauge
  // Underweight: < 18.5
  // Normal: 18.5 - 24.9
  // Overweight: 25 - 29.9
  // Obese: > 30

  const maxBMI = 40; // Changed max BMI to 40 for better visual distribution

  // We'll use a semi-circle pie chart
  const data = [
    { name: t("results.underweight"), value: 18.5, color: "#3b82f6" }, // Blue
    { name: t("results.normal"), value: 6.5, color: "#10b981" },    // Green (span 18.5 to 25)
    { name: t("results.overweight"), value: 5, color: "#f59e0b" },  // Orange (span 25 to 30)
    { name: t("results.obese"), value: 10, color: "#ef4444" },      // Red (span 30 to 40, total 40)
  ];

  // Calculate needle rotation
  // Maps clampedBMI from 0 to maxBMI (40) linearly across 180 degrees (-90 to +90)
  // -90deg is left, 0deg is up, +90deg is right (assuming origin-bottom)
  const clampedBMI = Math.min(Math.max(bmi, 0), maxBMI);
  const rotationAngle = (clampedBMI / maxBMI) * 180 - 90; // In degrees

  return (
    <div className="relative h-[180px] w-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      
       <div
        className="absolute bottom-0 left-1/2 w-1 h-32 bg-foreground origin-bottom transition-transform duration-1000 ease-out rounded-full z-10"
        style={{
          transform: `translateX(-50%) rotate(${rotationAngle}deg)`,
          height: '100px', // Match inner radius roughly
          bottom: '20px' // Adjustment
        }}
      >
        <div className="absolute -bottom-2 -left-1.5 w-4 h-4 bg-foreground rounded-full" />
      </div>

      <div className="absolute bottom-0 flex flex-col items-center">
         <span className="text-2xl font-bold">{bmi}</span>
         <span className="text-xs text-muted-foreground">BMI</span>
      </div>
    </div>
  );
}
