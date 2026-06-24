export type TransactionType =
  | "purchase"
  | "sale"
  | "sale-purchase"
  | "remortgage"
  | "transfer-of-equity";

export type SingleTransactionType = "purchase" | "sale" | "remortgage" | "transfer-of-equity";

export type LeaseholdType = "standard" | "high-rise";

export type LineItem = {
  label: string;
  amount: number;
};

export type BreakdownInput = {
  propertyValue: number;
  isLeasehold: boolean;
  leaseholdType: LeaseholdType | null;
  hasMortgage?: boolean | null;
  includeSearchPack?: boolean;
  peopleInvolved?: number;
  selectedOptions?: string[];
  giftedDepositCount?: number;
  htbIsaCount?: number;
  lifetimeIsaCount?: number;
  forceNotFirstTimeBuyer?: boolean;
};

export type DetailedBreakdown = {
  legalFee: number;
  legalFeeVat: number;
  supplements: LineItem[];
  supplementsVat: number;
  disbursements: LineItem[];
  sdltDeferred: boolean;
  subtotal: number;
};

export const VAT_RATE = 0.2;

// Universal fee bands — same base legal fee for all transaction types
const feeBands = [
  { min: 0,       max: 150000 as number | null, fee: 750  as number | null, percentOfValue: undefined as number | undefined },
  { min: 150001,  max: 300000,                  fee: 850,                   percentOfValue: undefined },
  { min: 300001,  max: 600000,                  fee: 900,                   percentOfValue: undefined },
  { min: 600001,  max: 900000,                  fee: 1100,                  percentOfValue: undefined },
  { min: 900001,  max: 999000,                  fee: 1200,                  percentOfValue: undefined },
  { min: 1000000, max: null,                    fee: null,                  percentOfValue: 0.0015 },
];

function feeFromBands(value: number): number {
  const band = feeBands.find((b) => value >= b.min && (b.max === null || value <= b.max)) ?? feeBands[feeBands.length - 1];
  if (band.percentOfValue !== undefined) return Math.round(value * band.percentOfValue);
  return band.fee ?? 0;
}

