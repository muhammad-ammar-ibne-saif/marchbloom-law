"use client";

import { useState, FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  KeyRound,
  RefreshCw,
  ArrowLeft,
  ArrowLeftRight,
  FileSignature,
} from "lucide-react";
import {
  calculateBreakdown,
  DetailedBreakdown,
  formatGBP,
  LeaseholdType,
  TransactionType,
} from "@/lib/pricing";
import { siteConfig } from "@/lib/data";
import CurrencyInput from "@/components/CurrencyInput";
import AddressAutocomplete from "@/components/AddressAutocomplete";

type Step = 1 | 2 | 3 | 4;

const TRANSACTION_OPTIONS = [
  { type: "sale" as TransactionType, label: "Sale", hint: "Selling a property", icon: KeyRound },
  { type: "purchase" as TransactionType, label: "Purchase", hint: "Buying a property", icon: Home },
  { type: "sale-purchase" as TransactionType, label: "Sale & Purchase", hint: "Selling and buying", icon: ArrowLeftRight },
  { type: "remortgage" as TransactionType, label: "Remortgage", hint: "Switching or renewing", icon: RefreshCw },
  { type: "transfer-of-equity" as TransactionType, label: "Transfer of Equity", hint: "Adding or removing people", icon: FileSignature },
];

const SALE_OPTIONS = [
  "Shared Ownership", "Help to Buy Equity Loan", "Unregistered",
  "New Build", "Declaration of Trust", "Auction Pack Preparation",
];

const PURCHASE_OPTIONS = [
  "Buying First Home", "2nd Home or Buy To Let", "Gifted Deposit",
  "Help to Buy ISA", "Lifetime ISA", "New Build Legal Work Fee",
  "Shared Ownership", "Right To Buy", "Buying via Limited Company",
  "Declaration of Trust", "Unregistered", "Share of Freehold", "Auction Pack Review",
];

const REMORTGAGE_OPTIONS = ["Buy To Let", "Share of Freehold", "Client is Company"];
const TRANSFER_OPTIONS = ["Shared Ownership"];

const fieldClasses =
  "w-full rounded-lg border border-ink-900/15 bg-bone-50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-brass-500 focus:outline-none";

const slideVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

function CheckboxGroup({ options, selected, onChange }: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  function toggle(opt: string) {
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  }
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map((opt) => (
        <label key={opt} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700">
          <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} className="h-4 w-4 rounded border-ink-900/20 accent-brass-500" />
          {opt}
        </label>
      ))}
    </div>
  );
}

type SectionProps = {
  title: string;
  address: string; setAddress: (v: string) => void;
  addressUnknown: boolean; setAddressUnknown: (v: boolean) => void;
  propertyValue: number; setPropertyValue: (v: number) => void;
  peopleInvolved: number; setPeopleInvolved: (v: number) => void;
  isLeasehold: boolean; setIsLeasehold: (v: boolean) => void;
  leaseholdType: LeaseholdType; setLeaseholdType: (v: LeaseholdType) => void;
  additionalOptions: string[]; setAdditionalOptions: (v: string[]) => void;
  checkboxOptions: string[];
  showLeaseholdFloors?: boolean;
  hasMortgage?: boolean; setHasMortgage?: (v: boolean) => void;
  remortgageValue?: number; setRemortgageValue?: (v: number) => void;
  peopleBeingAdded?: number; setPeopleBeingAdded?: (v: number) => void;
  peopleBeingRemoved?: number; setPeopleBeingRemoved?: (v: number) => void;
  showMortgage?: boolean;
  showRemortgageValue?: boolean;
  showPeopleAddRemove?: boolean;
};

