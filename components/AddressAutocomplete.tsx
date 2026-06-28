"use client";

import { useEffect, useRef } from "react";

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
  placeholder = "Enter address or postcode",
  className = "",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const initialisedRef = useRef(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey || disabled || initialisedRef.current) return;

    let cancelled = false;

    loadGoogleMaps(apiKey).then(() => {
      if (cancelled || !inputRef.current || !window.google) return;

      initialisedRef.current = true;

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          // "geocode" supports both street addresses AND postcode-only searches
          // "address" only works for full street addresses
          types: ["geocode"],
          componentRestrictions: { country: "gb" },
          fields: ["formatted_address", "address_components"],
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (!place) return;

        // Build a clean full address including postcode from address_components
        // because formatted_address sometimes omits the postcode for postcode-only searches
        if (place.address_components) {
          const components = place.address_components as any[];

          const get = (type: string) =>
            components.find((c: any) => c.types.includes(type))?.long_name ?? "";

          const streetNumber  = get("street_number");
          const route         = get("route");
          const locality      = get("locality") || get("postal_town");
          const adminArea     = get("administrative_area_level_2");
          const postcode      = get("postal_code");

          const parts = [
            streetNumber && route ? `${streetNumber} ${route}` : route || streetNumber,
            locality,
            adminArea !== locality ? adminArea : "",
            postcode,
          ].filter(Boolean);

          if (parts.length > 0) {
            onChange(parts.join(", "));
            return;
          }
        }

        // Fallback to formatted_address
        if (place.formatted_address) {
          onChange(place.formatted_address);
        }
      });
    });

    return () => {
      cancelled = true;
    };
  }, [apiKey, disabled, onChange]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      autoComplete="off"
      className={className}
    />
  );
}