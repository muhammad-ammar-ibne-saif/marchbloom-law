"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { formatNumberWithCommas, parseCompactNumber } from "@/lib/pricing";

type CurrencyInputProps = {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
};

export default function CurrencyInput({
  value,
  onChange,
  placeholder = "e.g. 350,000",
  className = "",
  required,
}: CurrencyInputProps) {
  const [display, setDisplay] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setDisplay(value > 0 ? formatNumberWithCommas(value) : "");
  }, [value, focused]);

  function handleFocus() {
    setFocused(true);
    setDisplay(value > 0 ? formatNumberWithCommas(value) : "");
  }

  function handleBlur() {
    setFocused(false);
    setDisplay(value > 0 ? formatNumberWithCommas(value) : "");
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setDisplay(raw);
    onChange(parseCompactNumber(raw));
  }

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400">£</span>
      <input
        type="text"
        inputMode="numeric"
        value={display}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        className={`pl-8 ${className}`}
      />
    </div>
  );
}