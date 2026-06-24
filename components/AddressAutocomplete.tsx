"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google?: any;
    __mapsReady?: boolean;
    __mapsCallbacks?: (() => void)[];
  }
}

function loadGoogleMaps(apiKey: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve();

    // Already loaded
    if (window.__mapsReady && window.google?.maps?.places) return resolve();

    // Queue up if currently loading
    if (!window.__mapsCallbacks) window.__mapsCallbacks = [];
    window.__mapsCallbacks.push(resolve);

    // Already injected
    if (document.getElementById("gmaps-script")) return;

    (window as any).__gmapsInit = () => {
      window.__mapsReady = true;
      window.__mapsCallbacks?.forEach((cb) => cb());
      window.__mapsCallbacks = [];
    };

    const script = document.createElement("script");
    script.id = "gmaps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=__gmapsInit`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  });
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
  placeholder = "Start typing your address",
  className = "",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const boundRef = useRef(false);
  const [ready, setReady] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Load script once
  useEffect(() => {
    if (!apiKey) return;
    loadGoogleMaps(apiKey).then(() => setReady(true));
  }, [apiKey]);

  // Attach autocomplete once ready and input mounted
  useEffect(() => {
    if (!ready || !inputRef.current || boundRef.current || disabled) return;
    boundRef.current = true;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        componentRestrictions: { country: "gb" },
        fields: ["formatted_address"],
        types: ["address"],
      }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (place?.formatted_address) {
        onChange(place.formatted_address);
      }
    });
  }, [ready, disabled, onChange]);

  // Reset autocomplete binding if disabled changes
  useEffect(() => {
    if (disabled) {
      boundRef.current = false;
      autocompleteRef.current = null;
    }
  }, [disabled]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required={required}
      placeholder={apiKey ? placeholder : "Enter full property address"}
      autoComplete="off"
      className={className}
    />
  );
}