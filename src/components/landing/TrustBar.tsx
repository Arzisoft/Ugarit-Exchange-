"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatProps {
  value: string;
  numericEnd: number;
  prefix?: string;
  suffix: string;
  label: string;
  inView: boolean;
}

function AnimatedStat({
  value,
  numericEnd,
  prefix = "",
  suffix,
  label,
  inView,
}: StatProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let frame: number;
    const duration = 2000; // ms
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numericEnd));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [inView, numericEnd]);

  return (
    <div className="flex flex-col items-center gap-1 px-8 py-4">
      <span className="text-3xl font-bold text-white sm:text-4xl">
        {prefix}
        {inView ? count.toLocaleString() : "0"}
        {suffix}
      </span>
      <span className="text-sm font-medium text-white/50">{label}</span>
    </div>
  );
}

const stats = [
  {
    value: "50+",
    numericEnd: 50,
    suffix: "+",
    label: "Countries",
  },
  {
    value: "$7M+",
    numericEnd: 7,
    prefix: "$",
    suffix: "M+",
    label: "Processed",
  },
  {
    value: "25,000+",
    numericEnd: 25000,
    suffix: "+",
    label: "Users",
  },
];

export default function TrustBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.section
      ref={ref}
      className="border-y border-surface-border bg-forest-900/50 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center divide-y divide-surface-border sm:flex-row sm:divide-x sm:divide-y-0">
        {stats.map((stat) => (
          <AnimatedStat
            key={stat.label}
            value={stat.value}
            numericEnd={stat.numericEnd}
            prefix={stat.prefix}
            suffix={stat.suffix}
            label={stat.label}
            inView={inView}
          />
        ))}
      </div>
    </motion.section>
  );
}
