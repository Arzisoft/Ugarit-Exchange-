import { getCurrency } from "@/lib/mock/currencies";

/**
 * Format a numeric amount with the appropriate currency symbol and locale formatting.
 * For crypto currencies, uses up to 8 decimal places; for fiat, 2 decimal places.
 */
export function formatCurrency(amount: number, currency: string): string {
  const currencyDef = getCurrency(currency);
  const isCrypto = currencyDef?.type === "crypto";

  const maximumFractionDigits = isCrypto ? 8 : 2;
  const minimumFractionDigits = isCrypto ? 2 : 2;

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);

  const symbol = currencyDef?.symbol ?? currency;

  return `${symbol}${formatted}`;
}

/**
 * Format a date value into a human-readable string.
 * Accepts Date objects or ISO string representations.
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Format a numeric value as a percentage string with sign indicator.
 * Positive values get a "+" prefix, negative values already include "-".
 */
export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Format a card number by masking all but the last four digits.
 * Input can be a full number or already-masked string.
 */
export function formatCardNumber(number: string): string {
  const digitsOnly = number.replace(/\D/g, "");

  if (digitsOnly.length <= 4) {
    return `**** **** **** ${digitsOnly}`;
  }

  const lastFour = digitsOnly.slice(-4);
  return `**** **** **** ${lastFour}`;
}
