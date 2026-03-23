"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  FileText,
  Home,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import StepWizard from "@/components/ui/StepWizard";
import DropZone from "@/components/ui/DropZone";
import { useAuthStore } from "@/lib/stores/auth-store";

/* ---------- Schema for Step 0 (Personal Info) ---------- */
const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  address: z.string().min(1, "Address is required"),
});

type PersonalInfoData = z.infer<typeof personalInfoSchema>;

/* ---------- Country list ---------- */
const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Australia",
  "Austria",
  "Bahrain",
  "Bangladesh",
  "Belgium",
  "Brazil",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Czech Republic",
  "Denmark",
  "Egypt",
  "Ethiopia",
  "Finland",
  "France",
  "Germany",
  "Ghana",
  "Greece",
  "India",
  "Indonesia",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Jordan",
  "Kenya",
  "Kuwait",
  "Lebanon",
  "Libya",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Oman",
  "Pakistan",
  "Palestine",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Saudi Arabia",
  "Senegal",
  "Singapore",
  "Somalia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Sweden",
  "Switzerland",
  "Syria",
  "Tanzania",
  "Thailand",
  "Tunisia",
  "Turkey",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Venezuela",
  "Vietnam",
  "Yemen",
];

/* ---------- Step names for the wizard header ---------- */
const stepLabels = [
  "Personal Info",
  "National ID",
  "Proof of Address",
  "Review & Submit",
];

/* ---------- Props ---------- */
interface KYCWizardProps {
  onComplete: () => void;
}

