"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import { mockUsers, type KycStatus } from "@/lib/mock/users";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { formatDate } from "@/lib/utils/format";

type KycFilter = "all" | KycStatus;

// Extended mock data for a more populated table
const extendedUsers = [
  ...mockUsers,
  {
    id: "usr_004",
    name: "Fatma El-Sayed",
    email: "fatma@example.com",
    phone: "+20-111-222-3333",
    role: "user" as const,
    kycStatus: "approved" as const,
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=FE&backgroundColor=8b5cf6",
    joinDate: "2024-11-20T08:00:00Z",
  },
  {
    id: "usr_005",
    name: "Kwame Asante",
    email: "kwame@example.com",
    phone: "+233-50-123-4567",
    role: "user" as const,
    kycStatus: "pending" as const,
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=KA&backgroundColor=0ea5e9",
    joinDate: "2025-02-14T12:00:00Z",
  },
  {
    id: "usr_006",
    name: "John Mitchell",
    email: "john@example.com",
    phone: "+1-555-234-5678",
    role: "user" as const,
    kycStatus: "rejected" as const,
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=JM&backgroundColor=ef4444",
    joinDate: "2025-01-05T09:30:00Z",
  },
  {
    id: "usr_007",
    name: "Aisha Mohammed",
    email: "aisha@example.com",
    phone: "+971-55-987-6543",
    role: "user" as const,
    kycStatus: "not_started" as const,
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=AM&backgroundColor=f97316",
    joinDate: "2025-03-18T16:45:00Z",
  },
  {
    id: "usr_008",
    name: "Carlos Rivera",
    email: "carlos@example.com",
    phone: "+34-612-345-678",
    role: "user" as const,
    kycStatus: "approved" as const,
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=CR&backgroundColor=14b8a6",
    joinDate: "2024-09-12T10:00:00Z",
  },
];

const mockBalances: Record<string, string> = {
  usr_admin_001: "$52,340.00",
  usr_regular_002: "$12,580.00",
  usr_new_003: "$340.00",
  usr_004: "$8,920.00",
  usr_005: "$1,100.00",
  usr_006: "$0.00",
  usr_007: "$250.00",
  usr_008: "$6,470.00",
};

const kycBadgeVariant: Record<KycStatus, "success" | "warning" | "danger" | "neutral"> = {
  approved: "success",
  pending: "warning",
  rejected: "danger",
  not_started: "neutral",
};

const kycLabel: Record<KycStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
  not_started: "Not Started",
};

const filterOptions: { value: KycFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
  { value: "not_started", label: "Not Started" },
];

export default function UserTable() {
  const [search, setSearch] = useState("");
  const [kycFilter, setKycFilter] = useState<KycFilter>("all");
  const [suspended, setSuspended] = useState<Record<string, boolean>>({});
  const [filterOpen, setFilterOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    return extendedUsers.filter((user) => {
      const matchSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchKyc = kycFilter === "all" || user.kycStatus === kycFilter;
      return matchSearch && matchKyc;
    });
  }, [search, kycFilter]);

  const handleApprove = (userId: string) => {
    alert(`KYC approved for user ${userId}`);
  };

  const handleReject = (userId: string) => {
    alert(`KYC rejected for user ${userId}`);
  };

  const toggleSuspend = (userId: string) => {
    setSuspended((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            placeholder="Search users by name or email..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2"
          >
            KYC: {filterOptions.find((f) => f.value === kycFilter)?.label}
            <ChevronDown size={14} />
          </Button>
          {filterOpen && (
            <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-surface-border bg-forest-900 py-1 shadow-xl">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setKycFilter(opt.value);
                    setFilterOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-surface-hover ${
                    kycFilter === opt.value ? "text-gold-500" : "text-white/70"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-[var(--radius-card)] border border-surface-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-card">
              <th className="px-4 py-3 font-medium text-white/50">Name</th>
              <th className="px-4 py-3 font-medium text-white/50">Email</th>
              <th className="px-4 py-3 font-medium text-white/50">Role</th>
              <th className="px-4 py-3 font-medium text-white/50">KYC Status</th>
              <th className="px-4 py-3 font-medium text-white/50">Balance</th>
              <th className="px-4 py-3 font-medium text-white/50">Join Date</th>
              <th className="px-4 py-3 font-medium text-white/50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const isSuspended = suspended[user.id] ?? false;
              return (
                <tr
                  key={user.id}
                  className={`border-b border-surface-border transition-colors hover:bg-surface-hover ${
                    isSuspended ? "opacity-50" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full"
                      />
                      <span className="font-medium text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/70">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.role === "admin" ? "warning" : "neutral"}>
                      {user.role === "admin" ? "Admin" : "User"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={kycBadgeVariant[user.kycStatus]}>
                      {kycLabel[user.kycStatus]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-medium text-white">
                    {mockBalances[user.id] ?? "$0.00"}
                  </td>
                  <td className="px-4 py-3 text-white/50">
                    {formatDate(user.joinDate)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {user.kycStatus === "pending" && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApprove(user.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleReject(user.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <button
                        onClick={() => toggleSuspend(user.id)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          isSuspended
                            ? "bg-success/15 text-success hover:bg-success/25"
                            : "bg-danger/15 text-danger hover:bg-danger/25"
                        }`}
                      >
                        {isSuspended ? "Unsuspend" : "Suspend"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-white/40">
                  No users found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-white/40">
        Showing {filteredUsers.length} of {extendedUsers.length} users
      </div>
    </div>
  );
}
