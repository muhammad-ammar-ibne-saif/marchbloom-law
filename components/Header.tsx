"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import Container from "./Container";
import BloomMark from "./BloomMark";
import { navLinks, siteConfig } from "@/lib/data";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-900/8 bg-bone-100/85 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 text-ink-900 transition-opacity hover:opacity-80"
        >
          <BloomMark className="h-11 w-11 text-ink-700" />
          <span className="font-display text-2xl leading-tight">
            March <span className="text-brass-600">&amp;</span> Bloom
            <span className="block text-[12px] font-body font-medium uppercase tracking-[0.18em] text-ink-500 flex justify-center">
              Law
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-ink-700 transition-colors hover:text-ink-900 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-brass-500 after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href={`tel:${siteConfig.phoneLandline.replace(/\s/g, "")}`}
            className="flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-900"
          >
            <Phone size={15} className="text-brass-600" />
            {siteConfig.phoneLandline}
          </a>
          <Link
            href="/book-a-consultation"
            className="rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-bone-50 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink-800 hover:shadow-lift"
          >
            Get a quote
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-900 lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-ink-900/8 bg-bone-100 lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-ink-800 transition-colors hover:bg-ink-900/5"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`tel:${siteConfig.phoneLandline.replace(/\s/g, "")}`}
                className="mt-2 flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-600"
              >
                <Phone size={15} className="text-brass-600" />
                {siteConfig.phoneLandline}
              </a>
              <Link
                href="/book-a-consultation"
                onClick={() => setOpen(false)}
                className="mt-3 rounded-full bg-ink-900 px-5 py-3 text-center text-sm font-medium text-bone-50"
              >
                Get a quote
              </Link>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
