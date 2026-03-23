export type Currency = {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  type: "fiat" | "crypto";
};

export const currencies: Currency[] = [
  // Fiat currencies
  { code: "USD", name: "US Dollar", symbol: "$", flag: "\u{1F1FA}\u{1F1F8}", type: "fiat" },
  { code: "EUR", name: "Euro", symbol: "\u20AC", flag: "\u{1F1EA}\u{1F1FA}", type: "fiat" },
  { code: "GBP", name: "British Pound", symbol: "\u00A3", flag: "\u{1F1EC}\u{1F1E7}", type: "fiat" },
  { code: "AED", name: "UAE Dirham", symbol: "\u062F.\u0625", flag: "\u{1F1E6}\u{1F1EA}", type: "fiat" },
  { code: "SAR", name: "Saudi Riyal", symbol: "\uFDFC", flag: "\u{1F1F8}\u{1F1E6}", type: "fiat" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E\u00A3", flag: "\u{1F1EA}\u{1F1EC}", type: "fiat" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "\u062F.\u0643", flag: "\u{1F1F0}\u{1F1FC}", type: "fiat" },
  { code: "QAR", name: "Qatari Riyal", symbol: "\uFDFC", flag: "\u{1F1F6}\u{1F1E6}", type: "fiat" },
  { code: "BHD", name: "Bahraini Dinar", symbol: ".\u062F.\u0628", flag: "\u{1F1E7}\u{1F1ED}", type: "fiat" },
  { code: "OMR", name: "Omani Rial", symbol: "\uFDFC", flag: "\u{1F1F4}\u{1F1F2}", type: "fiat" },
  { code: "JOD", name: "Jordanian Dinar", symbol: "\u062F.\u0627", flag: "\u{1F1EF}\u{1F1F4}", type: "fiat" },
  { code: "TRY", name: "Turkish Lira", symbol: "\u20BA", flag: "\u{1F1F9}\u{1F1F7}", type: "fiat" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", flag: "\u{1F1F0}\u{1F1EA}", type: "fiat" },
  { code: "NGN", name: "Nigerian Naira", symbol: "\u20A6", flag: "\u{1F1F3}\u{1F1EC}", type: "fiat" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "GH\u20B5", flag: "\u{1F1EC}\u{1F1ED}", type: "fiat" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", flag: "\u{1F1F9}\u{1F1FF}", type: "fiat" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh", flag: "\u{1F1FA}\u{1F1EC}", type: "fiat" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "\u{1F1FF}\u{1F1E6}", type: "fiat" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "\u062F.\u0645.", flag: "\u{1F1F2}\u{1F1E6}", type: "fiat" },

  // Crypto currencies
  { code: "BTC", name: "Bitcoin", symbol: "\u20BF", flag: "\u20BF", type: "crypto" },
  { code: "ETH", name: "Ethereum", symbol: "\u039E", flag: "\u039E", type: "crypto" },
  { code: "USDT", name: "Tether", symbol: "\u20AE", flag: "\u20AE", type: "crypto" },
  { code: "USDC", name: "USD Coin", symbol: "$", flag: "\u25C9", type: "crypto" },
];

export function getCurrency(code: string): Currency | undefined {
  return currencies.find((c) => c.code === code);
}

export const fiatCurrencies = currencies.filter((c) => c.type === "fiat");
export const cryptoCurrencies = currencies.filter((c) => c.type === "crypto");
