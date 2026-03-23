"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Button from "@/components/ui/Button";
import { Download } from "lucide-react";

type DateRange = 7 | 30 | 90;

function generateDailyData(days: number) {
  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toISOString().split("T")[0],
      revenue: Math.round(2000 + Math.random() * 6000),
      volume: Math.round(50000 + Math.random() * 150000),
      users: Math.round(20 + Math.random() * 80),
    });
  }
  return data;
}

const currencyExposure = [
  { name: "USD", value: 45, color: "#d4a843" },
  { name: "EUR", value: 20, color: "#6366f1" },
  { name: "AED", value: 15, color: "#22c55e" },
  { name: "EGP", value: 10, color: "#0ea5e9" },
  { name: "Other", value: 10, color: "rgba(255,255,255,0.3)" },
];

interface ReportChartsProps {
  activeChart: "revenue" | "volume" | "currency" | "users";
}

export default function ReportCharts({ activeChart }: ReportChartsProps) {
  const [dateRange, setDateRange] = useState<DateRange>(30);

  const data = useMemo(() => generateDailyData(dateRange), [dateRange]);

  const handleExportPDF = () => {
    alert("Report downloaded as PDF");
  };

  const handleExportExcel = () => {
    alert("Report downloaded as Excel");
  };

  const tooltipStyle = {
    backgroundColor: "#0f1d15",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#fff",
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {([7, 30, 90] as DateRange[]).map((d) => (
            <button
              key={d}
              onClick={() => setDateRange(d)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                dateRange === d
                  ? "bg-gold-500/15 text-gold-500"
                  : "text-white/50 hover:bg-surface-hover hover:text-white"
              }`}
            >
              {d}D
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleExportPDF} className="flex items-center gap-1.5">
            <Download size={14} />
            Export PDF
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExportExcel} className="flex items-center gap-1.5">
            <Download size={14} />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Charts */}
      <div className="h-96">
        {activeChart === "revenue" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#d4a843"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#d4a843" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeChart === "volume" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, "Volume"]}
              />
              <Bar dataKey="volume" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeChart === "currency" && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={currencyExposure}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}
              >
                {currencyExposure.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [`${value}%`, "Exposure"]}
              />
              <Legend
                wrapperStyle={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}

        {activeChart === "users" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value) => [value, "Active Users"]}
              />
              <Bar dataKey="users" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
