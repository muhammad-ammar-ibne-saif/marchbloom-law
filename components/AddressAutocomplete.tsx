"use client";

import { useEffect, useRef, useState } from "react";

type Suggestion = { address: string; id: string };

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
};

export default function AddressAutocomplete({
  value,
  onChange,
  disabled,
  required,
  placeholder = "Start typing your address",
  className = "",
}: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const token = process.env.NEXT_PUBLIC_GETADDRESS_DOMAIN_TOKEN;

  useEffect(() => {
    if (!value || value.length < 3 || disabled || !token) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.getaddress.io/autocomplete/${encodeURIComponent(value)}?api-key=${token}&all=true`
        );
        const data = await res.json();
        if (data.suggestions?.length) {
          setSuggestions(data.suggestions.slice(0, 6));
          setOpen(true);
        } else {
          setSuggestions([]);
          setOpen(false);
        }
      } catch {
        setSuggestions([]);
      }
    }, 300);
  }, [value, disabled, token]);

  function select(suggestion: Suggestion) {
    onChange(suggestion.address);
    setSuggestions([]);
    setOpen(false);
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        className={className}
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-ink-900/15 bg-bone-50 shadow-lift">
          {suggestions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onMouseDown={() => select(s)}
                className="w-full px-4 py-2.5 text-left text-sm text-ink-800 hover:bg-ink-900/5"
              >
                {s.address}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
