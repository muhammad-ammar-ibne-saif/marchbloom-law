import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const variants = {
  primary:
    "bg-ink-900 text-bone-50 hover:bg-ink-800 shadow-soft hover:shadow-lift",
  secondary:
    "bg-brass-500 text-ink-950 hover:bg-brass-400 shadow-soft hover:shadow-lift",
  ghost:
    "bg-transparent text-ink-900 ring-1 ring-ink-900/15 hover:ring-ink-900/30 hover:bg-ink-900/5",
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 ease-out hover:-translate-y-0.5 ${variants[variant]} ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
