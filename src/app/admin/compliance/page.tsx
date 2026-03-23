"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ComplianceAlerts from "@/components/admin/ComplianceAlerts";
import { Settings } from "lucide-react";

export default function AdminCompliancePage() {
  const [maxSingle, setMaxSingle] = useState("10000");
  const [maxDaily, setMaxDaily] = useState("50000");
  const [maxTransfers, setMaxTransfers] = useState("20");

  const handleUpdateLimits = () => {
    alert(
      `Limits updated:\n- Max single: $${Number(maxSingle).toLocaleString()}\n- Max daily: $${Number(maxDaily).toLocaleString()}\n- Max transfers/day: ${maxTransfers}`
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Compliance</h2>
        <p className="text-sm text-white/50">
          AML alerts, transaction monitoring, and compliance configuration
        </p>
      </div>

      <ComplianceAlerts />

      <Card
        header={
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-gold-500" />
            <h3 className="text-sm font-semibold text-white">Transaction Limits</h3>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Input
            label="Max Single Transaction ($)"
            type="number"
            value={maxSingle}
            onChange={(e) => setMaxSingle(e.target.value)}
            placeholder="10000"
          />
          <Input
            label="Max Daily Volume ($)"
            type="number"
            value={maxDaily}
            onChange={(e) => setMaxDaily(e.target.value)}
            placeholder="50000"
          />
          <Input
            label="Max Transfers Per Day (#)"
            type="number"
            value={maxTransfers}
            onChange={(e) => setMaxTransfers(e.target.value)}
            placeholder="20"
          />
        </div>
        <div className="mt-5 flex justify-end">
          <Button variant="primary" onClick={handleUpdateLimits}>
            Update Limits
          </Button>
        </div>
      </Card>
    </div>
  );
}
