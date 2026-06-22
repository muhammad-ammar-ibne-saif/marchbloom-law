"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

type AdditionalPerson = {
  fullName: string;
  email: string;
  phone: string;
  correspondenceAddress: string;
};

type QuoteData = {
  leadId: string | null;
  transactionType: string;
  transactionAddress: string;
  transactionValue: number | null;
  isLeasehold: boolean;
  selectedOptions: string[];
};

type Props = { quoteData: QuoteData };

const fieldClasses =
  "w-full rounded-lg border border-ink-900/15 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-brass-500 focus:outline-none";

const sectionHeader = "bg-ink-900 text-bone-50 px-5 py-3 font-display text-sm uppercase tracking-[0.1em] rounded-t-lg";

const slideVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

const transactionLabels: Record<string, string> = {
  purchase: "Purchase",
  sale: "Sale",
  "sale-purchase": "Sale & Purchase",
  remortgage: "Remortgage",
  "transfer-of-equity": "Transfer of Equity",
};

const SALE_OPTIONS = ["Shared Ownership", "Help to Buy Equity Loan", "Unregistered", "New Build", "Declaration of Trust", "Auction Pack Preparation"];
const PURCHASE_OPTIONS = ["Buying First Home", "2nd Home or Buy To Let", "Gifted Deposit", "Help to Buy ISA", "Lifetime ISA", "New Build Legal Work Fee", "Shared Ownership", "Right To Buy", "Buying via Limited Company", "Declaration of Trust", "Unregistered", "Share of Freehold", "Auction Pack Review"];
const REMORTGAGE_OPTIONS = ["Buy To Let", "Share of Freehold", "Client is Company"];
const TRANSFER_OPTIONS = ["Shared Ownership"];

function getOptionsForType(type: string): string[] {
  if (type === "sale") return SALE_OPTIONS;
  if (type === "purchase") return PURCHASE_OPTIONS;
if (type === "sale-purchase") return Array.from(new Set([...SALE_OPTIONS, ...PURCHASE_OPTIONS]));
  if (type === "remortgage") return REMORTGAGE_OPTIONS;
  if (type === "transfer-of-equity") return TRANSFER_OPTIONS;
  return [];
}

function PersonFields({ label, data, onChange }: {
  label: string;
  data: AdditionalPerson;
  onChange: (data: AdditionalPerson) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-600">{label}</p>
      <input placeholder="Full Name *" required value={data.fullName} onChange={(e) => onChange({ ...data, fullName: e.target.value })} className={fieldClasses} />
      <input placeholder="Email Address *" type="email" required value={data.email} onChange={(e) => onChange({ ...data, email: e.target.value })} className={fieldClasses} />
      <input placeholder="Phone Number *" type="tel" value={data.phone} onChange={(e) => onChange({ ...data, phone: e.target.value })} className={fieldClasses} />
      <input placeholder="Correspondence Address *" required value={data.correspondenceAddress} onChange={(e) => onChange({ ...data, correspondenceAddress: e.target.value })} className={fieldClasses} />
    </div>
  );
}

