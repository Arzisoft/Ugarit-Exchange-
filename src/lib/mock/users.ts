export type UserRole = "admin" | "user";
export type KycStatus = "not_started" | "approved" | "pending" | "rejected";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  kycStatus: KycStatus;
  avatar: string;
  joinDate: string;
};

export const mockUsers: User[] = [
  {
    id: "usr_admin_001",
    name: "Ahmad Rifai",
    email: "admin@ugarit.com",
    phone: "+971-50-123-4567",
    role: "admin",
    kycStatus: "approved",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=AR&backgroundColor=1e3a5f",
    joinDate: "2024-01-15T08:00:00Z",
  },
  {
    id: "usr_regular_002",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1-555-867-5309",
    role: "user",
    kycStatus: "approved",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=SJ&backgroundColor=6366f1",
    joinDate: "2024-06-10T14:30:00Z",
  },
  {
    id: "usr_new_003",
    name: "Omar Hassan",
    email: "omar@example.com",
    phone: "+20-100-555-7890",
    role: "user",
    kycStatus: "pending",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=OH&backgroundColor=059669",
    joinDate: "2025-03-01T10:15:00Z",
  },
];

export function getUserByEmail(email: string): User | undefined {
  return mockUsers.find((u) => u.email === email);
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id);
}
