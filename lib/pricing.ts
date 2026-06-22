export type TransactionType =
  | "purchase"
  | "sale"
  | "sale-purchase"
  | "remortgage"
  | "transfer-of-equity";

export type SingleTransactionType = "purchase" | "sale" | "remortgage" | "transfer-of-equity";

export type LeaseholdType = "standard" | "high-rise";

export type FeeBand = {
  min: number;
  max: number | null;
  fee: number | null;
  percentOfValue?: number;
};

export type LineItem = {
  label: string;
  amount: number;
};

export type BreakdownInput = {
  propertyValue: number;
  isLeasehold: boolean;
  leaseholdType: LeaseholdType | null;
  hasMortgage?: boolean | null;
  selectedOptions?: string[];
  forceNotFirstTimeBuyer?: boolean;
};

export type DetailedBreakdown = {
  legalFee: number;
  legalFeeVat: number;
  leaseholdFee: number;
  leaseholdLabel: string | null;
  supplements: LineItem[];
  supplementsVat: number;
  unpricedOptions: string[];
  disbursements: LineItem[];
  sdlt: number | null;
  subtotal: number;
};

// ---------- VAT ----------

export const VAT_RATE = 0.2;

// ---------- Fee bands ----------

export const purchaseFeeBands: FeeBand[] = [
  { min: 0, max: 150000, fee: 750 },
  { min: 150001, max: 300000, fee: 850 },
  { min: 300001, max: 600000, fee: 900 },
  { min: 600001, max: 900000, fee: 1100 },
  { min: 900001, max: 999000, fee: 1200 },
  { min: 1000000, max: null, fee: null, percentOfValue: 0.0015 },
];

// NOTE: the live quote tool returned £750 for the lowest sale band, not the
// £700 shown on the static Price Transparency page — using the live tool's
// figure here since it's the more current, authoritative source. Worth
// flagging to Kiran that the static page text and the calculator have
// drifted apart from each other.
export const saleFeeBands: FeeBand[] = [
  { min: 0, max: 150000, fee: 750 },
  { min: 150001, max: 300000, fee: 850 },
  { min: 300001, max: 600000, fee: 900 },
  { min: 600001, max: 900000, fee: 1100 },
  { min: 900001, max: 999000, fee: 1200 },
  { min: 1000000, max: null, fee: null, percentOfValue: 0.0015 },
];

export const remortgageBaseFee = 450;
export const transferOfEquityBaseFee = 500;
export const leaseholdStandardFee = 300;
export const leaseholdHighRiseFee = 350;

function feeFromBands(value: number, bands: FeeBand[]): number {
  const band =
    bands.find((b) => value >= b.min && (b.max === null || value <= b.max)) ??
    bands[bands.length - 1];
  if (band.percentOfValue) return Math.round(value * band.percentOfValue);
  return band.fee ?? 0;
}

// ---------- Disbursements (third-party pass-through costs — no VAT) ----------
// "Case Management Fee" and the corrected "Office Copy" figure come from a
// live quote screenshot for a Sale transaction; applied across all
// transaction types on the assumption they're uniform admin/registry costs
// — worth confirming with Kiran that Purchase/Remortgage/Transfer figures
// genuinely match rather than differing per matter type.

const purchaseDisbursementItems: LineItem[] = [
  { label: "ID verification", amount: 30 },
  { label: "HMLR search", amount: 3 },
  { label: "Office Copy (per document)", amount: 3 },
  { label: "Search pack", amount: 250 },
  { label: "Land Registry OS1", amount: 3 },
  { label: "Case Management Fee", amount: 30 },
  { label: "Bank Transfer Fee", amount: 36 },
];

const saleDisbursementItems: LineItem[] = [
  { label: "Bank Transfer Fee", amount: 36 },
  { label: "Case Management Fee", amount: 30 },
  { label: "Office Copy (per document)", amount: 3 },
];