export default function ProceedWithQuoteForm({ quoteData }: Props) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [correspondenceAddress, setCorrespondenceAddress] = useState("");

  // Step 2
  const [additionalCount, setAdditionalCount] = useState(0);
  const [additionalPeople, setAdditionalPeople] = useState<AdditionalPerson[]>([
    { fullName: "", email: "", phone: "", correspondenceAddress: "" },
    { fullName: "", email: "", phone: "", correspondenceAddress: "" },
  ]);

  // Step 3
  const [isLeasehold, setIsLeasehold] = useState(quoteData.isLeasehold);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(quoteData.selectedOptions);

  // Step 4
  const [agentType, setAgentType] = useState<"Estate Agent" | "Private">("Estate Agent");
  const [agentCompanyName, setAgentCompanyName] = useState("");
  const [agentContactName, setAgentContactName] = useState("");
  const [agentEmail, setAgentEmail] = useState("");
  const [agentPhone, setAgentPhone] = useState("");

  const stepLabels = ["Your Details", "Additional People", "Transaction", "Agent Info"];
  const availableOptions = getOptionsForType(quoteData.transactionType);

  function toggleOption(opt: string) {
    setSelectedOptions((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  }

  function updateAdditionalPerson(index: number, data: AdditionalPerson) {
    const updated = [...additionalPeople];
    updated[index] = data;
    setAdditionalPeople(updated);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload = {
      leadId: quoteData.leadId,
      fullName, email, phone, correspondenceAddress,
      additionalPeopleCount: additionalCount,
      additionalPeople: additionalPeople.slice(0, additionalCount),
      transactionType: quoteData.transactionType,
      transactionAddress: quoteData.transactionAddress,
      transactionValue: quoteData.transactionValue,
      isLeasehold,
      selectedOptions,
      agentType,
      agentCompanyName,
      agentContactName,
      agentEmail,
      agentPhone,
    };

    try {
      const res = await fetch("/api/proceed-with-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Couldn't reach the server — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 rounded-xl2 bg-bone-50 px-8 py-16 text-center"
      >
        <CheckCircle2 className="h-12 w-12 text-ink-600" />
        <h2 className="font-display text-3xl text-ink-900">Thank you — we're on it.</h2>
        <p className="max-w-sm text-ink-600">
          A member of the team will review your details and be in touch shortly to open your file.
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8 flex items-center gap-2">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-ink-900/10">
              <motion.div
                className="h-full rounded-full bg-brass-500"
                initial={{ width: 0 }}
                animate={{ width: i + 1 <= step ? "100%" : "0%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className="mt-1.5 hidden text-[11px] font-medium uppercase tracking-wide text-ink-500 sm:block">{label}</p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1 — Your Details */}
        {step === 1 && (
          <motion.div key="s1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
            <div className="overflow-hidden rounded-xl2 border border-ink-900/10">
              <div className={sectionHeader}>Your Details</div>
              <div className="space-y-4 bg-bone-50 p-6">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">Full Name *</label>
                  <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Name" className={fieldClasses} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">Email Address *</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={fieldClasses} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">Phone Number *</label>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className={fieldClasses} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">Correspondence Address *</label>
                  <input required value={correspondenceAddress} onChange={(e) => setCorrespondenceAddress(e.target.value)} placeholder="Correspondence Address" className={fieldClasses} />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!fullName || !email || !phone || !correspondenceAddress) return;
                setStep(2);
              }}
              className="mt-6 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-bone-50 shadow-soft hover:shadow-lift"
            >
              Next
            </button>
          </motion.div>
        )}

        {/* Step 2 — Additional People */}
        {step === 2 && (
          <motion.div key="s2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
            <button type="button" onClick={() => setStep(1)} className="mb-4 flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-ink-800">
              <ArrowLeft size={14} /> Back
            </button>
            <div className="overflow-hidden rounded-xl2 border border-ink-900/10">
              <div className={sectionHeader}>Additional People</div>
              <div className="space-y-5 bg-bone-50 p-6">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">
                    Please select additional partners transacting with you:
                  </label>
                  <select
                    value={additionalCount}
                    onChange={(e) => setAdditionalCount(Number(e.target.value))}
                    className={fieldClasses}
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                  </select>
                </div>

                {additionalCount >= 1 && (
                  <div className="rounded-lg border border-ink-900/10 p-4">
                    <PersonFields
                      label="Please confirm details of Additional Person 1:"
                      data={additionalPeople[0]}
                      onChange={(d) => updateAdditionalPerson(0, d)}
                    />
                  </div>
                )}

                {additionalCount >= 2 && (
                  <div className="rounded-lg border border-ink-900/10 p-4">
                    <PersonFields
                      label="Please confirm details of Additional Person 2:"
                      data={additionalPeople[1]}
                      onChange={(d) => updateAdditionalPerson(1, d)}
                    />
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="mt-6 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-bone-50 shadow-soft hover:shadow-lift"
            >
              Next
            </button>
          </motion.div>
        )}

        {/* Step 3 — Transactional Details */}
        {step === 3 && (
          <motion.div key="s3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
            <button type="button" onClick={() => setStep(2)} className="mb-4 flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-ink-800">
              <ArrowLeft size={14} /> Back
            </button>
            <div className="overflow-hidden rounded-xl2 border border-ink-900/10">
              <div className={sectionHeader}>Transactional Details</div>
              <div className="space-y-4 bg-bone-50 p-6">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">Transaction Type</label>
                  <input
                    readOnly
                    value={transactionLabels[quoteData.transactionType] ?? quoteData.transactionType}
                    className={`${fieldClasses} cursor-not-allowed bg-ink-900/5`}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">Transaction Address *</label>
                  <input
                    readOnly
                    value={quoteData.transactionAddress || "—"}
                    className={`${fieldClasses} cursor-not-allowed bg-ink-900/5`}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">Transaction Value *</label>
                  <input
                    readOnly
                    value={quoteData.transactionValue ? new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2 }).format(quoteData.transactionValue) : "—"}
                    className={`${fieldClasses} cursor-not-allowed bg-ink-900/5`}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-600">Type</label>
                  <div className="flex gap-6">
                    {["Freehold", "Leasehold"].map((opt) => (
                      <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-ink-700">
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
                </div>
              </div>
            </div>

            {availableOptions.length > 0 && (
              <div className="mt-4 overflow-hidden rounded-xl2 border border-ink-900/10">
                <div className={sectionHeader}>Selected Additional Options</div>
                <div className="grid grid-cols-1 gap-2 bg-bone-50 p-6 sm:grid-cols-2">
                  {availableOptions.map((opt) => (
                    <label key={opt} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700">
                      <input
                        type="checkbox"
                        checked={selectedOptions.includes(opt)}
                        onChange={() => toggleOption(opt)}
                        className="h-4 w-4 rounded border-ink-900/20 accent-brass-500"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setStep(4)}
              className="mt-6 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-bone-50 shadow-soft hover:shadow-lift"
            >
              Next
            </button>
          </motion.div>
        )}

        {/* Step 4 — Agent Information */}
        {step === 4 && (
          <motion.div key="s4" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
            <button type="button" onClick={() => setStep(3)} className="mb-4 flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-ink-800">
              <ArrowLeft size={14} /> Back
            </button>
            <form onSubmit={handleSubmit}>
              <div className="overflow-hidden rounded-xl2 border border-ink-900/10">
                <div className={sectionHeader}>Agent Information</div>
                <div className="space-y-4 bg-bone-50 p-6">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">Type *</label>
                    <select value={agentType} onChange={(e) => setAgentType(e.target.value as "Estate Agent" | "Private")} className={fieldClasses}>
                      <option value="Estate Agent">Estate Agent</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>
                  {agentType === "Estate Agent" && (
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">Company Name *</label>
                      <input required value={agentCompanyName} onChange={(e) => setAgentCompanyName(e.target.value)} placeholder="Name" className={fieldClasses} />
                    </div>
                  )}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">Contact Name *</label>
                    <input required value={agentContactName} onChange={(e) => setAgentContactName(e.target.value)} placeholder="Name" className={fieldClasses} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">Email Address *</label>
                    <input type="email" required value={agentEmail} onChange={(e) => setAgentEmail(e.target.value)} placeholder="Email" className={fieldClasses} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">Phone Number *</label>
                    <input type="tel" required value={agentPhone} onChange={(e) => setAgentPhone(e.target.value)} placeholder="Phone" className={fieldClasses} />
                  </div>
                </div>
              </div>
              {error && <p className="mt-3 text-sm text-clay-500">{error}</p>}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="mt-6 rounded-full bg-brass-500 px-8 py-3.5 text-sm font-medium text-ink-950 shadow-soft hover:shadow-lift disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit"}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}