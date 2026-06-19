"use client";

import { useMemo, useState, FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Home,
  KeyRound,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import {
  calculateQuote,
  formatGBP,
  TransactionType,
} from "@/lib/pricing";

type Step = 1 | 2 | 3 | 4;

const transactionOptions: {
  type: TransactionType;
  label: string;
  hint: string;
  icon: typeof Home;
}[] = [
  { type: "purchase", label: "Buying", hint: "Purchasing a property", icon: Home },
  { type: "sale", label: "Selling", hint: "Selling a property", icon: KeyRound },
  { type: "remortgage", label: "Remortgaging", hint: "Switching or renewing a mortgage", icon: RefreshCw },
];

const fieldClasses =
  "w-full rounded-lg border border-ink-900/15 bg-bone-50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-brass-500 focus:outline-none";

const slideVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export default function InstantQuote() {
  const [step, setStep] = useState<Step>(1);
  const [type, setType] = useState<TransactionType | null>(null);
  const [value, setValue] = useState(350000);
  const [isLeasehold, setIsLeasehold] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const breakdown = useMemo(
    () => (type ? calculateQuote(type, value, isLeasehold) : null),
    [type, value, isLeasehold]
  );

  function goTo(next: Step) {
    setStep(next);
  }

  const stepLabels = ["Transaction", "Property", "Your estimate", "Get my quote"];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      message: formData.get("message") || "",
      honeypot: formData.get("company"), // hidden field — real users leave it blank
      transactionType: type,
      propertyValue: type === "remortgage" ? null : value,
      isLeasehold,
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
        setSubmitError(data.error || "Something went wrong — please try again.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError("Couldn't reach the server — please check your connection and try again.");
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
          We've sent your details to our team — a solicitor will confirm
          your quote by email, usually within one working day.
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
        {/* Step 1: transaction type */}
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
              What are you doing?
            </h3>
            <p className="mt-1 text-sm text-ink-600">
              We'll tailor the estimate to your transaction.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {transactionOptions.map((option) => {
                const Icon = option.icon;
                const active = type === option.type;
                return (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => {
                      setType(option.type);
                      goTo(2);
                    }}
                    className={`flex flex-col items-start gap-3 rounded-xl2 border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                      active
                        ? "border-brass-500 bg-brass-500/10"
                        : "border-ink-900/12 bg-bone-50 hover:border-ink-900/25"
                    }`}
                  >
                    <Icon size={20} className="text-ink-700" />
                    <span className="font-display text-base text-ink-900">
                      {option.label}
                    </span>
                    <span className="text-xs text-ink-500">{option.hint}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Step 2: property details */}
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
              onClick={() => goTo(1)}
              className="mb-4 flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-ink-800"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <h3 className="font-display text-xl text-ink-900">
              {type === "remortgage" ? "About the property" : "Property value"}
            </h3>

            {type !== "remortgage" && (
              <div className="mt-6">
                <div className="flex items-baseline justify-between">
                  <label htmlFor="value" className="text-xs font-medium uppercase tracking-wide text-ink-600">
                    Estimated {type === "purchase" ? "purchase" : "sale"} price
                  </label>
                  <span className="font-display text-2xl text-ink-900">
                    {formatGBP(value)}
                  </span>
                </div>
                <input
                  id="value"
                  type="range"
                  min={50000}
                  max={2000000}
                  step={5000}
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-ink-900/10 accent-brass-500"
                />
                <div className="mt-1.5 flex justify-between text-[11px] text-ink-400">
                  <span>£50k</span>
                  <span>£2m+</span>
                </div>
              </div>
            )}

            <fieldset className="mt-7">
              <legend className="text-xs font-medium uppercase tracking-wide text-ink-600">
                Tenure
              </legend>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {[
                  { label: "Freehold", val: false },
                  { label: "Leasehold", val: true },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setIsLeasehold(opt.val)}
                    className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                      isLeasehold === opt.val
                        ? "border-brass-500 bg-brass-500/10 text-ink-900"
                        : "border-ink-900/12 text-ink-600 hover:border-ink-900/25"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <button
              type="button"
              onClick={() => goTo(3)}
              className="mt-8 w-full rounded-full bg-ink-900 px-6 py-3.5 text-sm font-medium text-bone-50 shadow-soft transition-shadow hover:shadow-lift sm:w-auto"
            >
              See my estimate
            </button>
          </motion.div>
        )}

        {/* Step 3: live estimate */}
        {step === 3 && breakdown && (
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
              onClick={() => goTo(2)}
              className="mb-4 flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-ink-800"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <h3 className="font-display text-xl text-ink-900">Your estimate</h3>
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
                  <span className="font-medium">{formatGBP(breakdown.legalFee)}</span>
                </div>
                {breakdown.leaseholdFee > 0 && (
                  <div className="flex justify-between">
                    <span>Leasehold supplement</span>
                    <span className="font-medium">{formatGBP(breakdown.leaseholdFee)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated disbursements</span>
                  <span className="font-medium">{formatGBP(breakdown.disbursementsEstimate)}</span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-500">
              Indicative estimate, excluding VAT. Your final quote may vary
              based on title complexity, search results, and lender
              requirements.
            </p>
            <button
              type="button"
              onClick={() => goTo(4)}
              className="mt-7 w-full rounded-full bg-ink-900 px-6 py-3.5 text-sm font-medium text-bone-50 shadow-soft transition-shadow hover:shadow-lift sm:w-auto"
            >
              Get my confirmed quote
            </button>
          </motion.div>
        )}

        {/* Step 4: lead capture — saved to our own database + emailed */}
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
              onClick={() => goTo(3)}
              className="mb-4 flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-ink-800"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <h3 className="font-display text-xl text-ink-900">
              Where should we send it?
            </h3>
            <p className="mt-1 text-sm text-ink-600">
              A solicitor will confirm the figure above by email, usually
              within one working day.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Honeypot field — hidden from real users, bots tend to fill it in */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                className="absolute h-0 w-0 opacity-0"
                aria-hidden="true"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="firstName" required placeholder="First name" className={fieldClasses} />
                <input name="lastName" required placeholder="Last name" className={fieldClasses} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="phone" type="tel" required placeholder="Phone" className={fieldClasses} />
                <input name="email" type="email" required placeholder="Email" className={fieldClasses} />
              </div>
              <textarea
                name="message"
                rows={3}
                placeholder="Anything else we should know? (optional)"
                className={fieldClasses}
              />
              <p className="text-xs leading-relaxed text-ink-500">
                By submitting, you agree to our Privacy Policy. We'll only
                use your details to send your quote and follow up on it.
              </p>
              {submitError && (
                <p className="text-sm text-clay-500">{submitError}</p>
              )}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-brass-500 px-6 py-3.5 text-sm font-medium text-ink-950 shadow-soft transition-shadow hover:shadow-lift disabled:opacity-60 sm:w-auto"
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
