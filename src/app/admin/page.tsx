"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowRightLeft,
  UserPlus,
  ShieldCheck,
  AlertTriangle,
  Clock,
} from "lucide-react";
import Card from "@/components/ui/Card";
import StatsCards from "@/components/admin/StatsCards";

const volumeData = [
  { day: "Mon", volume: 95200 },
  { day: "Tue", volume: 112800 },
  { day: "Wed", volume: 89400 },
  { day: "Thu", volume: 145600 },
  { day: "Fri", volume: 128300 },
  { day: "Sat", volume: 82100 },
  { day: "Sun", volume: 105700 },
];

interface ActivityItem {
  id: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  text: string;
  timestamp: string;
}

const recentActivity: ActivityItem[] = [
  {
    id: 1,
    icon: ShieldCheck,
    iconBg: "bg-success/15",
    iconColor: "text-success",
    text: "Ahmad Rifai approved KYC for User #42",
    timestamp: "2 minutes ago",
  },
  {
    id: 2,
    icon: ArrowRightLeft,
    iconBg: "bg-gold-500/15",
    iconColor: "text-gold-500",
    text: "Exchange: $5,000 USD \u2192 EGP by sarah@example.com",
    timestamp: "8 minutes ago",
  },
  {
    id: 3,
    icon: UserPlus,
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    text: "New user registration: omar@example.com",
    timestamp: "15 minutes ago",
  },
  {
    id: 4,
    icon: AlertTriangle,
    iconBg: "bg-danger/15",
    iconColor: "text-danger",
    text: "Large transaction flagged: $9,500 by User #3",
    timestamp: "23 minutes ago",
  },
  {
    id: 5,
    icon: ArrowRightLeft,
    iconBg: "bg-gold-500/15",
    iconColor: "text-gold-500",
    text: "Exchange: $2,000 USD \u2192 GBP by john@example.com",
    timestamp: "35 minutes ago",
  },
  {
    id: 6,
    icon: ShieldCheck,
    iconBg: "bg-success/15",
    iconColor: "text-success",
    text: "KYC document submitted by fatma@example.com",
    timestamp: "42 minutes ago",
  },
  {
    id: 7,
    icon: UserPlus,
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    text: "New user registration: ali.hassan@example.com",
    timestamp: "1 hour ago",
  },
  {
    id: 8,
    icon: ArrowRightLeft,
    iconBg: "bg-gold-500/15",
    iconColor: "text-gold-500",
    text: "Transfer: $1,200 USD \u2192 KES by kwame@example.com",
    timestamp: "1.5 hours ago",
  },
];

export default function AdminDashboard() {
  const chartData = useMemo(() => volumeData, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
        <p className="text-sm text-white/50">Overview of platform activity</p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Daily Volume Chart */}
        <Card header={<h3 className="text-sm font-semibold text-white">7-Day Volume</h3>}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickLine={false}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f1d15",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  labelFormatter={(label) => `${label}`}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, "Volume"]}
                />
                <Bar dataKey="volume" fill="#d4a843" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card header={<h3 className="text-sm font-semibold text-white">Recent Activity</h3>}>
          <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-surface-hover"
              >
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}>
                  <item.icon size={16} className={item.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 leading-snug">{item.text}</p>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-white/40">
                    <Clock size={10} />
                    {item.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
