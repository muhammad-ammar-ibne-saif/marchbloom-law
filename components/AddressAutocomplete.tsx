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
  placeholder = "Enter full property address",
  className = "",
}: Props) {
  return (
    <input
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

// "use client";

// import { useEffect, useRef, useState } from "react";

// type Props = {
//   value: string;
//   onChange: (value: string) => void;
//   disabled?: boolean;
//   required?: boolean;
//   placeholder?: string;
//   className?: string;
// };

// export default function AddressAutocomplete({
//   value,
//   onChange,
//   disabled,
//   required,
//   placeholder = "Start typing your address",
//   className = "",
// }: Props) {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const initialised = useRef(false);
//   const [ready, setReady] = useState(false);

//   // Load the Google Maps script once
//   useEffect(() => {
//     const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
//     if (!apiKey) return;

//     // Already loaded
//     if ((window as any).google?.maps?.places) {
//       setReady(true);
//       return;
//     }

//     // Already loading
//     if (document.getElementById("google-maps-script")) {
//       const interval = setInterval(() => {
//         if ((window as any).google?.maps?.places) {
//           setReady(true);
//           clearInterval(interval);
//         }
//       }, 100);
//       return () => clearInterval(interval);
//     }

//     const script = document.createElement("script");
//     script.id = "google-maps-script";
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
//     script.async = true;
//     script.defer = true;
//     script.onload = () => setReady(true);
//     document.head.appendChild(script);
//   }, []);

//   // Attach autocomplete once script is ready and input is mounted
//   useEffect(() => {
//     if (!ready || !inputRef.current || initialised.current || disabled) return;
//     initialised.current = true;

//     const autocomplete = new (window as any).google.maps.places.Autocomplete(
//       inputRef.current,
//       {
//         componentRestrictions: { country: "gb" },
//         fields: ["formatted_address"],
//         types: ["address"],
//       }
//     );

//     autocomplete.addListener("place_changed", () => {
//       const place = autocomplete.getPlace();
//       if (place?.formatted_address) {
//         onChange(place.formatted_address);
//       }
//     });
//   }, [ready, disabled, onChange]);

//   return (
//     <input
//       ref={inputRef}
//       type="text"
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       disabled={disabled}
//       required={required}
//       placeholder={placeholder}
//       autoComplete="off"
//       className={className}
//     />
//   );
// }