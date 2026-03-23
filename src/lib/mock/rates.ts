export type Rate = {
  pair: string;
  buy: number;
  sell: number;
  change24h: number;
};

export type HistoricalRate = {
  date: string;
  rate: number;
};

const BASE_RATES: Record<string, number> = {
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.67,
  SAR: 3.75,
  EGP: 48.25,
  KWD: 0.31,
  QAR: 3.64,
  BHD: 0.38,
  OMR: 0.38,
  JOD: 0.71,
  TRY: 32.5,
  KES: 153.0,
  NGN: 1550.0,
  GHS: 14.5,
  TZS: 2680.0,
  UGX: 3780.0,
  ZAR: 18.2,
  MAD: 10.1,
  BTC: 0.0000154,
  ETH: 0.000285,
  USDT: 1.0,
  USDC: 1.0,
};

/**
 * Apply a random variance within +-range% to a base value.
 */
function applyVariance(base: number, range: number): number {
  const factor = 1 + (Math.random() * 2 - 1) * (range / 100);
  return base * factor;
}

/**
 * Generate live exchange rates with realistic random variance and buy/sell spread.
 * All rates are USD-based (e.g. "USD/EGP").
 */
export function generateRates(): Rate[] {
  return Object.entries(BASE_RATES).map(([code, baseRate]) => {
    const midRate = applyVariance(baseRate, 0.5);
    const spreadMargin = 0.005; // 0.5% spread
    const buy = midRate * (1 + spreadMargin);
    const sell = midRate * (1 - spreadMargin);
    const change24h = parseFloat(((Math.random() * 4 - 2) * 1).toFixed(2)); // -2% to +2%

    return {
      pair: `USD/${code}`,
      buy: parseFloat(buy.toPrecision(6)),
      sell: parseFloat(sell.toPrecision(6)),
      change24h,
    };
  });
}

/**
 * Generate historical rate data for chart rendering.
 * Returns an array of { date, rate } objects going back `days` days from today.
 */
export function generateHistoricalRates(
  pair: string,
  days: number
): HistoricalRate[] {
  const code = pair.split("/")[1];
  const baseRate = BASE_RATES[code];

  if (!baseRate) {
    return [];
  }

  const result: HistoricalRate[] = [];
  const now = new Date();
  let currentRate = baseRate;

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Random walk: each day the rate drifts by up to +-0.3%
    const drift = 1 + (Math.random() * 2 - 1) * 0.003;
    currentRate = currentRate * drift;

    result.push({
      date: date.toISOString().split("T")[0],
      rate: parseFloat(currentRate.toPrecision(6)),
    });
  }

  return result;
}

/**
 * Get the mid-market base rate for a currency code (no variance).
 */
export function getBaseRate(code: string): number | undefined {
  return BASE_RATES[code];
}
