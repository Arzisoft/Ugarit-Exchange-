"use client";

import { AlertTriangle, Shield, Eye } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

type Severity = "high" | "medium" | "low";

interface ComplianceAlert {
  id: number;
  title: string;
  description: string;
  severity: Severity;
  timestamp: string;
}

const alerts: ComplianceAlert[] = [
  {
    id: 1,
    title: "Large transaction: $9,500 by User #3",
    description:
      "Single transaction approaching the $10,000 reporting threshold. Requires enhanced due diligence review before processing.",
    severity: "high",
    timestamp: "2026-03-23T09:15:00Z",
  },
  {
    id: 2,
    title: "Multiple transfers to same beneficiary in 24h",
    description:
      "User #12 has initiated 4 separate transfers totaling $7,200 to the same beneficiary within 24 hours. Potential structuring.",
    severity: "medium",
    timestamp: "2026-03-23T08:42:00Z",
  },
  {
    id: 3,
    title: "New account high-value transaction: $4,200",
    description:
      "Account created 2 days ago is attempting a $4,200 exchange. Flagged due to velocity rules for new accounts.",
    severity: "medium",
    timestamp: "2026-03-23T07:30:00Z",
  },
  {
    id: 4,
    title: "Unusual trading pattern detected: User #7",
    description:
      "Detected repeated buy/sell cycles of the same currency pair within short intervals. May indicate wash trading.",
    severity: "low",
    timestamp: "2026-03-22T22:10:00Z",
  },
  {
    id: 5,
    title: "Failed verification attempt: 3 consecutive",
    description:
      "User #19 has failed identity verification 3 times in a row with different document types. Account has been temporarily locked.",
    severity: "high",
    timestamp: "2026-03-22T18:55:00Z",
  },
];

const severityBadge: Record<Severity, "danger" | "warning" | "neutral"> = {
  high: "danger",
  medium: "warning",
  low: "neutral",
};

const severityIcon: Record<Severity, string> = {
  high: "bg-danger/15",
  medium: "bg-gold-500/15",
  low: "bg-blue-500/15",
};

const severityIconColor: Record<Severity, string> = {
  high: "text-danger",
  medium: "text-gold-500",
  low: "text-blue-400",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ComplianceAlerts() {
  const handleReview = (id: number) => {
    alert(`Opening review for alert #${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield size={20} className="text-gold-500" />
        <h3 className="text-lg font-semibold text-white">AML / Compliance Alerts</h3>
        <Badge variant="danger">{alerts.filter((a) => a.severity === "high").length} High</Badge>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-4 rounded-[var(--radius-card)] border border-surface-border bg-surface-card p-4 transition-colors hover:bg-surface-hover"
          >
            <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${severityIcon[alert.severity]}`}>
              <AlertTriangle size={18} className={severityIconColor[alert.severity]} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant={severityBadge[alert.severity]}>
                  {alert.severity.toUpperCase()}
                </Badge>
                <span className="text-xs text-white/40">{timeAgo(alert.timestamp)}</span>
              </div>
              <h4 className="mt-1.5 text-sm font-medium text-white">{alert.title}</h4>
              <p className="mt-1 text-sm leading-relaxed text-white/50">{alert.description}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleReview(alert.id)}
              className="shrink-0 flex items-center gap-1.5"
            >
              <Eye size={14} />
              Review
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
