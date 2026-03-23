"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Snowflake } from "lucide-react";
import type { Card } from "@/lib/mock/cards";
import Badge from "@/components/ui/Badge";

interface VirtualCardProps {
  card: Card;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function VirtualCard({
  card,
  isSelected = false,
  onClick,
}: VirtualCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const isFrozen = card.status === "frozen";

  const handleClick = () => {
    if (onClick) onClick();
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped((prev) => !prev);
  };

  const expiryMonth = String(card.expiryMonth).padStart(2, "0");
  const expiryYear = String(card.expiryYear).slice(-2);

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer select-none ${isSelected ? "scale-105" : ""}`}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-[340px] h-[210px]"
      >
        {/* ---- Front Face ---- */}
        <div
          onClick={handleFlip}
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Gradient background */}
          <div
            className={`absolute inset-0 ${
              isFrozen
                ? "bg-gradient-to-br from-gray-600 to-gray-500"
                : "bg-gradient-to-br from-forest-900 to-forest-700"
            }`}
          />

          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)",
              }}
            />
          </div>

          {/* Card content */}
          <div className="relative z-10 flex flex-col justify-between h-full p-5">
            {/* Top row: Network logo + currency */}
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold tracking-[0.2em] text-white/90 uppercase">
                {card.type === "mastercard" ? "MASTERCARD" : "VISA"}
              </span>
              <span className="text-xs font-semibold text-white/60">
                {card.currency}
              </span>
            </div>

            {/* Chip graphic */}
            <div className="mt-3">
              <div className="w-10 h-7 rounded-md bg-gold-400/80 border border-gold-300/40">
                <div className="w-full h-full rounded-md bg-gradient-to-br from-gold-300/50 to-gold-500/50" />
              </div>
            </div>

            {/* Masked card number */}
            <div className="mt-4">
              <p className="text-lg font-mono tracking-[0.15em] text-white">
                {"•••• •••• •••• " + card.lastFour}
              </p>
            </div>

            {/* Bottom row: name + expiry */}
            <div className="flex items-end justify-between mt-3">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">
                  Cardholder
                </p>
                <p className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                  {card.cardholderName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">
                  Expires
                </p>
                <p className="text-xs font-semibold text-white/90 font-mono">
                  {expiryMonth}/{expiryYear}
                </p>
              </div>
            </div>
          </div>

          {/* Frozen overlay */}
          {isFrozen && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl bg-black/40 backdrop-blur-[2px]">
              <Snowflake size={28} className="text-white/80" />
              <Badge variant="danger">FROZEN</Badge>
            </div>
          )}

          {/* Selection ring */}
          {isSelected && (
            <div className="absolute inset-0 rounded-2xl ring-2 ring-gold-500 ring-offset-2 ring-offset-surface pointer-events-none" />
          )}
        </div>

        {/* ---- Back Face ---- */}
        <div
          onClick={handleFlip}
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Background */}
          <div
            className={`absolute inset-0 ${
              isFrozen
                ? "bg-gradient-to-br from-gray-600 to-gray-500"
                : "bg-gradient-to-br from-forest-900 to-forest-700"
            }`}
          />

          <div className="relative z-10 flex flex-col h-full">
            {/* Magnetic stripe */}
            <div className="mt-6 h-11 w-full bg-gray-900/80" />

            {/* CVV area */}
            <div className="mt-5 mx-5">
              <div className="flex items-center justify-end gap-3 bg-white/10 rounded-md px-4 py-2">
                <span className="text-[10px] text-white/50 uppercase tracking-wider">
                  CVV
                </span>
                <span className="font-mono text-sm font-bold text-white tracking-widest">
                  {card.cvv}
                </span>
              </div>
            </div>

            {/* Flip back text */}
            <div className="flex-1 flex items-end justify-center pb-5">
              <p className="text-xs text-white/40">Click to flip back</p>
            </div>
          </div>

          {/* Selection ring */}
          {isSelected && (
            <div className="absolute inset-0 rounded-2xl ring-2 ring-gold-500 ring-offset-2 ring-offset-surface pointer-events-none" />
          )}
        </div>
      </motion.div>
    </div>
  );
}
