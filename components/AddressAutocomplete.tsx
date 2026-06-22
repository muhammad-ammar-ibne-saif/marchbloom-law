"use client";

import { useEffect, useId, useRef } from "react";

declare global {
  interface Window {
    google?: any;
    __googleMapsCallback?: () => void;
  }
}

let loadingPromise: Promise<void> | null = null;

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps?.places) return Promise.resolve();
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve) => {
    window.__googleMapsCallback = () => resolve();
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=__googleMapsCallback`;
    script.async = true;
    document.head.appendChild(script);
  });

  return loadingPromise;
}

type AddressAutocompleteProps = {
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
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const id = useId();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey || disabled) return;
    let cancelled = false;

    loadGoogleMaps(apiKey).then(() => {
      if (cancelled || !inputRef.current || !window.google) return;
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: "gb" },
          fields: ["formatted_address"],
          types: ["address"],
        }
      );
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place?.formatted_address) onChange(place.formatted_address);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [apiKey, disabled, onChange]);

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required={required}
      placeholder={
        apiKey ? placeholder : `${placeholder} (lookup not configured)`
      }
      autoComplete="off"
      className={className}
    />
  );
}
