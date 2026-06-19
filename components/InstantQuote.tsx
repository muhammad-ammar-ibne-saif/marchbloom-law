"use client";

import { useMemo, useState, FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Home,
  KeyRound,
  RefreshCw,
  ArrowLeft,
  ArrowLeftRight,
  FileSignature,
} from "lucide-react";
import {
  calculateQuote,
  formatGBP,
  LeaseholdType,
  TransactionType,
} from "@/lib/pricing";

type Step = 1 | 2 | 3 | 4;

const TRANSACTION_OPTIONS = [
  {
    type: "sale" as TransactionType,
    label: "Sale",
    hint: "Selling a property",
    icon: KeyRound,
  },
  {
    type: "purchase" as TransactionType,
    label: "Purchase",
    hint: "Buying a property",
    icon: Home,
  },
  {
    type: "sale-purchase" as TransactionType,
    label: "Sale & Purchase",
    hint: "Selling and buying",
    icon: ArrowLeftRight,
  },
  {
    type: "remortgage" as TransactionType,
    label: "Remortgage",
    hint: "Switching or renewing",
    icon: RefreshCw,
  },
  {
    type: "transfer-of-equity" as TransactionType,
    label: "Transfer of Equity",
    hint: "Adding or removing people",
    icon: FileSignature,
  },
];

const SALE_OPTIONS = [
  "Shared Ownership",
  "Help to Buy Equity Loan",
  "Unregistered",
  "New Build",
  "Declaration of Trust",
  "Auction Pack Preparation",
];

const PURCHASE_OPTIONS = [
  "Buying First Home",
  "2nd Home or Buy To Let",
  "Gifted Deposit",
  "Help to Buy ISA",
  "Lifetime ISA",
  "New Build Legal Work Fee",
  "Shared Ownership",
  "Right To Buy",
  "Buying via Limited Company",
  "Declaration of Trust",
  "Unregistered",
  "Share of Freehold",
  "Auction Pack Review",
];

const REMORTGAGE_OPTIONS = [
  "Buy To Let",
  "Share of Freehold",
  "Client is Company",
];
const TRANSFER_OPTIONS = ["Shared Ownership"];

const fieldClasses =
  "w-full rounded-lg border border-ink-900/15 bg-bone-50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-brass-500 focus:outline-none";

const slideVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  function toggle(opt: string) {
    onChange(
      selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt]
    );
  }
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map((opt) => (
        <label
          key={opt}
          className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700"
        >
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            className="h-4 w-4 rounded border-ink-900/20 accent-brass-500"
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

type SectionState = {
  address: string;
  setAddress: (v: string) => void;
  addressUnknown: boolean;
  setAddressUnknown: (v: boolean) => void;
  propertyValue: string;
  setPropertyValue: (v: string) => void;
  peopleInvolved: number;
  setPeopleInvolved: (v: number) => void;
  isLeasehold: boolean;
  setIsLeasehold: (v: boolean) => void;
  leaseholdType: LeaseholdType;
  setLeaseholdType: (v: LeaseholdType) => void;
  additionalOptions: string[];
  setAdditionalOptions: (v: string[]) => void;
  checkboxOptions: string[];
  showLeaseholdFloors?: boolean;
  hasMortgage?: boolean;
  setHasMortgage?: (v: boolean) => void;
  remortgageValue?: string;
  setRemortgageValue?: (v: string) => void;
  peopleBeingAdded?: number;
  setPeopleBeingAdded?: (v: number) => void;
  peopleBeingRemoved?: number;
  setPeopleBeingRemoved?: (v: number) => void;
  showMortgage?: boolean;
  showRemortgageValue?: boolean;
  showPeopleAddRemove?: boolean;
  title: string;
};

function PropertySection(props: SectionState) {
  const {
    title,
    address,
    setAddress,
    addressUnknown,
    setAddressUnknown,
    propertyValue,
    setPropertyValue,
    peopleInvolved,
    setPeopleInvolved,
    isLeasehold,
    setIsLeasehold,
    leaseholdType,
    setLeaseholdType,
    additionalOptions,
    setAdditionalOptions,
    checkboxOptions,
    showLeaseholdFloors,
    hasMortgage,
    setHasMortgage,
    remortgageValue,
    setRemortgageValue,
    peopleBeingAdded,
    setPeopleBeingAdded,
    peopleBeingRemoved,
    setPeopleBeingRemoved,
    showMortgage,
    showRemortgageValue,
    showPeopleAddRemove,
  } = props;

  return (
    <div className="rounded-xl2 border border-ink-900/10 bg-bone-50 p-5">
      <h4 className="font-display text-sm font-medium uppercase tracking-wide text-ink-700">
        {title}
      </h4>
      <div className="mt-4 space-y-4">
        {/* Address */}
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">
            Search Transaction Address
          </label>
          <input
            placeholder="Start typing your address"
            value={addressUnknown ? "" : address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={addressUnknown}
            className={fieldClasses}
          />
          <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-ink-500">
            <input
              type="checkbox"
              checked={addressUnknown}
              onChange={(e) => {
                setAddressUnknown(e.target.checked);
                if (e.target.checked) setAddress("");
              }}
              className="accent-brass-500"
            />
            Address Unknown
          </label>
        </div>

        {/* Property value */}
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">
            Property Value (£) *
          </label>
          <input
            type="number"
            placeholder="e.g. 350000"
            value={propertyValue}
            onChange={(e) => setPropertyValue(e.target.value)}
            className={fieldClasses}
            required
          />
        </div>

        {/* Remortgage value */}
        {showRemortgageValue && (
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">
              Remortgage Value *
            </label>
            <input
              type="number"
              placeholder="e.g. 200000"
              value={remortgageValue}
              onChange={(e) => setRemortgageValue?.(e.target.value)}
              className={fieldClasses}
            />
          </div>
        )}

        {/* People involved */}
        {!showPeopleAddRemove && (
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">
              People Involved *
            </label>
            <input
              type="number"
              min={1}
              value={peopleInvolved}
              onChange={(e) => setPeopleInvolved(Number(e.target.value))}
              className={fieldClasses}
            />
          </div>
        )}

        {/* People add/remove (Transfer of Equity) */}
        {showPeopleAddRemove && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">
                People Being Added
              </label>
              <input
                type="number"
                min={0}
                value={peopleBeingAdded}
                onChange={(e) => setPeopleBeingAdded?.(Number(e.target.value))}
                className={fieldClasses}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">
                People Being Removed
              </label>
              <input
                type="number"
                min={0}
                value={peopleBeingRemoved}
                onChange={(e) =>
                  setPeopleBeingRemoved?.(Number(e.target.value))
                }
                className={fieldClasses}
              />
            </div>
          </div>
        )}

        {/* Mortgage */}
        {showMortgage && (
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">
              Is there a Mortgage?
            </label>
            <select
              value={hasMortgage ? "yes" : "no"}
              onChange={(e) => setHasMortgage?.(e.target.value === "yes")}
              className={fieldClasses}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        )}

        {/* Freehold / Leasehold */}
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-600">
            Freehold or Leasehold?
          </label>
          <div className="flex gap-5">
            {["Freehold", "Leasehold"].map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-2 text-sm text-ink-700"
              >
                <input
                  type="radio"
                  checked={isLeasehold === (opt === "Leasehold")}
                  onChange={() => setIsLeasehold(opt === "Leasehold")}
                  className="accent-brass-500"
                />
                {opt}
              </label>
            ))}
          </div>

          {/* Floors dropdown — only for leasehold on Sale, Purchase, Sale & Purchase */}
          {isLeasehold && showLeaseholdFloors && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <select
                value={leaseholdType === "high-rise" ? "high-rise" : "standard"}
                onChange={(e) =>
                  setLeaseholdType(e.target.value as LeaseholdType)
                }
                className={fieldClasses}
              >
                <option value="standard">
                  The building has less than five floors
                </option>
                <option value="high-rise">
                  The building has five or more floors
                </option>
              </select>
            </motion.div>
          )}
        </div>

        {/* Additional checkboxes */}
        {checkboxOptions.length > 0 && (
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-600">
              Select options that apply
            </label>
            <CheckboxGroup
              options={checkboxOptions}
              selected={additionalOptions}
              onChange={setAdditionalOptions}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function InstantQuote() {
  const [step, setStep] = useState<Step>(1);
  const [type, setType] = useState<TransactionType | null>(null);

  // Sale
  const [saleAddress, setSaleAddress] = useState("");
  const [saleAddressUnknown, setSaleAddressUnknown] = useState(false);
  const [saleValue, setSaleValue] = useState("");
  const [salePeople, setSalePeople] = useState(1);
  const [saleLeasehold, setSaleLeasehold] = useState(false);
  const [saleLeaseholdType, setSaleLeaseholdType] =
    useState<LeaseholdType>("standard");
  const [saleOptions, setSaleOptions] = useState<string[]>([]);

  // Purchase
  const [purchaseAddress, setPurchaseAddress] = useState("");
  const [purchaseAddressUnknown, setPurchaseAddressUnknown] = useState(false);
  const [purchaseValue, setPurchaseValue] = useState("");
  const [purchasePeople, setPurchasePeople] = useState(1);
  const [purchaseLeasehold, setPurchaseLeasehold] = useState(false);
  const [purchaseLeaseholdType, setPurchaseLeaseholdType] =
    useState<LeaseholdType>("standard");
  const [purchaseOptions, setPurchaseOptions] = useState<string[]>([]);
  const [hasMortgage, setHasMortgage] = useState(true);

  // Remortgage
  const [remortgageAddress, setRemortgageAddress] = useState("");
  const [remortgageAddressUnknown, setRemortgageAddressUnknown] =
    useState(false);
  const [remortgagePropValue, setRemortgagePropValue] = useState("");
  const [remortgageValue, setRemortgageValue] = useState("");
  const [remortgagePeople, setRemortgagePeople] = useState(1);
  const [remortgageLeasehold, setRemortgageLeasehold] = useState(false);
  const [remortgageLeaseholdType] = useState<LeaseholdType>("standard");
  const [remortgageOptions, setRemortgageOptions] = useState<string[]>([]);

  // Transfer of Equity
  const [toeAddress, setToeAddress] = useState("");
  const [toeAddressUnknown, setToeAddressUnknown] = useState(false);
  const [toePropValue, setToePropValue] = useState("");
  const [toePeopleAdded, setToePeopleAdded] = useState(0);
  const [toePeopleRemoved, setToePeopleRemoved] = useState(0);
  const [toeLeasehold, setToeLeasehold] = useState(false);
  const [toeLeaseholdType] = useState<LeaseholdType>("standard");
  const [toeOptions, setToeOptions] = useState<string[]>([]);

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const primaryValue = useMemo(() => {
    if (!type) return 0;
    if (type === "sale") return Number(saleValue) || 0;
    if (type === "purchase") return Number(purchaseValue) || 0;
    if (type === "sale-purchase")
      return Math.max(Number(saleValue) || 0, Number(purchaseValue) || 0);
    if (type === "remortgage") return Number(remortgagePropValue) || 0;
    if (type === "transfer-of-equity") return Number(toePropValue) || 0;
    return 0;
  }, [type, saleValue, purchaseValue, remortgagePropValue, toePropValue]);

  const primaryLeasehold = useMemo(() => {
    if (!type) return false;
    if (type === "sale") return saleLeasehold;
    if (type === "purchase") return purchaseLeasehold;
    if (type === "sale-purchase") return saleLeasehold || purchaseLeasehold;
    if (type === "remortgage") return remortgageLeasehold;
    if (type === "transfer-of-equity") return toeLeasehold;
    return false;
  }, [
    type,
    saleLeasehold,
    purchaseLeasehold,
    remortgageLeasehold,
    toeLeasehold,
  ]);

  const primaryLeaseholdType = useMemo((): LeaseholdType => {
    if (type === "sale") return saleLeaseholdType;
    if (type === "purchase") return purchaseLeaseholdType;
    if (type === "sale-purchase")
      return saleLeaseholdType === "high-rise" ||
        purchaseLeaseholdType === "high-rise"
        ? "high-rise"
        : "standard";
    return "standard";
  }, [type, saleLeaseholdType, purchaseLeaseholdType]);

  const breakdown = useMemo(
    () =>
      type && primaryValue > 0
        ? calculateQuote(
            type,
            primaryValue,
            primaryLeasehold,
            primaryLeaseholdType
          )
        : null,
    [type, primaryValue, primaryLeasehold, primaryLeaseholdType]
  );

  const stepLabels = [
    "Transaction",
    "Property details",
    "Your estimate",
    "Get my quote",
  ];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const saleSectionData =
      type === "sale" || type === "sale-purchase"
        ? {
            transactionAddress: saleAddress,
            addressUnknown: saleAddressUnknown,
            propertyValue: Number(saleValue) || null,
            isLeasehold: saleLeasehold,
            leaseholdType: saleLeasehold ? saleLeaseholdType : null,
            peopleInvolved: salePeople,
            additionalOptions: saleOptions,
          }
        : null;

    const purchaseSectionData =
      type === "purchase" || type === "sale-purchase"
        ? {
            transactionAddress: purchaseAddress,
            addressUnknown: purchaseAddressUnknown,
            propertyValue: Number(purchaseValue) || null,
            isLeasehold: purchaseLeasehold,
            leaseholdType: purchaseLeasehold ? purchaseLeaseholdType : null,
            peopleInvolved: purchasePeople,
            additionalOptions: purchaseOptions,
          }
        : null;

    const payload = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      message: formData.get("message") || "",
      honeypot: formData.get("company"),
      transactionType: type,
      // Top-level fields for non-sale-purchase types
      transactionAddress:
        type === "remortgage"
          ? remortgageAddress
          : type === "transfer-of-equity"
            ? toeAddress
            : "",
      addressUnknown:
        type === "remortgage"
          ? remortgageAddressUnknown
          : type === "transfer-of-equity"
            ? toeAddressUnknown
            : false,
      propertyValue: primaryValue || null,
      isLeasehold: primaryLeasehold,
      leaseholdType: primaryLeasehold ? primaryLeaseholdType : null,
      peopleInvolved: type === "remortgage" ? remortgagePeople : 1,
      hasMortgage:
        type === "purchase" || type === "sale-purchase" ? hasMortgage : null,
      remortgageValue:
        type === "remortgage" ? Number(remortgageValue) || null : null,
      peopleBeingAdded: type === "transfer-of-equity" ? toePeopleAdded : null,
      peopleBeingRemoved:
        type === "transfer-of-equity" ? toePeopleRemoved : null,
      additionalOptions:
        type === "remortgage"
          ? remortgageOptions
          : type === "transfer-of-equity"
            ? toeOptions
            : [],
      // Separate sale and purchase sections
      saleSection: saleSectionData,
      purchaseSection: purchaseSectionData,
      estimate: breakdown,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSubmitError(
          data.error || "Something went wrong — please try again."
        );
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Couldn't reach the server — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3 rounded-xl2 border border-ink-900/10 bg-bone-50 px-8 py-16 text-center"
      >
        <CheckCircle2 className="h-11 w-11 text-ink-600" />
        <h3 className="font-display text-2xl text-ink-900">
          Your quote is on its way.
        </h3>
        <p className="max-w-sm text-sm text-ink-600">
          A solicitor will confirm your quote by email, usually within one
          working day.
        </p>
        {breakdown && (
          <p className="mt-2 font-display text-3xl text-ink-900">
            ~{formatGBP(breakdown.total)}
          </p>
        )}
      </motion.div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-8 flex items-center gap-2">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-ink-900/10">
              <motion.div
                className="h-full rounded-full bg-brass-500"
                initial={{ width: 0 }}
                animate={{ width: i + 1 <= step ? "100%" : "0%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            <p className="mt-1.5 hidden text-[11px] font-medium uppercase tracking-wide text-ink-500 sm:block">
              {label}
            </p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1 */}
        {step === 1 && (
          <motion.div
            key="step1"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <h3 className="font-display text-xl text-ink-900">
              What type of transaction?
            </h3>
            <p className="mt-1 text-sm text-ink-600">
              Select the one that applies.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {TRANSACTION_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = type === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setType(opt.type)}
                    className={`flex flex-col items-start gap-3 rounded-xl2 border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                      active
                        ? "border-brass-500 bg-brass-500/10"
                        : "border-ink-900/12 bg-bone-50 hover:border-ink-900/25"
                    }`}
                  >
                    <Icon size={20} className="text-ink-700" />
                    <span className="font-display text-base text-ink-900">
                      {opt.label}
                    </span>
                    <span className="text-xs text-ink-500">{opt.hint}</span>
                  </button>
                );
              })}
            </div>
            {type && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                type="button"
                onClick={() => setStep(2)}
                className="mt-6 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-bone-50 shadow-soft hover:shadow-lift"
              >
                Continue
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Step 2 */}
        {step === 2 && type && (
          <motion.div
            key="step2"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mb-4 flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-ink-800"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <h3 className="font-display text-xl text-ink-900">
              Property details
            </h3>
            <div className="mt-5 space-y-5">
              {(type === "sale" || type === "sale-purchase") && (
                <PropertySection
                  title="Selling a property"
                  address={saleAddress}
                  setAddress={setSaleAddress}
                  addressUnknown={saleAddressUnknown}
                  setAddressUnknown={setSaleAddressUnknown}
                  propertyValue={saleValue}
                  setPropertyValue={setSaleValue}
                  peopleInvolved={salePeople}
                  setPeopleInvolved={setSalePeople}
                  isLeasehold={saleLeasehold}
                  setIsLeasehold={setSaleLeasehold}
                  leaseholdType={saleLeaseholdType}
                  setLeaseholdType={setSaleLeaseholdType}
                  additionalOptions={saleOptions}
                  setAdditionalOptions={setSaleOptions}
                  checkboxOptions={SALE_OPTIONS}
                  showLeaseholdFloors
                />
              )}
              {(type === "purchase" || type === "sale-purchase") && (
                <PropertySection
                  title="Buying a property"
                  address={purchaseAddress}
                  setAddress={setPurchaseAddress}
                  addressUnknown={purchaseAddressUnknown}
                  setAddressUnknown={setPurchaseAddressUnknown}
                  propertyValue={purchaseValue}
                  setPropertyValue={setPurchaseValue}
                  peopleInvolved={purchasePeople}
                  setPeopleInvolved={setPurchasePeople}
                  isLeasehold={purchaseLeasehold}
                  setIsLeasehold={setPurchaseLeasehold}
                  leaseholdType={purchaseLeaseholdType}
                  setLeaseholdType={setPurchaseLeaseholdType}
                  additionalOptions={purchaseOptions}
                  setAdditionalOptions={setPurchaseOptions}
                  checkboxOptions={PURCHASE_OPTIONS}
                  showLeaseholdFloors
                  showMortgage
                  hasMortgage={hasMortgage}
                  setHasMortgage={setHasMortgage}
                />
              )}
              {type === "remortgage" && (
                <PropertySection
                  title="Remortgage a property"
                  address={remortgageAddress}
                  setAddress={setRemortgageAddress}
                  addressUnknown={remortgageAddressUnknown}
                  setAddressUnknown={setRemortgageAddressUnknown}
                  propertyValue={remortgagePropValue}
                  setPropertyValue={setRemortgagePropValue}
                  peopleInvolved={remortgagePeople}
                  setPeopleInvolved={setRemortgagePeople}
                  isLeasehold={remortgageLeasehold}
                  setIsLeasehold={setRemortgageLeasehold}
                  leaseholdType={remortgageLeaseholdType}
                  setLeaseholdType={() => {}}
                  additionalOptions={remortgageOptions}
                  setAdditionalOptions={setRemortgageOptions}
                  checkboxOptions={REMORTGAGE_OPTIONS}
                  showRemortgageValue
                  remortgageValue={remortgageValue}
                  setRemortgageValue={setRemortgageValue}
                />
              )}
              {type === "transfer-of-equity" && (
                <PropertySection
                  title="Transfer of Equity"
                  address={toeAddress}
                  setAddress={setToeAddress}
                  addressUnknown={toeAddressUnknown}
                  setAddressUnknown={setToeAddressUnknown}
                  propertyValue={toePropValue}
                  setPropertyValue={setToePropValue}
                  peopleInvolved={1}
                  setPeopleInvolved={() => {}}
                  isLeasehold={toeLeasehold}
                  setIsLeasehold={setToeLeasehold}
                  leaseholdType={toeLeaseholdType}
                  setLeaseholdType={() => {}}
                  additionalOptions={toeOptions}
                  setAdditionalOptions={setToeOptions}
                  checkboxOptions={TRANSFER_OPTIONS}
                  showPeopleAddRemove
                  peopleBeingAdded={toePeopleAdded}
                  setPeopleBeingAdded={setToePeopleAdded}
                  peopleBeingRemoved={toePeopleRemoved}
                  setPeopleBeingRemoved={setToePeopleRemoved}
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="mt-6 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-bone-50 shadow-soft hover:shadow-lift"
            >
              See my estimate
            </button>
          </motion.div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <motion.div
            key="step3"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              onClick={() => setStep(2)}
              className="mb-4 flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-ink-800"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <h3 className="font-display text-xl text-ink-900">Your estimate</h3>
            {breakdown ? (
              <div className="mt-5 rounded-xl2 border border-ink-900/10 bg-ink-900/[0.03] p-6">
                <p className="text-xs uppercase tracking-wide text-ink-500">
                  Estimated total, including disbursements
                </p>
                <p className="mt-1 font-display text-4xl text-ink-900">
                  {formatGBP(breakdown.total)}
                </p>
                <div className="mt-5 space-y-2 border-t border-ink-900/10 pt-4 text-sm text-ink-700">
                  <div className="flex justify-between">
                    <span>Legal fee</span>
                    <span className="font-medium">
                      {formatGBP(breakdown.legalFee)}
                    </span>
                  </div>
                  {breakdown.leaseholdFee > 0 && (
                    <div className="flex justify-between">
                      <span>
                        Leasehold supplement
                        {primaryLeaseholdType === "high-rise" && (
                          <span className="ml-1 text-xs text-ink-400">
                            (high-rise BSA)
                          </span>
                        )}
                      </span>
                      <span className="font-medium">
                        {formatGBP(breakdown.leaseholdFee)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Estimated disbursements</span>
                    <span className="font-medium">
                      {formatGBP(breakdown.disbursementsEstimate)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-xl2 border border-ink-900/10 bg-bone-50 p-6 text-sm text-ink-600">
                No property value entered — we'll calculate your exact quote and
                send it to you.
              </div>
            )}
            <p className="mt-3 text-xs text-ink-500">
              Indicative estimate, excluding VAT. Final quote may vary based on
              title complexity.
            </p>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="mt-6 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-bone-50 shadow-soft hover:shadow-lift"
            >
              Get my confirmed quote
            </button>
          </motion.div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <motion.div
            key="step4"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              onClick={() => setStep(3)}
              className="mb-4 flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-ink-800"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <h3 className="font-display text-xl text-ink-900">Your details</h3>
            <p className="mt-1 text-sm text-ink-600">
              A solicitor will confirm your quote by email, usually within one
              working day.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                className="absolute h-0 w-0 opacity-0"
                aria-hidden="true"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="firstName"
                  required
                  placeholder="First name"
                  className={fieldClasses}
                />
                <input
                  name="lastName"
                  required
                  placeholder="Last name"
                  className={fieldClasses}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="Phone"
                  className={fieldClasses}
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  className={fieldClasses}
                />
              </div>
              <textarea
                name="message"
                rows={3}
                placeholder="Anything else? (optional)"
                className={fieldClasses}
              />
              <p className="text-xs leading-relaxed text-ink-500">
                By submitting, you agree to our Privacy Policy. We'll only use
                your details to send your quote.
              </p>
              {submitError && (
                <p className="text-sm text-clay-500">{submitError}</p>
              )}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-brass-500 px-6 py-3.5 text-sm font-medium text-ink-950 shadow-soft hover:shadow-lift disabled:opacity-60 sm:w-auto"
              >
                {submitting ? "Sending..." : "Send my quote"}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
