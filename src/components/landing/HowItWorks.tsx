"use client";

import { UserPlus, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Create Account",
    description: "Sign up in minutes with just your email",
    icon: UserPlus,
  },
  {
    number: 2,
    title: "Verify Identity",
    description: "Complete KYC verification for full access",
    icon: Shield,
  },
  {
    number: 3,
    title: "Start Sending",
    description: "Exchange currencies and send money instantly",
    icon: Zap,
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function HowItWorks() {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-white/50">
            Get started in three simple steps
          </p>
        </div>

        <motion.div
          className="relative flex flex-col items-center gap-12 lg:flex-row lg:justify-center lg:gap-0"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                variants={stepVariants}
                className="relative flex flex-col items-center text-center lg:flex-1"
              >
                {/* Dashed connecting line (between steps, desktop only) */}
                {index < steps.length - 1 && (
                  <div className="pointer-events-none absolute left-[calc(50%+40px)] top-10 hidden h-px w-[calc(100%-80px)] border-t-2 border-dashed border-gold-500/30 lg:block" />
                )}

                {/* Circle with number and icon */}
                <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gold-500 shadow-lg shadow-gold-500/20">
                  <Icon size={28} className="text-forest-900" />
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-forest-900 text-xs font-bold text-white ring-2 ring-gold-500">
                    {step.number}
                  </span>
                </div>

                {/* Text */}
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="max-w-xs text-sm text-white/50">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
