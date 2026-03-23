"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  CheckCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import KYCStatus from "@/components/kyc/KYCStatus";
import KYCWizard from "@/components/kyc/KYCWizard";
import { useAuthStore } from "@/lib/stores/auth-store";

/* ---------- Profile form schema ---------- */
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showKYCWizard, setShowKYCWizard] = useState(false);

  const kycStatus = user?.kycStatus ?? "not_started";

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
    },
  });

  /* ---------- Save profile ---------- */
  const onSaveProfile = async (data: ProfileFormData) => {
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Update store
    useAuthStore.setState((state) => ({
      user: state.user
        ? {
            ...state.user,
            name: data.name,
            email: data.email,
            phone: data.phone,
          }
        : null,
    }));

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  /* ---------- KYC wizard completion ---------- */
  const handleKYCComplete = () => {
    setShowKYCWizard(false);
  };

  /* ---------- Avatar initials ---------- */
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Profile</h2>
        <p className="mt-1 text-sm text-white/50">
          Manage your personal information and KYC verification.
        </p>
      </div>

      {/* Section 1 — Profile Information */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          header={
            <h3 className="text-base font-semibold text-white">
              Profile Information
            </h3>
          }
        >
          <form
            onSubmit={handleSubmit(onSaveProfile)}
            className="space-y-6"
          >
            {/* Avatar */}
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-2xl font-bold text-gold-500">
                {initials}
              </div>
              <div>
                <p className="font-medium text-white">{user?.name ?? "User"}</p>
                <p className="text-sm text-white/50">{user?.email ?? ""}</p>
              </div>
            </div>

            {/* Editable fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Full Name"
                  placeholder="Enter your name"
                  icon={User}
                  error={errors.name?.message}
                  {...register("name")}
                />
              </div>
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1-555-000-0000"
                icon={Phone}
                error={errors.phone?.message}
                {...register("phone")}
              />
            </div>

            {/* Save button + success message */}
            <div className="flex items-center gap-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={isSaving}
                disabled={!isDirty && !isSaving}
              >
                Save Changes
              </Button>
              {saveSuccess && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 text-sm text-success"
                >
                  <CheckCircle size={16} />
                  Changes saved
                </motion.span>
              )}
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Section 2 — KYC Verification */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card
          header={
            <h3 className="text-base font-semibold text-white">
              KYC Verification
            </h3>
          }
        >
          <div className="space-y-5">
            <KYCStatus status={kycStatus} />

            {/* Conditional content based on KYC status */}
            {(kycStatus === "not_started" || kycStatus === "rejected") && (
              <div className="space-y-3">
                {kycStatus === "rejected" && (
                  <div className="flex items-start gap-3 rounded-lg border border-danger/20 bg-danger/10 p-4">
                    <ShieldAlert
                      size={20}
                      className="mt-0.5 shrink-0 text-danger"
                    />
                    <div>
                      <p className="text-sm font-medium text-danger">
                        Verification Rejected
                      </p>
                      <p className="mt-0.5 text-xs text-white/60">
                        Your previous submission was not approved. Please review
                        your documents and try again.
                      </p>
                    </div>
                  </div>
                )}
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setShowKYCWizard(true)}
                >
                  {kycStatus === "rejected"
                    ? "Retry Verification"
                    : "Start Verification"}
                </Button>
              </div>
            )}

            {kycStatus === "pending" && (
              <div className="flex items-start gap-3 rounded-lg border border-gold-500/20 bg-gold-500/10 p-4">
                <Clock size={20} className="mt-0.5 shrink-0 text-gold-400" />
                <div>
                  <p className="text-sm font-medium text-gold-400">
                    Under Review
                  </p>
                  <p className="mt-0.5 text-xs text-white/60">
                    Your documents are under review. This usually takes 1-3
                    business days. We will notify you once the review is
                    complete.
                  </p>
                </div>
              </div>
            )}

            {kycStatus === "approved" && (
              <div className="flex items-start gap-3 rounded-lg border border-success/20 bg-success/10 p-4">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-success"
                />
                <div>
                  <p className="text-sm font-medium text-success">
                    Identity Verified
                  </p>
                  <p className="mt-0.5 text-xs text-white/60">
                    Your identity has been verified. You have full access to all
                    platform features.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* KYC Wizard Modal */}
      <Modal
        isOpen={showKYCWizard}
        onClose={() => setShowKYCWizard(false)}
        title="KYC Verification"
        size="lg"
      >
        <KYCWizard onComplete={handleKYCComplete} />
      </Modal>
    </div>
  );
}
