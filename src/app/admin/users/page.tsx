"use client";

import UserTable from "@/components/admin/UserTable";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">User Management</h2>
        <p className="text-sm text-white/50">
          Manage user accounts, KYC approvals, and account status
        </p>
      </div>
      <UserTable />
    </div>
  );
}
