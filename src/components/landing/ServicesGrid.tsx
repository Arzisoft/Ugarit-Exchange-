"use client";

import { ArrowLeftRight, Send, CreditCard, Bitcoin } from "lucide-react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface ServiceCard {
  title: string;
  description: string;
  icon: LucideIcon;
}

const services: ServiceCard[] = [
  {
    title: "Currency Exchange",
    description: "Convert between 19+ currencies at competitive rates",
    icon: ArrowLeftRight,
  },
  {
    title: "Money Transfer",
    description: "Send money to loved ones across Middle East & Africa",
    icon: Send,
  },
  {
    title: "Virtual Cards",
    description: "Get a digital debit card for online and in-store payments",
    icon: CreditCard,
  },
  {
    title: "Crypto Trading",
    description: "Buy, sell, and hold Bitcoin, Ethereum, and stablecoins",
    icon: Bitcoin,
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function ServicesGrid() {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
            Our Services
          </h2>
          <p className="mx-auto max-w-2xl text-white/50">
            Everything you need for international money management in one
            platform
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                className="group rounded-2xl border border-surface-border bg-surface-card p-6 transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/15">
                  <Icon size={22} className="text-gold-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/50">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
