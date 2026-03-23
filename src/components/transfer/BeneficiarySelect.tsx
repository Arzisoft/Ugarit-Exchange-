"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Landmark, Phone, MapPin, Plus, User } from "lucide-react";
import { useBeneficiaryStore } from "@/lib/stores/beneficiary-store";
import type { Beneficiary, BeneficiaryMethod } from "@/lib/mock/beneficiaries";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface BeneficiarySelectProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

const methodIcons: Record<BeneficiaryMethod, typeof Landmark> = {
  bank: Landmark,
  mobile_wallet: Phone,
  cash_pickup: MapPin,
};

const methodLabels: Record<BeneficiaryMethod, string> = {
  bank: "Bank Transfer",
  mobile_wallet: "Mobile Wallet",
  cash_pickup: "Cash Pickup",
};

const countries = [
  { value: "Egypt", flag: "\u{1F1EA}\u{1F1EC}" },
  { value: "UAE", flag: "\u{1F1E6}\u{1F1EA}" },
  { value: "Kenya", flag: "\u{1F1F0}\u{1F1EA}" },
  { value: "Nigeria", flag: "\u{1F1F3}\u{1F1EC}" },
  { value: "Turkey", flag: "\u{1F1F9}\u{1F1F7}" },
  { value: "Saudi Arabia", flag: "\u{1F1F8}\u{1F1E6}" },
  { value: "Morocco", flag: "\u{1F1F2}\u{1F1E6}" },
  { value: "Ghana", flag: "\u{1F1EC}\u{1F1ED}" },
  { value: "Tanzania", flag: "\u{1F1F9}\u{1F1FF}" },
  { value: "South Africa", flag: "\u{1F1FF}\u{1F1E6}" },
];

export default function BeneficiarySelect({
  selected,
  onSelect,
}: BeneficiarySelectProps) {
  const { beneficiaries, add } = useBeneficiaryStore();
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formCountry, setFormCountry] = useState("");
  const [formMethod, setFormMethod] = useState<BeneficiaryMethod>("bank");
  const [formBankName, setFormBankName] = useState("");
  const [formAccountNumber, setFormAccountNumber] = useState("");
  const [formMobileNumber, setFormMobileNumber] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  function resetForm() {
    setFormName("");
    setFormCountry("");
    setFormMethod("bank");
    setFormBankName("");
    setFormAccountNumber("");
    setFormMobileNumber("");
    setFormErrors({});
  }

  function validateForm(): boolean {
    const errors: Record<string, string> = {};
    if (!formName.trim()) errors.name = "Name is required";
    if (!formCountry) errors.country = "Country is required";
    if (formMethod === "bank") {
      if (!formBankName.trim()) errors.bankName = "Bank name is required";
      if (!formAccountNumber.trim())
        errors.accountNumber = "Account number is required";
    }
    if (formMethod === "mobile_wallet") {
      if (!formMobileNumber.trim())
        errors.mobileNumber = "Mobile number is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleAddBeneficiary() {
    if (!validateForm()) return;

    const countryEntry = countries.find((c) => c.value === formCountry);
    const newBeneficiary: Beneficiary = {
      id: `ben_${Date.now()}`,
      name: formName.trim(),
      country: formCountry,
      countryFlag: countryEntry?.flag ?? "",
      method: formMethod,
      nickname: formName.trim(),
      ...(formMethod === "bank" && {
        bankName: formBankName.trim(),
        accountNumber: formAccountNumber.trim(),
      }),
      ...(formMethod === "mobile_wallet" && {
        mobileNumber: formMobileNumber.trim(),
      }),
    };

    add(newBeneficiary);
    onSelect(newBeneficiary.id);
    resetForm();
    setShowModal(false);
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {beneficiaries.map((b) => {
          const Icon = methodIcons[b.method];
          const isSelected = selected === b.id;

          return (
            <motion.div
              key={b.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                onClick={() => onSelect(b.id)}
                className={`transition-all ${
                  isSelected
                    ? "border-gold-500 ring-1 ring-gold-500/30"
                    : "hover:border-white/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{b.countryFlag}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">
                      {b.name}
                    </p>
                    <p className="mt-0.5 text-sm text-white/50">{b.country}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-white/40">
                      <Icon size={14} />
                      <span>{methodLabels[b.method]}</span>
                    </div>
                    {b.method === "bank" && b.bankName && (
                      <p className="mt-1 truncate text-xs text-white/30">
                        {b.bankName}
                        {b.accountNumber && ` - ${b.accountNumber.slice(-8)}`}
                      </p>
                    )}
                    {b.method === "mobile_wallet" && b.mobileNumber && (
                      <p className="mt-1 text-xs text-white/30">
                        {b.mobileNumber}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}

        {/* Add New Beneficiary card */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Card
            onClick={() => setShowModal(true)}
            className="flex min-h-[140px] items-center justify-center border-dashed hover:border-gold-500/50"
          >
            <div className="flex flex-col items-center gap-2 text-white/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10">
                <Plus size={20} className="text-gold-500" />
              </div>
              <span className="text-sm font-medium">Add New Beneficiary</span>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Add Beneficiary Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          resetForm();
          setShowModal(false);
        }}
        title="Add New Beneficiary"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            icon={User}
            placeholder="Enter beneficiary name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            error={formErrors.name}
          />

          {/* Country dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/70">
              Country
            </label>
            <select
              value={formCountry}
              onChange={(e) => setFormCountry(e.target.value)}
              className={`w-full rounded-lg border bg-surface-card px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 ${
                formErrors.country
                  ? "border-danger focus:border-danger focus:ring-danger/30"
                  : "border-surface-border"
              }`}
            >
              <option value="" className="bg-forest-900">
                Select country
              </option>
              {countries.map((c) => (
                <option key={c.value} value={c.value} className="bg-forest-900">
                  {c.flag} {c.value}
                </option>
              ))}
            </select>
            {formErrors.country && (
              <p className="text-xs text-danger">{formErrors.country}</p>
            )}
          </div>

          {/* Method radio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/70">
              Delivery Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { value: "bank", label: "Bank Transfer", icon: Landmark },
                  {
                    value: "mobile_wallet",
                    label: "Mobile Wallet",
                    icon: Phone,
                  },
                  { value: "cash_pickup", label: "Cash Pickup", icon: MapPin },
                ] as const
              ).map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setFormMethod(m.value)}
                  className={`flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-xs font-medium transition-colors ${
                    formMethod === m.value
                      ? "border-gold-500 bg-gold-500/10 text-gold-500"
                      : "border-surface-border text-white/50 hover:bg-surface-hover hover:text-white"
                  }`}
                >
                  <m.icon size={18} />
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional fields */}
          {formMethod === "bank" && (
            <>
              <Input
                label="Bank Name"
                placeholder="e.g. National Bank of Egypt"
                value={formBankName}
                onChange={(e) => setFormBankName(e.target.value)}
                error={formErrors.bankName}
              />
              <Input
                label="Account Number / IBAN"
                placeholder="Enter account number"
                value={formAccountNumber}
                onChange={(e) => setFormAccountNumber(e.target.value)}
                error={formErrors.accountNumber}
              />
            </>
          )}
          {formMethod === "mobile_wallet" && (
            <Input
              label="Mobile Number"
              icon={Phone}
              placeholder="+254-712-345-678"
              value={formMobileNumber}
              onChange={(e) => setFormMobileNumber(e.target.value)}
              error={formErrors.mobileNumber}
            />
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                resetForm();
                setShowModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleAddBeneficiary}
            >
              Add Beneficiary
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
