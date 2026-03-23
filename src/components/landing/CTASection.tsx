"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-forest-900 to-forest-800 py-24">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-gold-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-forest-700/20 blur-3xl" />

      <motion.div
        className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Ready to Get Started?
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-lg text-white/60">
          Join thousands of users who trust Ugarit Exchange for their
          international transfers
        </p>
        <Link href="/auth/register">
          <Button variant="primary" size="lg" className="px-10 py-4 text-lg">
            Create Free Account
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