const remortgageDisbursementItems: LineItem[] = [
  { label: "Bank Transfer Fee", amount: 36 },
  { label: "Case Management Fee", amount: 30 },
  { label: "Mortgage admin", amount: 100 },
];

const transferDisbursementItems: LineItem[] = [
  { label: "Bank Transfer Fee", amount: 36 },
  { label: "Case Management Fee", amount: 30 },
  { label: "Office Copy (per document)", amount: 3 },
];

// ---------- Supplements (the firm's own service fees — VAT applies) ----------

// Default supplements applied automatically, not behind a checkbox.
const saleDefaultSupplements: LineItem[] = [{ label: "File Opening Fee", amount: 50 }];

const purchaseSupplementMap: Record<string, number> = {
  "2nd Home or Buy To Let": 50,
  "Gifted Deposit": 150,
  "Auction Pack Review": 450,
};

const saleSupplementMap: Record<string, number> = {
  Unregistered: 350,
};

const remortgageSupplementMap: Record<string, number> = {
  "Buy To Let": 50,
};

const transferSupplementMap: Record<string, number> = {};

// ---------- Stamp Duty Land Tax (England, standard residential, post-April 2025) ----------
// Estimate only — doesn't cover every relief, surcharge edge case, or
// devolved-nation equivalent (Wales: LTT, Scotland: LBTT). Always confirm
// the exact figure with the client's solicitor before completion.

export type SDLTInput = {
  propertyValue: number;
  isFirstTimeBuyer: boolean;
  isAdditionalProperty: boolean;
};

const SDLT_STANDARD_BANDS = [
  { upTo: 125000, rate: 0 },
  { upTo: 250000, rate: 0.02 },
  { upTo: 925000, rate: 0.05 },
  { upTo: 1500000, rate: 0.1 },
  { upTo: Infinity, rate: 0.12 },
];

function sdltFromBands(value: number, bands: { upTo: number; rate: number }[]): number {
  let tax = 0;
  let lower = 0;
  for (const band of bands) {
    if (value <= lower) break;
    const taxableInBand = Math.min(value, band.upTo) - lower;
    if (taxableInBand > 0) tax += taxableInBand * band.rate;
    lower = band.upTo;
    if (value <= band.upTo) break;
  }
  return tax;
}

export function calculateSDLT({ propertyValue, isFirstTimeBuyer, isAdditionalProperty }: SDLTInput): number {
  if (!propertyValue || propertyValue <= 0) return 0;

  let baseTax: number;
  if (isFirstTimeBuyer && propertyValue <= 500000) {
    baseTax = propertyValue <= 300000 ? 0 : (propertyValue - 300000) * 0.05;
  } else {
    baseTax = sdltFromBands(propertyValue, SDLT_STANDARD_BANDS);
  }

  let tax = Math.round(baseTax);
  if (isAdditionalProperty) tax += Math.round(propertyValue * 0.05);
  return tax;
}

// ---------- Main itemized breakdown ----------

