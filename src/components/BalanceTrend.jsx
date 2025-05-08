// src/components/BalanceTrend.jsx
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function BalanceTrend({ data, height = 140 }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, bottom: 20, left: 0 }}
        >
          {/* 1. Light grid for reference */}
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />

          {/* 2. X-axis: only start/end ticks, formatted M/D */}
          <XAxis
            dataKey="date"
            tickFormatter={(ts) =>
              new Date(ts).toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric",
              })
            }
            interval="preserveStartEnd"
            minTickGap={20}
          />

          {/* 3. Y-axis: dollar formatting */}
          <YAxis
            domain={["dataMin", "dataMax"]}
            tickFormatter={(val) => `$${val}`}
          />

          {/* 4. Styled tooltip */}
          <Tooltip
            formatter={(value) => [`$${value}`, "Balance"]}
            labelFormatter={(label) =>
              new Date(label).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "2-digit",
              })
            }
            contentStyle={{
              backgroundColor: "var(--card-bg)",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "var(--text)" }}
            itemStyle={{ color: "var(--accent)" }}
          />

          {/* 5. Thicker line + point markers */}
          <Line
            type="monotone"
            dataKey="balance"
            stroke="var(--accent)"
            strokeWidth={3}
            dot={{ r: 3, fill: "var(--accent)" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
