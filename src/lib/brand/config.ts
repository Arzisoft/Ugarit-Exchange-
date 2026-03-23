export type BrandConfig = {
  id: "ugarit" | "palremit";
  name: string;
  tagline: string;
  logo: string;
  colors: {
    primary900: string;
    primary800: string;
    primary700: string;
    gold500: string;
    gold400: string;
  };
  supportedCurrencies: string[];
  supportedCrypto: string[];
  footer: {
    company: string;
    licenses: string[];
    builtBy: string;
  };
};

import { ugaritConfig } from "./ugarit";
import { palremitConfig } from "./palremit";

export function getBrand(): BrandConfig {
  const brandId = process.env.NEXT_PUBLIC_BRAND || "ugarit";
  return brandId === "palremit" ? palremitConfig : ugaritConfig;
}
