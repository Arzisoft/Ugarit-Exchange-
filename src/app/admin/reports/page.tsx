"use client";

import { useState } from "react";
import Tabs from "@/components/ui/Tabs";
import Card from "@/components/ui/Card";
import ReportCharts from "@/components/admin/ReportCharts";

const reportTabs = [
  { id: "revenue", label: "Revenue" },
  { id: "volume", label: "Volume" },
  { id: "currency", label: "Currency Exposure" },
  { id: "users", label: "User Activity" },
];

type ChartTab = "revenue" | "volume" | "currency" | "users";

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<ChartTab>("revenue");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Reports & Analytics</h2>
        <p className="text-sm text-white/50">
          Platform performance metrics and exportable reports
        </p>
      </div>

      <Card>
        <Tabs
          tabs={reportTabs}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as ChartTab)}
        />
        <div className="mt-6">
          <ReportCharts activeChart={activeTab} />
        </div>
      </Card>
    </div>
  );
}