export function calculateBreakdown(type: SingleTransactionType, input: BreakdownInput): DetailedBreakdown {
  const { propertyValue, isLeasehold, leaseholdType, hasMortgage, selectedOptions = [], forceNotFirstTimeBuyer } = input;

  let legalFee = 0;
  let disbursements: LineItem[] = [];
  const supplements: LineItem[] = [];
  const unpricedOptions: string[] = [];
  let sdlt: number | null = null;

  if (type === "purchase") {
    legalFee = feeFromBands(propertyValue, purchaseFeeBands);
    disbursements = purchaseDisbursementItems;
    if (hasMortgage) supplements.push({ label: "Mortgage admin", amount: 100 });
    for (const opt of selectedOptions) {
      if (purchaseSupplementMap[opt] !== undefined) {
        supplements.push({ label: opt, amount: purchaseSupplementMap[opt] });
      } else {
        unpricedOptions.push(opt);
      }
    }
    const isFTB = !forceNotFirstTimeBuyer && selectedOptions.includes("Buying First Home");
    const isAdditional = selectedOptions.includes("2nd Home or Buy To Let");
    sdlt = calculateSDLT({ propertyValue, isFirstTimeBuyer: isFTB, isAdditionalProperty: isAdditional });
  } else if (type === "sale") {
    legalFee = feeFromBands(propertyValue, saleFeeBands);
    disbursements = saleDisbursementItems;
    supplements.push(...saleDefaultSupplements);
    for (const opt of selectedOptions) {
      if (saleSupplementMap[opt] !== undefined) {
        supplements.push({ label: opt, amount: saleSupplementMap[opt] });
      } else {
        unpricedOptions.push(opt);
      }
    }
  } else if (type === "remortgage") {
    legalFee = remortgageBaseFee;
    disbursements = remortgageDisbursementItems;
    for (const opt of selectedOptions) {
      if (remortgageSupplementMap[opt] !== undefined) {
        supplements.push({ label: opt, amount: remortgageSupplementMap[opt] });
      } else {
        unpricedOptions.push(opt);
      }
    }
  } else if (type === "transfer-of-equity") {
    legalFee = transferOfEquityBaseFee;
    disbursements = transferDisbursementItems;
    for (const opt of selectedOptions) {
      if (transferSupplementMap[opt] !== undefined) {
        supplements.push({ label: opt, amount: transferSupplementMap[opt] });
      } else {
        unpricedOptions.push(opt);
      }
    }
  }

  let leaseholdFee = 0;
  let leaseholdLabel: string | null = null;
  if (isLeasehold) {
    leaseholdFee = leaseholdType === "high-rise" ? leaseholdHighRiseFee : leaseholdStandardFee;
    leaseholdLabel =
      leaseholdType === "high-rise"
        ? "Leasehold supplement — 5+ floors (BSA)"
        : "Leasehold supplement — under 5 floors";
    supplements.push({ label: leaseholdLabel, amount: leaseholdFee });
  }

  const legalFeeVat = Math.round(legalFee * VAT_RATE);
  const supplementsSubtotal = supplements.reduce((sum, s) => sum + s.amount, 0);
  const supplementsVat = Math.round(supplementsSubtotal * VAT_RATE);
  const disbursementsTotal = disbursements.reduce((sum, d) => sum + d.amount, 0);

  const subtotal = legalFee + legalFeeVat + supplementsSubtotal + supplementsVat + disbursementsTotal + (sdlt ?? 0);

  return {
    legalFee,
    legalFeeVat,
    leaseholdFee,
    leaseholdLabel,
    supplements,
    supplementsVat,
    unpricedOptions,
    disbursements,
    sdlt,
    subtotal,
  };
}

// ---------- Currency formatting ----------

export function formatGBP(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumberWithCommas(value: number): string {
  return new Intl.NumberFormat("en-GB").format(value);
}

export function formatCompact(value: number): string {
  if (!value || value <= 0) return "";
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return Number.isInteger(millions) ? `${millions}m` : `${millions.toFixed(2).replace(/0$/, "")}m`;
  }
  if (value >= 1_000) {
    const thousands = value / 1_000;
    return Number.isInteger(thousands) ? `${thousands}k` : `${thousands.toFixed(1)}k`;
  }
  return String(value);
}

export function parseCompactNumber(raw: string): number {
  if (!raw) return 0;
  const cleaned = raw.replace(/[£,\s]/g, "").toLowerCase();
  const millionMatch = cleaned.match(/^(\d+(\.\d+)?)m$/);
  if (millionMatch) return Math.round(parseFloat(millionMatch[1]) * 1_000_000);
  const thousandMatch = cleaned.match(/^(\d+(\.\d+)?)k$/);
  if (thousandMatch) return Math.round(parseFloat(thousandMatch[1]) * 1_000);
  const plain = parseFloat(cleaned);
  return Number.isFinite(plain) ? Math.round(plain) : 0;
}