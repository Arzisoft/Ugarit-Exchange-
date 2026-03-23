"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Bell,
  Globe,
  Lock,
  Mail,
  Smartphone,
  BellRing,
  Check,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Toggle from "@/components/ui/Toggle";

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="mt-1 text-sm text-white/50">
          Manage your account security, notifications, and preferences
        </p>
      </div>

      {/* Sections */}
      <SecuritySection />
      <NotificationsSection />
      <PreferencesSection />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 1 — Security                                               */
/* ------------------------------------------------------------------ */

function SecuritySection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);

  const handleChangePassword = () => {
    setError("");
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1000);
  };

  return (
    <Card
      header={
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/10 text-gold-400">
            <Shield size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Security</h3>
            <p className="text-xs text-white/40">
              Password and authentication settings
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Change Password */}
        <div className="space-y-4">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-white/70">
            <Lock size={14} />
            Change Password
          </h4>

          <div className="grid gap-4 sm:grid-cols-1">
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-danger">{error}</p>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 px-4 py-2.5 text-sm text-success"
            >
              <Check size={16} />
              Password updated successfully
            </motion.div>
          )}

          <Button
            variant="primary"
            loading={loading}
            onClick={handleChangePassword}
          >
            Update Password
          </Button>
        </div>

        {/* Divider */}
        <div className="border-t border-surface-border" />

        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-white/70">
              <Shield size={14} />
              Two-Factor Authentication
            </h4>
            <p className="text-xs text-white/40">
              Add an extra layer of security to your account by requiring a
              verification code on each login
            </p>
          </div>
          <Toggle enabled={twoFactor} onChange={setTwoFactor} />
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 2 — Notifications                                          */
/* ------------------------------------------------------------------ */

function NotificationsSection() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [inAppNotifications, setInAppNotifications] = useState(true);

  const items = [
    {
      icon: Mail,
      label: "Email Notifications",
      description:
        "Receive transaction confirmations, security alerts, and account updates via email",
      enabled: emailNotifications,
      onChange: setEmailNotifications,
    },
    {
      icon: Smartphone,
      label: "SMS Notifications",
      description:
        "Get text messages for important alerts like large transactions and login attempts",
      enabled: smsNotifications,
      onChange: setSmsNotifications,
    },
    {
      icon: BellRing,
      label: "In-App Notifications",
      description:
        "See real-time notifications inside the app for transfers, exchange completions, and more",
      enabled: inAppNotifications,
      onChange: setInAppNotifications,
    },
  ];

  return (
    <Card
      header={
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/10 text-gold-400">
            <Bell size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              Notifications
            </h3>
            <p className="text-xs text-white/40">
              Choose how you want to be notified
            </p>
          </div>
        </div>
      }
    >
      <div className="divide-y divide-surface-border">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-white/50">
                <item.icon size={16} />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-white/40">{item.description}</p>
              </div>
            </div>
            <Toggle enabled={item.enabled} onChange={item.onChange} />
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 3 — Preferences                                            */
/* ------------------------------------------------------------------ */

const currencies = ["USD", "EUR", "GBP", "AED", "EGP"];
const languages = ["English", "Arabic", "French", "Turkish"];

function PreferencesSection() {
  const [defaultCurrency, setDefaultCurrency] = useState("USD");
  const [language, setLanguage] = useState("English");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setSaved(false);
    // Mock save
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
    }, 800);
  };

  return (
    <Card
      header={
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/10 text-gold-400">
            <Globe size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Preferences</h3>
            <p className="text-xs text-white/40">
              Customize your experience
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Default Currency */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white/70">
            Default Currency
          </label>
          <select
            value={defaultCurrency}
            onChange={(e) => setDefaultCurrency(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-card px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30"
          >
            {currencies.map((c) => (
              <option key={c} value={c} className="bg-forest-900 text-white">
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white/70">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-card px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30"
          >
            {languages.map((l) => (
              <option key={l} value={l} className="bg-forest-900 text-white">
                {l}
              </option>
            ))}
          </select>
        </div>

        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 px-4 py-2.5 text-sm text-success"
          >
            <Check size={16} />
            Preferences saved successfully
          </motion.div>
        )}

        <Button variant="primary" loading={saving} onClick={handleSave}>
          Save Preferences
        </Button>
      </div>
    </Card>
  );
}
