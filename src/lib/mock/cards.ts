export type CardType = "mastercard" | "visa";
export type CardStatus = "active" | "frozen";

export type Card = {
  id: string;
  type: CardType;
  currency: string;
  lastFour: string;
  maskedNumber: string;
  cardholderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  status: CardStatus;
  spendingLimit: number;
  onlinePayments: boolean;
  contactless: boolean;
  atmWithdrawals: boolean;
};

export const mockCards: Card[] = [
  {
    id: "card_001",
    type: "mastercard",
    currency: "USD",
    lastFour: "4532",
    maskedNumber: "**** **** **** 4532",
    cardholderName: "Sarah Johnson",
    expiryMonth: 9,
    expiryYear: 2027,
    cvv: "318",
    status: "active",
    spendingLimit: 5000,
    onlinePayments: true,
    contactless: true,
    atmWithdrawals: true,
  },
  {
    id: "card_002",
    type: "visa",
    currency: "EUR",
    lastFour: "8891",
    maskedNumber: "**** **** **** 8891",
    cardholderName: "Sarah Johnson",
    expiryMonth: 3,
    expiryYear: 2028,
    cvv: "752",
    status: "frozen",
    spendingLimit: 3000,
    onlinePayments: true,
    contactless: false,
    atmWithdrawals: false,
  },
];
