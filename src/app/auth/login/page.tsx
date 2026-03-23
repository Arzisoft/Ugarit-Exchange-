"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { useAuthStore } from "@/lib/stores/auth-store";
import { getBrand } from "@/lib/brand/config";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const brand = getBrand();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError("");

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const success = login(data.email);
    if (success) {
      router.push("/dashboard");
    } else {
      setLoginError(
        "No account found with that email. Try admin@ugarit.com, sarah@example.com, or omar@example.com.",
      );
      setIsLoading(false);
    }
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
              <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
              <p className="mt-1 text-sm text-white/50">
                Sign in to your account
              </p>
            </div>

            {/* Login error */}
            {loginError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger"
              >
                {loginError}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                label="Password"
                type="password"
                placeholder="Enter your password"
                icon={Lock}
                autoComplete="current-password"
                error={errors.password?.message}
                {...register("password")}
              />

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-white/60 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-surface-border bg-surface-card text-gold-500 focus:ring-gold-500/30 accent-gold-500"
                  />
                  Remember me
                </label>
                <a
                  href="#"
                  className="text-sm text-gold-500 hover:text-gold-400 transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                className="w-full"
              >
                Sign In
              </Button>
            </form>
          </div>
        </Card>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-white/50">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-gold-500 hover:text-gold-400 transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
