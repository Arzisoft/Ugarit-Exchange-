"use client";

import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { getBrand } from "@/lib/brand/config";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-surface"><div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" /></div>}>
      <VerifyPageContent />
    </Suspense>
  );
}

function VerifyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const brand = getBrand();

  const email = searchParams.get("email") || "your email";

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [verifyError, setVerifyError] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = useCallback(
    async (code: string[]) => {
      const fullCode = code.join("");
      if (fullCode.length !== CODE_LENGTH) return;

      setIsLoading(true);
      setVerifyError("");

      // Simulate verification delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Accept any 6-digit code for demo
      router.push("/dashboard");
    },
    [router],
  );

  const handleChange = (index: number, value: string) => {
    // Only allow single digits
    const digit = value.replace(/\D/g, "").slice(-1);

    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setVerifyError("");

    if (digit && index < CODE_LENGTH - 1) {
      // Move focus to next input
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are filled
    if (digit && newDigits.every((d) => d !== "")) {
      handleVerify(newDigits);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (digits[index] === "" && index > 0) {
        // Move to previous input on backspace when current is empty
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);

    // Focus the next empty input or last input
    const nextEmpty = newDigits.findIndex((d) => d === "");
    const focusIndex = nextEmpty === -1 ? CODE_LENGTH - 1 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();

    // Auto-submit if all filled
    if (newDigits.every((d) => d !== "")) {
      handleVerify(newDigits);
    }
  };

  const handleResend = () => {
    setCountdown(RESEND_COOLDOWN);
    setDigits(Array(CODE_LENGTH).fill(""));
    setVerifyError("");
    inputRefs.current[0]?.focus();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = digits.join("");
    if (fullCode.length !== CODE_LENGTH) {
      setVerifyError("Please enter all 6 digits");
      return;
    }
    handleVerify(digits);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      {/* Decorative gradient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/5 blur-[120px]" />
        <div className="absolute left-1/3 top-2/3 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest-700/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Brand logo + name */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <img
            src={brand.logo}
            alt={brand.name}
            className="h-12 w-12"
          />
          <h1 className="text-xl font-bold text-white">{brand.name}</h1>
        </div>

        <Card className="overflow-hidden">
          <div className="space-y-6">
            {/* Heading */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">
                Verify Your Email
              </h2>
              <p className="mt-1 text-sm text-white/50">
                We&apos;ve sent a 6-digit code to{" "}
                <span className="text-white/70 font-medium">{email}</span>
              </p>
            </div>

            {/* Error */}
            {verifyError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger text-center"
              >
                {verifyError}
              </motion.div>
            )}

            {/* OTP form */}
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Digit inputs */}
              <div className="flex items-center justify-center gap-3">
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={`h-14 w-12 rounded-lg border bg-surface-card text-center text-xl font-bold text-white outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 ${
                      digit
                        ? "border-gold-500/40"
                        : "border-surface-border"
                    }`}
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>

              {/* Verify button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                className="w-full"
              >
                Verify
              </Button>
            </form>

            {/* Resend section */}
            <div className="text-center">
              <p className="text-sm text-white/50">
                Didn&apos;t receive the code?{" "}
                {countdown > 0 ? (
                  <span className="text-white/30">
                    Resend in {countdown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="font-medium text-gold-500 hover:text-gold-400 transition-colors cursor-pointer"
                  >
                    Resend
                  </button>
                )}
              </p>
            </div>
          </div>
        </Card>

        {/* Back to login link */}
        <p className="mt-6 text-center text-sm text-white/50">
          <Link
            href="/auth/login"
            className="font-medium text-gold-500 hover:text-gold-400 transition-colors"
          >
            Back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
