export type FeeType = "exchange" | "transfer" | "crypto";

export type FeeResult = {
  fee: number;
  total: number;
};

/**
 * Fee schedule:
 * - exchange: 0.50% of amount (min $0.50)
 * - transfer: flat $5.00 for amounts up to $500, 0.75% above that
 * - crypto:   0.50% of amount (min $1.00)
 */
export function calculateFee(amount: number, type: FeeType): FeeResult {
  let fee: number;

  switch (type) {
    case "exchange":
      fee = Math.max(amount * 0.005, 0.5);
      break;

    case "transfer":
      if (amount <= 500) {
        fee = 5.0;
      } else {
        fee = amount * 0.0075;
      }
      break;

    case "crypto":
      fee = Math.max(amount * 0.005, 1.0);
      break;

    default:
      fee = 0;
  }

  fee = parseFloat(fee.toFixed(2));
  const total = parseFloat((amount + fee).toFixed(2));

  return { fee, total };
}

/**
 * Convert an amount from one currency to another using their USD-based rates.
 *
 * Both rates should be "1 USD = X units of that currency".
 * For example: fromRate = 1 (USD), toRate = 48.25 (EGP) means $100 = 4825 EGP.
 *
 * Formula: result = amount * (toRate / fromRate)
 */
export function convertAmount(
  amount: number,
  fromRate: number,
  toRate: number
): number {
  if (fromRate === 0) {
    return 0;
  }

  const result = amount * (toRate / fromRate);
  return parseFloat(result.toPrecision(8));
}
