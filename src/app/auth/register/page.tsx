"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, Lock } from "lucide-react";
import { motion } from "framer-motion";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { useAuthStore } from "@/lib/stores/auth-store";
import { getBrand } from "@/lib/brand/config";

const registerSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeTerms: z.literal(true, {
      error: "You must agree to the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const brand = getBrand();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeTerms: undefined as unknown as true,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // For demo purposes, log the user in with the provided email
    login(data.email);
    router.push("/auth/verify");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      {/* Decorative gradient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/5 blur-[120px]" />
        <div className="absolute right-1/3 top-2/3 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest-700/10 blur-[100px]" />
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
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <p className="mt-1 text-sm text-white/50">
                Start sending money in minutes
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                icon={User}
                autoComplete="name"
                error={errors.fullName?.message}
                {...register("fullName")}
              />

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                autoComplete="email"
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Phone (optional)"
                type="tel"
                placeholder="+1 (555) 000-0000"
                icon={Phone}
                autoComplete="tel"
                error={errors.phone?.message}
                {...register("phone")}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Min 8 chars, letter + number"
                icon={Lock}
                autoComplete="new-password"
                error={errors.password?.message}
                {...register("password")}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                icon={Lock}
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              {/* Terms checkbox */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-start gap-2 text-sm text-white/60 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-surface-border bg-surface-card text-gold-500 focus:ring-gold-500/30 accent-gold-500"
                    {...register("agreeTerms")}
                  />
                  <span>
                    I agree to the{" "}
                    <Link
                      href="/legal/terms"
                      className="text-gold-500 hover:text-gold-400 transition-colors"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/legal/privacy"
                      className="text-gold-500 hover:text-gold-400 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-xs text-danger">
                    {errors.agreeTerms.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                className="w-full"
              >
                Create Account
              </Button>
            </form>
          </div>
        </Card>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-white/50">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-gold-500 hover:text-gold-400 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
