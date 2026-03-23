export type BeneficiaryMethod = "bank" | "mobile_wallet" | "cash_pickup";

export type Beneficiary = {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  method: BeneficiaryMethod;
  bankName?: string;
  accountNumber?: string;
  mobileNumber?: string;
  nickname: string;
};

export const mockBeneficiaries: Beneficiary[] = [
  {
    id: "ben_001",
    name: "Fatma El-Sayed",
    country: "Egypt",
    countryFlag: "\u{1F1EA}\u{1F1EC}",
    method: "bank",
    bankName: "National Bank of Egypt",
    accountNumber: "EG38 0019 0005 0000 0000 2631 8000",
    nickname: "Fatma - Cairo Rent",
  },
  {
    id: "ben_002",
    name: "Mohammed Al-Rashid",
    country: "UAE",
    countryFlag: "\u{1F1E6}\u{1F1EA}",
    method: "bank",
    bankName: "Emirates NBD",
    accountNumber: "AE07 0331 2345 6789 0123 456",
    nickname: "Mohammed - Dubai Office",
  },
  {
    id: "ben_003",
    name: "Jane Wanjiku",
    country: "Kenya",
    countryFlag: "\u{1F1F0}\u{1F1EA}",
    method: "mobile_wallet",
    mobileNumber: "+254-712-345-678",
    nickname: "Jane - M-Pesa",
  },
  {
    id: "ben_004",
    name: "Chidi Okafor",
    country: "Nigeria",
    countryFlag: "\u{1F1F3}\u{1F1EC}",
    method: "bank",
    bankName: "Zenith Bank",
    accountNumber: "0123456789",
    nickname: "Chidi - Lagos Business",
  },
  {
    id: "ben_005",
    name: "Elif Yilmaz",
    country: "Turkey",
    countryFlag: "\u{1F1F9}\u{1F1F7}",
    method: "cash_pickup",
    nickname: "Elif - Istanbul Pickup",
  },
];
