"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "@/components/ui/Card";
import RateEditor from "@/components/admin/RateEditor";
import { generateHistoricalRates } from "@/lib/mock/rates";

export default function AdminRatesPage() {
  const historicalData = useMemo(() => generateHistoricalRates("USD/EGP", 30), []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Rate Management</h2>
        <p className="text-sm text-white/50">
          Configure exchange rates, margins, and monitor rate history
        </p>
      </div>

      <RateEditor />

      <Card header={<h3 className="text-sm font-semibold text-white">USD/EGP - 30 Day History</h3>}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
                tickFormatter={(value) => {
                  const d = new Date(value);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f1d15",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value) => [Number(value).toFixed(4), "Rate"]}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#d4a843"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#d4a843" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
