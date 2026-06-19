export type FeeBand = {
  min: number;
  max: number | null;
  fee: number | null;
  percentOfValue?: number;
};

// Mirrors the bands shown on the Price Transparency page.
export const purchaseFeeBands: FeeBand[] = [
  { min: 0, max: 150000, fee: 750 },
  { min: 150001, max: 300000, fee: 850 },
  { min: 300001, max: 600000, fee: 900 },
  { min: 600001, max: 900000, fee: 1100 },
  { min: 900001, max: 999000, fee: 1200 },
  { min: 1000000, max: null, fee: null, percentOfValue: 0.0015 },
];

export const saleFeeBands: FeeBand[] = [
  { min: 0, max: 150000, fee: 700 },
  { min: 150001, max: 300000, fee: 800 },
  { min: 300001, max: 600000, fee: 850 },
  { min: 600001, max: 900000, fee: 1050 },
  { min: 900001, max: 999000, fee: 1150 },
  { min: 1000000, max: null, fee: null, percentOfValue: 0.0015 },
];

// NOTE: the live site does not publish a remortgage fee scale — this is a
// placeholder structure (base fee + mortgage admin disbursement) that should
// be confirmed and replaced with the firm's actual remortgage rate card.
export const remortgageBaseFee = 450;
export const remortgageAdminFee = 100;

export const leaseholdSupplement = 300;
export const bankTransferFee = 36;

export type TransactionType = "purchase" | "sale" | "remortgage";

function feeFromBands(value: number, bands: FeeBand[]): number {
  const band =
    bands.find((b) => value >= b.min && (b.max === null || value <= b.max)) ??
    bands[bands.length - 1];
  if (band.percentOfValue) {
    return Math.round(value * band.percentOfValue);
  }
  return band.fee ?? 0;
}

export type QuoteBreakdown = {
  legalFee: number;
  leaseholdFee: number;
  disbursementsEstimate: number;
  total: number;
};

export function calculateQuote(
  type: TransactionType,
  value: number,
  isLeasehold: boolean
): QuoteBreakdown {
  let legalFee = 0;
  let disbursementsEstimate = bankTransferFee;

  if (type === "purchase") {
    legalFee = feeFromBands(value, purchaseFeeBands);
    disbursementsEstimate += 30 + 3 + 6 + 250 + 3; // ID + HMLR + office copies + search pack + OS1
  } else if (type === "sale") {
    legalFee = feeFromBands(value, saleFeeBands);
    disbursementsEstimate += 30 + 6; // ID + office copies
  } else {
    legalFee = remortgageBaseFee;
    disbursementsEstimate += remortgageAdminFee;
  }

  const leaseholdFee = isLeasehold ? leaseholdSupplement : 0;
  const total = legalFee + leaseholdFee + disbursementsEstimate;

  return { legalFee, leaseholdFee, disbursementsEstimate, total };
}

export function formatGBP(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}