export default function KYCWizard({ onComplete }: KYCWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | undefined>(undefined);
  const [addressFile, setAddressFile] = useState<File | null>(null);
  const [addressPreview, setAddressPreview] = useState<string | undefined>(
    undefined,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const user = useAuthStore((s) => s.user);

  /* ---------- Step 0 form ---------- */
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
  } = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: user?.name ?? "",
      dateOfBirth: "",
      nationality: "",
      address: "",
    },
  });

  /* ---------- File handlers ---------- */
  const handleIdFile = useCallback((file: File) => {
    setIdFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setIdPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setIdPreview(undefined);
    }
  }, []);

  const handleAddressFile = useCallback((file: File) => {
    setAddressFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setAddressPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setAddressPreview(undefined);
    }
  }, []);

  /* ---------- Navigation ---------- */
  const goNext = async () => {
    if (currentStep === 0) {
      const valid = await trigger();
      if (!valid) return;
    }
    if (currentStep === 1 && !idFile) return;
    if (currentStep === 2 && !addressFile) return;
    setCurrentStep((s) => Math.min(s + 1, 3));
  };

  const goBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  /* ---------- Submit ---------- */
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update KYC status to pending
    useAuthStore.setState((state) => ({
      user: state.user ? { ...state.user, kycStatus: "pending" as const } : null,
    }));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  /* ---------- Success screen ---------- */
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-8 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
          <CheckCircle size={32} className="text-success" />
        </div>
        <h3 className="text-xl font-bold text-white">
          Documents Submitted Successfully
        </h3>
        <p className="max-w-sm text-sm text-white/60">
          Your KYC verification documents have been submitted. Our team will
          review them and get back to you within 1-3 business days.
        </p>
        <Button variant="primary" onClick={onComplete} className="mt-2">
          Done
        </Button>
      </motion.div>
    );
  }

  const personalInfo = getValues();

  return (
    <div className="space-y-6">
      {/* Step wizard header */}
      <StepWizard steps={stepLabels} currentStep={currentStep + 1} />

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Step 0 — Personal Info */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Personal Information
                </h3>
                <p className="text-sm text-white/50">
                  Please provide your personal details as they appear on your ID
                  document.
                </p>
              </div>

              <Input
                label="Full Name"
                placeholder="Enter your full legal name"
                error={errors.fullName?.message}
                {...register("fullName")}
              />

              <Input
                label="Date of Birth"
                type="date"
                error={errors.dateOfBirth?.message}
                {...register("dateOfBirth")}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/70">
                  Nationality
                </label>
                <select
                  className={`w-full rounded-lg border bg-surface-card px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 ${
                    errors.nationality
                      ? "border-danger focus:border-danger focus:ring-danger/30"
                      : "border-surface-border"
                  }`}
                  {...register("nationality")}
                >
                  <option value="" className="bg-forest-900">
                    Select your nationality
                  </option>
                  {countries.map((country) => (
                    <option
                      key={country}
                      value={country}
                      className="bg-forest-900"
                    >
                      {country}
                    </option>
                  ))}
                </select>
                {errors.nationality && (
                  <p className="text-xs text-danger">
                    {errors.nationality.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/70">
                  Address
                </label>
                <textarea
                  placeholder="Enter your full residential address"
                  rows={3}
                  className={`w-full rounded-lg border bg-surface-card px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 resize-none ${
                    errors.address
                      ? "border-danger focus:border-danger focus:ring-danger/30"
                      : "border-surface-border"
                  }`}
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-xs text-danger">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 1 — Upload National ID */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  National ID / Passport
                </h3>
                <p className="text-sm text-white/50">
                  Upload a clear photo or scan of your government-issued ID or
                  passport.
                </p>
              </div>

              <DropZone
                onFile={handleIdFile}
                accept="image/png, image/jpeg, image/webp, application/pdf"
                label="Drag & drop your ID document, or click to select"
                preview={idPreview}
              />

              <div className="flex items-start gap-2 rounded-lg border border-surface-border bg-surface-card/50 p-3">
                <FileText size={16} className="mt-0.5 shrink-0 text-white/40" />
                <div className="text-xs text-white/50">
                  <p className="font-medium text-white/70">Accepted formats</p>
                  <p>PNG, JPG, WebP, or PDF. Max file size: 10 MB.</p>
                </div>
              </div>

              {!idFile && (
                <p className="text-xs text-warning">
                  Please upload your ID document to continue.
                </p>
              )}
            </div>
          )}

          {/* Step 2 — Upload Proof of Address */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Proof of Address
                </h3>
                <p className="text-sm text-white/50">
                  Upload a recent utility bill, bank statement, or government
                  correspondence showing your address.
                </p>
              </div>

              <DropZone
                onFile={handleAddressFile}
                accept="image/png, image/jpeg, image/webp, application/pdf"
                label="Drag & drop your proof of address, or click to select"
                preview={addressPreview}
              />

              <div className="flex items-start gap-2 rounded-lg border border-surface-border bg-surface-card/50 p-3">
                <Home size={16} className="mt-0.5 shrink-0 text-white/40" />
                <div className="text-xs text-white/50">
                  <p className="font-medium text-white/70">Accepted documents</p>
                  <p>
                    Utility bill, bank statement, or government letter dated
                    within the last 3 months. PNG, JPG, WebP, or PDF.
                  </p>
                </div>
              </div>

              {!addressFile && (
                <p className="text-xs text-warning">
                  Please upload a proof of address document to continue.
                </p>
              )}
            </div>
          )}

          {/* Step 3 — Review & Submit */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Review & Submit
                </h3>
                <p className="text-sm text-white/50">
                  Please review your information before submitting.
                </p>
              </div>

              {/* Personal info summary */}
              <div className="space-y-3 rounded-lg border border-surface-border bg-surface-card/50 p-4">
                <h4 className="text-sm font-semibold text-white/80">
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-white/40">Full Name</p>
                    <p className="text-sm text-white">
                      {personalInfo.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Date of Birth</p>
                    <p className="text-sm text-white">
                      {personalInfo.dateOfBirth}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Nationality</p>
                    <p className="text-sm text-white">
                      {personalInfo.nationality}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-white/40">Address</p>
                    <p className="text-sm text-white">{personalInfo.address}</p>
                  </div>
                </div>
              </div>

              {/* Document previews */}
              <div className="space-y-3 rounded-lg border border-surface-border bg-surface-card/50 p-4">
                <h4 className="text-sm font-semibold text-white/80">
                  Uploaded Documents
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-xs text-white/40">National ID / Passport</p>
                    {idPreview ? (
                      <img
                        src={idPreview}
                        alt="ID Preview"
                        className="h-28 w-full rounded-lg border border-surface-border object-cover"
                      />
                    ) : (
                      <div className="flex h-28 items-center justify-center rounded-lg border border-surface-border bg-surface-card">
                        <div className="text-center">
                          <FileText
                            size={24}
                            className="mx-auto text-white/30"
                          />
                          <p className="mt-1 text-xs text-white/50">
                            {idFile?.name ?? "No file"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-white/40">Proof of Address</p>
                    {addressPreview ? (
                      <img
                        src={addressPreview}
                        alt="Address Proof Preview"
                        className="h-28 w-full rounded-lg border border-surface-border object-cover"
                      />
                    ) : (
                      <div className="flex h-28 items-center justify-center rounded-lg border border-surface-border bg-surface-card">
                        <div className="text-center">
                          <FileText
                            size={24}
                            className="mx-auto text-white/30"
                          />
                          <p className="mt-1 text-xs text-white/50">
                            {addressFile?.name ?? "No file"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between border-t border-surface-border pt-4">
        <Button
          variant="secondary"
          size="md"
          onClick={goBack}
          disabled={currentStep === 0}
        >
          <ChevronLeft size={16} />
          Back
        </Button>

        {currentStep < 3 ? (
          <Button variant="primary" size="md" onClick={goNext}>
            Continue
            <ChevronRight size={16} />
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            loading={isSubmitting}
            onClick={handleFinalSubmit}
          >
            Submit for Verification
          </Button>
        )}
      </div>
    </div>
  );
}
