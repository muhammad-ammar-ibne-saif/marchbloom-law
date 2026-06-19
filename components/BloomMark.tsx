export default function BloomMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M24 6C24 6 30 14 30 21C30 26.5228 27.3137 31 24 31C20.6863 31 18 26.5228 18 21C18 14 24 6 24 6Z"
        fill="currentColor"
        fillOpacity="0.92"
      />
      <path
        d="M24 31C24 31 11 29 7 22C4.5 17.6603 8 13 12.5 13C18 13 24 21 24 31Z"
        fill="currentColor"
        fillOpacity="0.7"
      />
      <path
        d="M24 31C24 31 37 29 41 22C43.5 17.6603 40 13 35.5 13C30 13 24 21 24 31Z"
        fill="currentColor"
        fillOpacity="0.7"
      />
      <path
        d="M24 31V42"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 37C24 37 19 36 17 33"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M24 39C24 39 29 38 31 35"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