function PropertySection(props: SectionProps) {
  const {
    title, address, setAddress, addressUnknown, setAddressUnknown,
    propertyValue, setPropertyValue, peopleInvolved, setPeopleInvolved,
    isLeasehold, setIsLeasehold, leaseholdType, setLeaseholdType,
    additionalOptions, setAdditionalOptions, checkboxOptions,
    showLeaseholdFloors, hasMortgage, setHasMortgage,
    remortgageValue, setRemortgageValue,
    peopleBeingAdded, setPeopleBeingAdded,
    peopleBeingRemoved, setPeopleBeingRemoved,
    showMortgage, showRemortgageValue, showPeopleAddRemove,
  } = props;

  return (
    <div className="rounded-xl2 border border-ink-900/10 bg-bone-50 p-5">
      <h4 className="font-display text-sm font-medium uppercase tracking-wide text-ink-700">{title}</h4>
      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">Search Transaction Address</label>
          <AddressAutocomplete
            value={addressUnknown ? "" : address}
            onChange={setAddress}
            disabled={addressUnknown}
            required={!addressUnknown}
            className={fieldClasses}
          />
          <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-ink-500">
            <input type="checkbox" checked={addressUnknown} onChange={(e) => { setAddressUnknown(e.target.checked); if (e.target.checked) setAddress(""); }} className="accent-brass-500" />
            Address Unknown
          </label>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">Property Value (£) *</label>
          <CurrencyInput value={propertyValue} onChange={setPropertyValue} className={fieldClasses} required />
        </div>

        {showRemortgageValue && (
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">Remortgage Value *</label>
            <CurrencyInput value={remortgageValue ?? 0} onChange={(v) => setRemortgageValue?.(v)} className={fieldClasses} required />
          </div>
        )}

        {!showPeopleAddRemove && (
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">People Involved *</label>
            <input type="number" min={1} value={peopleInvolved} onChange={(e) => setPeopleInvolved(Number(e.target.value))} className={fieldClasses} required />
          </div>
        )}

        {showPeopleAddRemove && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">People Being Added</label>
              <input type="number" min={0} value={peopleBeingAdded} onChange={(e) => setPeopleBeingAdded?.(Number(e.target.value))} className={fieldClasses} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">People Being Removed</label>
              <input type="number" min={0} value={peopleBeingRemoved} onChange={(e) => setPeopleBeingRemoved?.(Number(e.target.value))} className={fieldClasses} />
            </div>
          </div>
        )}

        {showMortgage && (
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">Is there a Mortgage?</label>
            <select value={hasMortgage ? "yes" : "no"} onChange={(e) => setHasMortgage?.(e.target.value === "yes")} className={fieldClasses}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        )}

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-600">Freehold or Leasehold?</label>
          <div className="flex gap-5">
            {["Freehold", "Leasehold"].map((opt) => (
              <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-ink-700">
                <input type="radio" checked={isLeasehold === (opt === "Leasehold")} onChange={() => setIsLeasehold(opt === "Leasehold")} className="accent-brass-500" />
                {opt}
              </label>
            ))}
          </div>
          {isLeasehold && showLeaseholdFloors && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3">
              <select value={leaseholdType === "high-rise" ? "high-rise" : "standard"} onChange={(e) => setLeaseholdType(e.target.value as LeaseholdType)} className={fieldClasses}>
                <option value="standard">The building has less than five floors</option>
                <option value="high-rise">The building has five or more floors</option>
              </select>
            </motion.div>
          )}
        </div>

        {checkboxOptions.length > 0 && (
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-600">Select options that apply</label>
            <CheckboxGroup options={checkboxOptions} selected={additionalOptions} onChange={setAdditionalOptions} />
          </div>
        )}
      </div>
    </div>
  );
}

