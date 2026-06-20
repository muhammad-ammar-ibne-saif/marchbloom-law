"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const fieldClasses =
  "w-full rounded-lg border border-ink-900/15 bg-bone-50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-brass-500 focus:outline-none";

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject") || "",
      message: formData.get("message"),
      honeypot: formData.get("company"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong — please try again.");
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
        className="flex flex-col items-center gap-3 rounded-xl2 border border-ink-900/10 bg-bone-50 px-8 py-14 text-center"
      >
        <CheckCircle2 className="h-10 w-10 text-ink-600" />
        <h3 className="font-display text-2xl text-ink-900">
          Thanks — that's with us.
        </h3>
        <p className="max-w-sm text-sm text-ink-600">
          A member of the team will get back to you within one working day.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="absolute h-0 w-0 opacity-0"
        aria-hidden="true"
      />
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600"
        >
          Name
        </label>
        <input id="name" name="name" required className={fieldClasses} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={fieldClasses}
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600"
          >
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className={fieldClasses}
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="subject"
          className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600"
        >
          Subject <span className="normal-case text-ink-400">(optional)</span>
        </label>
        <input id="subject" name="subject" className={fieldClasses} />
      </div>
      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={fieldClasses}
        />
      </div>
      <p className="text-xs leading-relaxed text-ink-500">
        By submitting this form you agree to our handling of your details as set
        out in our Privacy Policy.
      </p>
      {error && <p className="text-sm text-clay-500">{error}</p>}
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-ink-900 px-6 py-3.5 text-sm font-medium text-bone-50 shadow-soft transition-shadow hover:shadow-lift disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "Sending..." : "Send message"}
      </motion.button>
    </form>
  );
}
