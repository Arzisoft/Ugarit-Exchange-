"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Plus, CheckCircle } from "lucide-react";
import { useCardStore } from "@/lib/stores/card-store";
import VirtualCard from "@/components/cards/VirtualCard";
import CardControls from "@/components/cards/CardControls";
import CardTransactions from "@/components/cards/CardTransactions";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

const cardCurrencies = ["USD", "EUR", "GBP", "AED", "SAR", "EGP"] as const;
const cardTypes = ["mastercard", "visa"] as const;

export default function CardsPage() {
  const cards = useCardStore((s) => s.cards);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(
    cards.length > 0 ? cards[0].id : null,
  );

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [requestCurrency, setRequestCurrency] = useState<string>("USD");
  const [requestType, setRequestType] = useState<"mastercard" | "visa">(
    "mastercard",
  );
  const [requested, setRequested] = useState(false);

  const selectedCard = cards.find((c) => c.id === selectedCardId) ?? null;

  function handleRequestCard() {
    setRequested(true);
    // Reset after 2s so the modal can be reused
    setTimeout(() => {
      setRequested(false);
      setModalOpen(false);
    }, 2000);
  }

  function openModal() {
    setRequested(false);
    setRequestCurrency("USD");
    setRequestType("mastercard");
    setModalOpen(true);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/10">
              <CreditCard size={18} className="text-gold-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">Virtual Cards</h1>
          </div>
          <p className="text-sm text-white/50 ml-12">
            Manage your digital debit cards
          </p>
        </div>
        <Button variant="primary" onClick={openModal}>
          <Plus size={16} />
          Request New Card
        </Button>
      </div>

      {/* Cards row — horizontal scroll on small screens */}
      {cards.length > 0 && (
        <section>
          <h3 className="mb-4 text-sm font-semibold text-white/60">
            Your Cards
          </h3>
          <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">
            {cards.map((card) => (
              <motion.div
                key={card.id}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <VirtualCard
                  card={card}
                  isSelected={card.id === selectedCardId}
                  onClick={() => setSelectedCardId(card.id)}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state when no cards */}
      {cards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 mb-4">
            <CreditCard size={28} className="text-white/30" />
          </div>
          <p className="text-lg font-medium text-white/60">
            No virtual cards yet
          </p>
          <p className="text-sm text-white/40 mt-1 mb-6">
            Request your first digital debit card to get started
          </p>
          <Button variant="primary" onClick={openModal}>
            <Plus size={16} />
            Request New Card
          </Button>
        </div>
      )}

      {/* Selected card details */}
      {selectedCard && (
        <motion.div
          key={selectedCard.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          {/* Left: Controls */}
          <CardControls card={selectedCard} />

          {/* Right: Transactions */}
          <CardTransactions cardId={selectedCard.id} />
        </motion.div>
      )}

      {/* Request New Card Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Request New Card"
        size="sm"
      >
        <AnimatePresence mode="wait">
          {requested ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-6 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 mb-4">
                <CheckCircle size={28} className="text-success" />
              </div>
              <p className="text-lg font-semibold text-white">
                Card Requested!
              </p>
              <p className="text-sm text-white/50 mt-1">
                Your new {requestType === "mastercard" ? "Mastercard" : "Visa"}{" "}
                card in {requestCurrency} is being processed.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Currency Selection */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Currency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {cardCurrencies.map((cur) => (
                    <button
                      key={cur}
                      type="button"
                      onClick={() => setRequestCurrency(cur)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        requestCurrency === cur
                          ? "border-gold-500 bg-gold-500/10 text-gold-400"
                          : "border-surface-border bg-surface-card text-white/60 hover:bg-surface-hover hover:text-white"
                      }`}
                    >
                      {cur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Type Selection */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Card Network
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {cardTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setRequestType(type)}
                      className={`rounded-lg border px-4 py-3 text-sm font-bold tracking-wider uppercase transition-colors ${
                        requestType === type
                          ? "border-gold-500 bg-gold-500/10 text-gold-400"
                          : "border-surface-border bg-surface-card text-white/60 hover:bg-surface-hover hover:text-white"
                      }`}
                    >
                      {type === "mastercard" ? "Mastercard" : "Visa"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleRequestCard}
              >
                <CreditCard size={16} />
                Request Card
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </div>
  );
}