function BreakdownPanel({ title, breakdown }: { title: string; breakdown: DetailedBreakdown }) {
  return (
    <div className="overflow-hidden rounded-xl2 border border-ink-900/10 bg-bone-50">
      <div className="border-b border-ink-900/10 bg-ink-900 px-6 py-3.5">
        <h4 className="font-display text-base text-bone-50">{title}</h4>
      </div>
      <div className="divide-y divide-ink-900/8">
        <div className="px-6 py-2">
          <p className="pt-2 text-xs font-medium uppercase tracking-wide text-ink-500">Legal Fees</p>
          <div className="flex justify-between py-2 text-sm text-ink-700">
            <span>Legal Fees</span>
            <span className="font-medium text-ink-900">{formatGBP(breakdown.legalFee)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm text-ink-700">
            <span>Legal Fees VAT at 20%</span>
            <span className="font-medium text-ink-900">{formatGBP(breakdown.legalFeeVat)}</span>
          </div>
        </div>

        {breakdown.supplements.length > 0 && (
          <div className="px-6 py-2">
            <p className="pt-2 text-xs font-medium uppercase tracking-wide text-ink-500">Supplements</p>
            {breakdown.supplements.map((s) => (
              <div key={s.label} className="flex justify-between py-2 text-sm text-ink-700">
                <span>{s.label}</span>
                <span className="font-medium text-ink-900">{formatGBP(s.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 text-sm text-ink-700">
              <span>VAT at 20%</span>
              <span className="font-medium text-ink-900">{formatGBP(breakdown.supplementsVat)}</span>
            </div>
          </div>
        )}

        {breakdown.disbursements.length > 0 && (
          <div className="px-6 py-2">
            <p className="pt-2 text-xs font-medium uppercase tracking-wide text-ink-500">Disbursements</p>
            {breakdown.disbursements.map((d) => (
              <div key={d.label} className="flex justify-between py-2 text-sm text-ink-700">
                <span>{d.label}</span>
                <span className="font-medium text-ink-900">{formatGBP(d.amount)}</span>
              </div>
            ))}
          </div>
        )}

        {breakdown.sdlt !== null && breakdown.sdlt > 0 && (
          <div className="px-6 py-2">
            <div className="flex justify-between py-2 text-sm text-ink-700">
              <span>Stamp Duty Land Tax (estimated)</span>
              <span className="font-medium text-ink-900">{formatGBP(breakdown.sdlt)}</span>
            </div>
          </div>
        )}

        <div className="flex justify-between bg-ink-900/[0.03] px-6 py-4">
          <span className="font-display text-base font-semibold text-ink-900">Total, including VAT and disbursements</span>
          <span className="font-display text-lg font-semibold text-ink-900">{formatGBP(breakdown.subtotal)}</span>
        </div>
      </div>

      {breakdown.unpricedOptions.length > 0 && (
        <p className="border-t border-ink-900/10 px-6 py-3 text-xs text-ink-500">
          Also selected: {breakdown.unpricedOptions.join(", ")} — these may carry additional fees, confirmed when your solicitor reviews the file.
        </p>
      )}
    </div>
  );
}

export default function InstantQuote() {
  const [step, setStep] = useState<Step>(1);
  const [type, setType] = useState<TransactionType | null>(null);

  // Sale
  const [saleAddress, setSaleAddress] = useState("");
  const [saleAddressUnknown, setSaleAddressUnknown] = useState(false);
  const [saleValue, setSaleValue] = useState(0);
  const [salePeople, setSalePeople] = useState(1);
  const [saleLeasehold, setSaleLeasehold] = useState(false);
  const [saleLeaseholdType, setSaleLeaseholdType] = useState<LeaseholdType>("standard");
  const [saleOptions, setSaleOptions] = useState<string[]>([]);

  // Purchase
  const [purchaseAddress, setPurchaseAddress] = useState("");
  const [purchaseAddressUnknown, setPurchaseAddressUnknown] = useState(false);
  const [purchaseValue, setPurchaseValue] = useState(0);
  const [purchasePeople, setPurchasePeople] = useState(1);
  const [purchaseLeasehold, setPurchaseLeasehold] = useState(false);
  const [purchaseLeaseholdType, setPurchaseLeaseholdType] = useState<LeaseholdType>("standard");
  const [purchaseOptions, setPurchaseOptions] = useState<string[]>([]);
  const [hasMortgage, setHasMortgage] = useState(true);

  // Remortgage
  const [remortgageAddress, setRemortgageAddress] = useState("");
  const [remortgageAddressUnknown, setRemortgageAddressUnknown] = useState(false);
  const [remortgagePropValue, setRemortgagePropValue] = useState(0);
  const [remortgageValue, setRemortgageValue] = useState(0);
  const [remortgagePeople, setRemortgagePeople] = useState(1);
  const [remortgageLeasehold, setRemortgageLeasehold] = useState(false);
  const [remortgageOptions, setRemortgageOptions] = useState<string[]>([]);

  // Transfer of Equity
  const [toeAddress, setToeAddress] = useState("");
  const [toeAddressUnknown, setToeAddressUnknown] = useState(false);
  const [toePropValue, setToePropValue] = useState(0);
  const [toePeopleAdded, setToePeopleAdded] = useState(0);
  const [toePeopleRemoved, setToePeopleRemoved] = useState(0);
  const [toeLeasehold, setToeLeasehold] = useState(false);
  const [toeOptions, setToeOptions] = useState<string[]>([]);

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);

  // Quote results
  const [resultSaleBreakdown, setResultSaleBreakdown] = useState<DetailedBreakdown | null>(null);
  const [resultPurchaseBreakdown, setResultPurchaseBreakdown] = useState<DetailedBreakdown | null>(null);
  const [resultSingleBreakdown, setResultSingleBreakdown] = useState<DetailedBreakdown | null>(null);
  const [resultCombinedTotal, setResultCombinedTotal] = useState<number | null>(null);

  const stepLabels = ["Transaction", "Property details", "Your details", "Your quote"];

  // Derived values for proceed URL
  const primaryAddress =
    type === "sale" ? saleAddress
    : type === "purchase" ? purchaseAddress
    : type === "sale-purchase" ? (saleAddress || purchaseAddress)
    : type === "remortgage" ? remortgageAddress
    : toeAddress;

  const primaryValue =
    type === "sale" ? saleValue
    : type === "purchase" ? purchaseValue
    : type === "sale-purchase" ? Math.max(saleValue, purchaseValue)
    : type === "remortgage" ? remortgagePropValue
    : toePropValue;

  const primaryLeasehold =
    type === "sale" ? saleLeasehold
    : type === "purchase" ? purchaseLeasehold
    : type === "sale-purchase" ? (saleLeasehold || purchaseLeasehold)
    : type === "remortgage" ? remortgageLeasehold
    : toeLeasehold;

  const primaryLeaseholdType: LeaseholdType =
    type === "sale" ? saleLeaseholdType
    : type === "purchase" ? purchaseLeaseholdType
    : type === "sale-purchase"
    ? (saleLeaseholdType === "high-rise" || purchaseLeaseholdType === "high-rise" ? "high-rise" : "standard")
    : "standard";

  const allOptions = [...saleOptions, ...purchaseOptions, ...remortgageOptions, ...toeOptions];

  function buildProceedUrl() {
    const params = new URLSearchParams();
    if (leadId) params.set("leadId", leadId);
    params.set("type", type ?? "");
    params.set("address", primaryAddress);
    params.set("value", String(primaryValue));
    params.set("leasehold", String(primaryLeasehold));
    if (allOptions.length) params.set("options", allOptions.join(","));
    return `/proceed-with-quote?${params.toString()}`;
  }

  function handleStep2Continue(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStep(3);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const saleSectionData = (type === "sale" || type === "sale-purchase") ? {
      transactionAddress: saleAddress, addressUnknown: saleAddressUnknown, propertyValue: saleValue,
      isLeasehold: saleLeasehold, leaseholdType: saleLeasehold ? saleLeaseholdType : null,
      peopleInvolved: salePeople, additionalOptions: saleOptions,
    } : null;

    const purchaseSectionData = (type === "purchase" || type === "sale-purchase") ? {
      transactionAddress: purchaseAddress, addressUnknown: purchaseAddressUnknown, propertyValue: purchaseValue,
      isLeasehold: purchaseLeasehold, leaseholdType: purchaseLeasehold ? purchaseLeaseholdType : null,
      peopleInvolved: purchasePeople, additionalOptions: purchaseOptions,
    } : null;

    let saleBreakdown: DetailedBreakdown | null = null;
    let purchaseBreakdown: DetailedBreakdown | null = null;
    let singleBreakdown: DetailedBreakdown | null = null;
    let combinedTotal: number | null = null;

    if (type === "sale-purchase") {
      saleBreakdown = calculateBreakdown("sale", {
        propertyValue: saleValue, isLeasehold: saleLeasehold,
        leaseholdType: saleLeasehold ? saleLeaseholdType : null, selectedOptions: saleOptions,
      });
      purchaseBreakdown = calculateBreakdown("purchase", {
        propertyValue: purchaseValue, isLeasehold: purchaseLeasehold,
        leaseholdType: purchaseLeasehold ? purchaseLeaseholdType : null,
        hasMortgage, selectedOptions: purchaseOptions, forceNotFirstTimeBuyer: true,
      });
      combinedTotal = saleBreakdown.subtotal + purchaseBreakdown.subtotal;
    } else if (type === "sale") {
      singleBreakdown = calculateBreakdown("sale", {
        propertyValue: saleValue, isLeasehold: saleLeasehold,
        leaseholdType: saleLeasehold ? saleLeaseholdType : null, selectedOptions: saleOptions,
      });
    } else if (type === "purchase") {
      singleBreakdown = calculateBreakdown("purchase", {
        propertyValue: purchaseValue, isLeasehold: purchaseLeasehold,
        leaseholdType: purchaseLeasehold ? purchaseLeaseholdType : null,
        hasMortgage, selectedOptions: purchaseOptions,
      });
    } else if (type === "remortgage") {
      singleBreakdown = calculateBreakdown("remortgage", {
        propertyValue: remortgagePropValue, isLeasehold: remortgageLeasehold,
        leaseholdType: null, selectedOptions: remortgageOptions,
      });
    } else if (type === "transfer-of-equity") {
      singleBreakdown = calculateBreakdown("transfer-of-equity", {
        propertyValue: toePropValue, isLeasehold: toeLeasehold,
        leaseholdType: null, selectedOptions: toeOptions,
      });
    }

    const payload = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      message: formData.get("message") || "",
      honeypot: formData.get("company"),
      transactionType: type,
      transactionAddress:
        type === "remortgage" ? remortgageAddress
        : type === "transfer-of-equity" ? toeAddress
        : "",
      addressUnknown:
        type === "remortgage" ? remortgageAddressUnknown
        : type === "transfer-of-equity" ? toeAddressUnknown
        : false,
      propertyValue:
        type === "remortgage" ? remortgagePropValue
        : type === "transfer-of-equity" ? toePropValue
        : null,
      isLeasehold: primaryLeasehold,
      leaseholdType: primaryLeasehold ? primaryLeaseholdType : null,
      peopleInvolved: type === "remortgage" ? remortgagePeople : 1,
      hasMortgage: type === "purchase" || type === "sale-purchase" ? hasMortgage : null,
      remortgageValue: type === "remortgage" ? remortgageValue : null,
      peopleBeingAdded: type === "transfer-of-equity" ? toePeopleAdded : null,
      peopleBeingRemoved: type === "transfer-of-equity" ? toePeopleRemoved : null,
      additionalOptions:
        type === "remortgage" ? remortgageOptions
        : type === "transfer-of-equity" ? toeOptions
        : [],
      saleSection: saleSectionData,
      purchaseSection: purchaseSectionData,
      saleBreakdown,
      purchaseBreakdown,
      singleBreakdown,
      combinedTotal,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || "Something went wrong — please try again.");
        setSubmitting(false);
        return;
      }
      const data = await res.json();
      setLeadId(data.id ?? null);
      setResultSaleBreakdown(saleBreakdown);
      setResultPurchaseBreakdown(purchaseBreakdown);
      setResultSingleBreakdown(singleBreakdown);
      setResultCombinedTotal(combinedTotal);
      setStep(4);
    } catch {
      setSubmitError("Couldn't reach the server — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setStep(1);
    setType(null);
    setSaleAddress(""); setSaleAddressUnknown(false); setSaleValue(0); setSalePeople(1);
    setSaleLeasehold(false); setSaleLeaseholdType("standard"); setSaleOptions([]);
    setPurchaseAddress(""); setPurchaseAddressUnknown(false); setPurchaseValue(0); setPurchasePeople(1);
    setPurchaseLeasehold(false); setPurchaseLeaseholdType("standard"); setPurchaseOptions([]); setHasMortgage(true);
    setRemortgageAddress(""); setRemortgageAddressUnknown(false); setRemortgagePropValue(0);
    setRemortgageValue(0); setRemortgagePeople(1); setRemortgageLeasehold(false); setRemortgageOptions([]);
    setToeAddress(""); setToeAddressUnknown(false); setToePropValue(0);
    setToePeopleAdded(0); setToePeopleRemoved(0); setToeLeasehold(false); setToeOptions([]);
    setSubmitError(null); setLeadId(null);
    setResultSaleBreakdown(null); setResultPurchaseBreakdown(null);
    setResultSingleBreakdown(null); setResultCombinedTotal(null);
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-8 flex items-center gap-2">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-ink-900/10">
              <motion.div className="h-full rounded-full bg-brass-500" initial={{ width: 0 }} animate={{ width: i + 1 <= step ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
            </div>
            <p className="mt-1.5 hidden text-[11px] font-medium uppercase tracking-wide text-ink-500 sm:block">{label}</p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* Step 1 — Transaction type */}
        {step === 1 && (
          <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
            <h3 className="font-display text-xl text-ink-900">What type of transaction?</h3>
            <p className="mt-1 text-sm text-ink-600">Select the one that applies.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {TRANSACTION_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = type === opt.type;
                return (
                  <button key={opt.type} type="button" onClick={() => setType(opt.type)}
                    className={`flex flex-col items-start gap-3 rounded-xl2 border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 ${active ? "border-brass-500 bg-brass-500/10" : "border-ink-900/12 bg-bone-50 hover:border-ink-900/25"}`}>
                    <Icon size={20} className="text-ink-700" />
                    <span className="font-display text-base text-ink-900">{opt.label}</span>
                    <span className="text-xs text-ink-500">{opt.hint}</span>
                  </button>
                );
              })}
            </div>
            {type && (
              <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} type="button" onClick={() => setStep(2)}
                className="mt-6 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-bone-50 shadow-soft hover:shadow-lift">
                Continue
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Step 2 — Property details */}
        {step === 2 && type && (
          <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
            <button type="button" onClick={() => setStep(1)} className="mb-4 flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-ink-800">
              <ArrowLeft size={14} /> Back
            </button>
            <form onSubmit={handleStep2Continue}>
              <h3 className="font-display text-xl text-ink-900">Property details</h3>
              <div className="mt-5 space-y-5">
                {(type === "sale" || type === "sale-purchase") && (
                  <PropertySection title="Selling a property"
                    address={saleAddress} setAddress={setSaleAddress}
                    addressUnknown={saleAddressUnknown} setAddressUnknown={setSaleAddressUnknown}
                    propertyValue={saleValue} setPropertyValue={setSaleValue}
                    peopleInvolved={salePeople} setPeopleInvolved={setSalePeople}
                    isLeasehold={saleLeasehold} setIsLeasehold={setSaleLeasehold}
                    leaseholdType={saleLeaseholdType} setLeaseholdType={setSaleLeaseholdType}
                    additionalOptions={saleOptions} setAdditionalOptions={setSaleOptions}
                    checkboxOptions={SALE_OPTIONS} showLeaseholdFloors />
                )}
                {(type === "purchase" || type === "sale-purchase") && (
                  <PropertySection title="Buying a property"
                    address={purchaseAddress} setAddress={setPurchaseAddress}
                    addressUnknown={purchaseAddressUnknown} setAddressUnknown={setPurchaseAddressUnknown}
                    propertyValue={purchaseValue} setPropertyValue={setPurchaseValue}
                    peopleInvolved={purchasePeople} setPeopleInvolved={setPurchasePeople}
                    isLeasehold={purchaseLeasehold} setIsLeasehold={setPurchaseLeasehold}
                    leaseholdType={purchaseLeaseholdType} setLeaseholdType={setPurchaseLeaseholdType}
                    additionalOptions={purchaseOptions} setAdditionalOptions={setPurchaseOptions}
                    checkboxOptions={PURCHASE_OPTIONS} showLeaseholdFloors
                    showMortgage hasMortgage={hasMortgage} setHasMortgage={setHasMortgage} />
                )}
                {type === "remortgage" && (
                  <PropertySection title="Remortgage a property"
                    address={remortgageAddress} setAddress={setRemortgageAddress}
                    addressUnknown={remortgageAddressUnknown} setAddressUnknown={setRemortgageAddressUnknown}
                    propertyValue={remortgagePropValue} setPropertyValue={setRemortgagePropValue}
                    peopleInvolved={remortgagePeople} setPeopleInvolved={setRemortgagePeople}
                    isLeasehold={remortgageLeasehold} setIsLeasehold={setRemortgageLeasehold}
                    leaseholdType="standard" setLeaseholdType={() => {}}
                    additionalOptions={remortgageOptions} setAdditionalOptions={setRemortgageOptions}
                    checkboxOptions={REMORTGAGE_OPTIONS} showRemortgageValue
                    remortgageValue={remortgageValue} setRemortgageValue={setRemortgageValue} />
                )}
                {type === "transfer-of-equity" && (
                  <PropertySection title="Transfer of Equity"
                    address={toeAddress} setAddress={setToeAddress}
                    addressUnknown={toeAddressUnknown} setAddressUnknown={setToeAddressUnknown}
                    propertyValue={toePropValue} setPropertyValue={setToePropValue}
                    peopleInvolved={1} setPeopleInvolved={() => {}}
                    isLeasehold={toeLeasehold} setIsLeasehold={setToeLeasehold}
                    leaseholdType="standard" setLeaseholdType={() => {}}
                    additionalOptions={toeOptions} setAdditionalOptions={setToeOptions}
                    checkboxOptions={TRANSFER_OPTIONS} showPeopleAddRemove
                    peopleBeingAdded={toePeopleAdded} setPeopleBeingAdded={setToePeopleAdded}
                    peopleBeingRemoved={toePeopleRemoved} setPeopleBeingRemoved={setToePeopleRemoved} />
                )}
              </div>
              <button type="submit" className="mt-6 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-bone-50 shadow-soft hover:shadow-lift">
                Continue
              </button>
            </form>
          </motion.div>
        )}

        {/* Step 3 — Contact details */}
        {step === 3 && (
          <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
            <button type="button" onClick={() => setStep(2)} className="mb-4 flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-ink-800">
              <ArrowLeft size={14} /> Back
            </button>
            <h3 className="font-display text-xl text-ink-900">Your details</h3>
            <p className="mt-1 text-sm text-ink-600">
              We need these before we can show you your quote — a solicitor will confirm it by email, usually within one working day.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input type="text" name="company" tabIndex={-1} autoComplete="off" className="absolute h-0 w-0 opacity-0" aria-hidden="true" />
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="firstName" required placeholder="First name" className={fieldClasses} />
                <input name="lastName" required placeholder="Last name" className={fieldClasses} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="phone" type="tel" required placeholder="Phone" className={fieldClasses} />
                <input name="email" type="email" required placeholder="Email" className={fieldClasses} />
              </div>
              <textarea name="message" rows={3} placeholder="Anything else? (optional)" className={fieldClasses} />
              <p className="text-xs leading-relaxed text-ink-500">
                By submitting, you agree to our Privacy Policy. We'll only use your details to send your quote.
              </p>
              {submitError && <p className="text-sm text-clay-500">{submitError}</p>}
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} type="submit" disabled={submitting}
                className="w-full rounded-full bg-brass-500 px-6 py-3.5 text-sm font-medium text-ink-950 shadow-soft hover:shadow-lift disabled:opacity-60 sm:w-auto">
                {submitting ? "Calculating..." : "Show my quote"}
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Step 4 — Quote result */}
        {step === 4 && (
          <motion.div key="step4" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
            <h3 className="font-display text-2xl text-ink-900">Your Conveyancing Quote</h3>
            <p className="mt-1 text-sm text-ink-600">Full breakdown — nothing hidden, nothing combined that shouldn't be.</p>

            {resultCombinedTotal !== null && (
              <div className="mt-5 rounded-xl2 bg-ink-900 p-6 text-bone-100">
                <p className="text-xs uppercase tracking-wide text-bone-100/60">Combined total (sale + purchase)</p>
                <p className="mt-1 font-display text-4xl">{formatGBP(resultCombinedTotal)}</p>
              </div>
            )}

            <div className="mt-5 space-y-5">
              {resultSaleBreakdown && <BreakdownPanel title="Sale" breakdown={resultSaleBreakdown} />}
              {resultPurchaseBreakdown && <BreakdownPanel title="Purchase" breakdown={resultPurchaseBreakdown} />}
              {resultSingleBreakdown && (
                <BreakdownPanel
                  title={
                    type === "sale" ? "Sale"
                    : type === "purchase" ? "Purchase"
                    : type === "remortgage" ? "Remortgage"
                    : "Transfer of Equity"
                  }
                  breakdown={resultSingleBreakdown}
                />
              )}
            </div>

            <p className="mt-4 text-xs text-ink-500">
              Estimate only. SDLT is calculated using standard England rates and doesn't account for every relief or surcharge — your solicitor will confirm the exact figure. Final costs may vary based on title complexity and search results.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="/discuss-quote"
                onClick={async () => {
                  if (leadId) {
                    await fetch(`/api/leads/${leadId}/intent`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ intent: "discuss" }),
                    }).catch(() => {});
                  }
                }}
                className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3.5 text-sm font-medium text-bone-50 shadow-soft transition-shadow hover:shadow-lift"
              >
                Discuss Quote
              </a>
              <a
                href={buildProceedUrl()}
                className="rounded-full bg-brass-500 px-6 py-3.5 text-sm font-medium text-ink-950 shadow-soft hover:shadow-lift"
              >
                Proceed with Quote
              </a>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full border border-ink-900/15 px-6 py-3.5 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-900/5"
              >
                Get New Quote
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}