export function calculateBreakdown(type: SingleTransactionType, input: BreakdownInput): DetailedBreakdown {
  const {
    propertyValue,
    isLeasehold,
    leaseholdType,
    hasMortgage,
    includeSearchPack,
    peopleInvolved = 1,
    selectedOptions = [],
    giftedDepositCount = 0,
    htbIsaCount = 0,
    lifetimeIsaCount = 0,
  } = input;

  const legalFee = feeFromBands(propertyValue);
  const legalFeeVat = Math.round(legalFee * VAT_RATE);
  const supplements: LineItem[] = [];
  const disbursements: LineItem[] = [];
  let sdltDeferred = false;

  // ── SALE ─────────────────────────────────────────────────────────────────
  if (type === "sale") {
    // Auto supplement
    supplements.push({ label: "File Opening Fee", amount: 50 });

    // Leasehold
    if (isLeasehold) {
      supplements.push({ label: "Leasehold Fee", amount: 300 });
      if (leaseholdType === "high-rise") {
        supplements.push({ label: "Building Safety Act Fee", amount: 150 });
      }
    }

    // Selectable supplements
    const saleMap: Record<string, number> = {
      "Shared Ownership":         250,
      "Help to Buy Equity Loan":  300,
      "Unregistered":             350,
      "New Build":                300,
      "Declaration of Trust":     150,
      "Auction Pack Preparation": 550,
    };
    for (const opt of selectedOptions) {
      if (saleMap[opt] !== undefined) supplements.push({ label: opt, amount: saleMap[opt] });
    }

    // Disbursements
    disbursements.push({ label: "Bank Transfer Fee",        amount: 36 });
    disbursements.push({ label: "Office Copy (per document)", amount: 3 });

  // ── PURCHASE ──────────────────────────────────────────────────────────────
  } else if (type === "purchase") {
    sdltDeferred = true;

    // Auto supplements
    supplements.push({ label: "File Opening Fee", amount: 50 });
    if (hasMortgage) supplements.push({ label: "Mortgage Handling Fee", amount: 100 });

    // Leasehold
    if (isLeasehold) {
      supplements.push({ label: "Leasehold Fee", amount: 300 });
      if (leaseholdType === "high-rise") {
        supplements.push({ label: "Building Safety Act Fee", amount: 350 });
      }
    }

    // Selectable supplements
    const purchaseMap: Record<string, number> = {
      "2nd Home or Buy To Let":    50,
      "New Build Legal Work Fee":  300,
      "Shared Ownership":          250,
      "Right To Buy":              200,
      "Buying via Limited Company": 100,
      "Declaration of Trust":      150,
      "Unregistered":              350,
      "Share of Freehold":         200,
      "Auction Pack Review":       450,
    };

    for (const opt of selectedOptions) {
      if (opt === "Gifted Deposit") {
        if (giftedDepositCount > 0) {
          supplements.push({
            label: `Gifted Deposit (${giftedDepositCount} gift${giftedDepositCount > 1 ? "s" : ""} x £150 each)`,
            amount: giftedDepositCount * 150,
          });
        }
      } else if (opt === "Help to Buy ISA") {
        if (htbIsaCount > 0) {
          supplements.push({
            label: `Help to buy ISA (${htbIsaCount} HTB ISA x £100 each)`,
            amount: htbIsaCount * 100,
          });
        }
      } else if (opt === "Lifetime ISA") {
        if (lifetimeIsaCount > 0) {
          supplements.push({
            label: `Lifetime ISA (${lifetimeIsaCount} LT ISA x £100 each)`,
            amount: lifetimeIsaCount * 100,
          });
        }
      } else if (purchaseMap[opt] !== undefined) {
        supplements.push({ label: opt, amount: purchaseMap[opt] });
      }
      // "Buying First Home" — SDLT relief only, no supplement fee
    }

    // Disbursements
    disbursements.push({ label: "Bank Transfer Fee",    amount: 36 });
    disbursements.push({ label: "Case Management Fee",  amount: 30 });
    disbursements.push({ label: "HMLR Search",          amount: 7  });
    if (hasMortgage || includeSearchPack) {
      disbursements.push({
        label: "Searches Pack (Local Authority, Drainage & Water, Environmental Searches)",
        amount: 250,
      });
    }
    disbursements.push({
      label: `Bankruptcy Searches (${peopleInvolved} search${peopleInvolved > 1 ? "es" : ""} x £6 each)`,
      amount: peopleInvolved * 6,
    });
    disbursements.push({ label: "Lawyer Checker",      amount: 20 });
    disbursements.push({ label: "Land Registry Fees",  amount: 95 });

  // ── REMORTGAGE ────────────────────────────────────────────────────────────
  } else if (type === "remortgage") {
    supplements.push({ label: "File Opening Fee", amount: 50 });

    const remortgageMap: Record<string, number> = {
      "Buy To Let":       50,
      "Share of Freehold": 200,
      "Client is Company": 100,
    };
    for (const opt of selectedOptions) {
      if (remortgageMap[opt] !== undefined) supplements.push({ label: opt, amount: remortgageMap[opt] });
    }

    disbursements.push({ label: "HMLR Official Copy of Register (per document)", amount: 3   });
    disbursements.push({ label: "Bank Transfer Fee",                              amount: 36  });
    disbursements.push({ label: "Case Management Fee",                            amount: 30  });
    disbursements.push({ label: "HMLR Official Search",                           amount: 7   });
    disbursements.push({ label: "HMLR Bankruptcy Search",                         amount: 6   });
    disbursements.push({ label: "Searches",                                       amount: 250 });
    disbursements.push({ label: "Land Registry Fees",                             amount: 20  });

  // ── TRANSFER OF EQUITY ────────────────────────────────────────────────────
  } else if (type === "transfer-of-equity") {
    const toeMap: Record<string, number> = {
      "Shared Ownership": 150,
    };
    for (const opt of selectedOptions) {
      if (toeMap[opt] !== undefined) supplements.push({ label: opt, amount: toeMap[opt] });
    }

    const amlPeople = Math.max(peopleInvolved, 1);
    disbursements.push({ label: "File Opening Fee",                                          amount: 50           });
    disbursements.push({ label: `AML Check (${amlPeople} x £30 each)`,                      amount: amlPeople * 30 });
    disbursements.push({ label: "Office Copies",                                             amount: 6            });
    disbursements.push({ label: "Land Registry Fees",                                        amount: 295          });
  }

  const supplementsSubtotal = supplements.reduce((sum, s) => sum + s.amount, 0);
  const supplementsVat      = Math.round(supplementsSubtotal * VAT_RATE);
  const disbursementsTotal  = disbursements.reduce((sum, d) => sum + d.amount, 0);
  const subtotal = legalFee + legalFeeVat + supplementsSubtotal + supplementsVat + disbursementsTotal;

  return { legalFee, legalFeeVat, supplements, supplementsVat, disbursements, sdltDeferred, subtotal };
}

// ── Formatters ────────────────────────────────────────────────────────────────

export function formatGBP(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumberWithCommas(value: number): string {
  return new Intl.NumberFormat("en-GB").format(value);
}

export function formatCompact(value: number): string {
  if (!value || value <= 0) return "";
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return Number.isInteger(m) ? `${m}m` : `${m.toFixed(2).replace(/0$/, "")}m`;
  }
  if (value >= 1_000) {
    const k = value / 1_000;
    return Number.isInteger(k) ? `${k}k` : `${k.toFixed(1)}k`;
  }
  return String(value);
}

export function parseCompactNumber(raw: string): number {
  if (!raw) return 0;
  const cleaned = raw.replace(/[£,\s]/g, "").toLowerCase();
  const m = cleaned.match(/^(\d+(\.\d+)?)m$/);
  if (m) return Math.round(parseFloat(m[1]) * 1_000_000);
  const k = cleaned.match(/^(\d+(\.\d+)?)k$/);
  if (k) return Math.round(parseFloat(k[1]) * 1_000);
  const plain = parseFloat(cleaned);
  return Number.isFinite(plain) ? Math.round(plain) : 0;
}