import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Renders a responsive doughnut chart showing income vs. expenses
export default function BudgetChart({ income, expenses }) {
  // Prepare data and colors
  const data = [
    { name: "Income", value: income },
    { name: "Expenses", value: expenses },
  ];
  const COLORS = ["var(--accent)", "var(--muted)"];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        {/* Outer pie ring */}
        <Pie
          data={data}
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          label
        >
          {/* Color each slice */}
          {data.map((_, idx) => (
            <Cell key={idx} fill={COLORS[idx]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
