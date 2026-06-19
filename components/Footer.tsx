import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import Container from "./Container";
import BloomMark from "./BloomMark";
import {
  footerServiceLinks,
  footerUsageLinks,
  navLinks,
  siteConfig,
} from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-ink-950 text-bone-200">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-2">
          <div className="flex items-center gap-2.5 text-bone-50">
            <BloomMark className="h-7 w-7 text-brass-400" />
            <span className="font-display text-lg">March &amp; Bloom</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone-200/70">
            A London property law practice handling residential, commercial,
            and landlord &amp; tenant matters — with one solicitor on your
            file from start to finish.
          </p>
          <div className="mt-6 space-y-2.5 text-sm text-bone-200/80">
            <a href={`tel:${siteConfig.phoneLandline.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-bone-50">
              <Phone size={15} className="text-brass-400" /> {siteConfig.phoneLandline}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-bone-50">
              <Mail size={15} className="text-brass-400" /> {siteConfig.email}
            </a>
            <div className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 shrink-0 text-brass-400" />
              <span>{siteConfig.registeredOffice}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-[0.14em] text-bone-50/90">
            Navigation
          </h3>
          <ul className="mt-5 space-y-2.5 text-sm text-bone-200/70">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-bone-50">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-[0.14em] text-bone-50/90">
            Our services
          </h3>
          <ul className="mt-5 space-y-2.5 text-sm text-bone-200/70">
            {footerServiceLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="transition-colors hover:text-bone-50">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-[0.14em] text-bone-50/90">
            Usage terms
          </h3>
          <ul className="mt-5 space-y-2.5 text-sm text-bone-200/70">
            {footerUsageLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-bone-50">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-bone-50/10">
        <Container className="flex flex-col gap-2 py-6 text-xs leading-relaxed text-bone-200/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} March and Bloom Law is a trading
            name of March and Bloom Law Limited, registered in England &amp;
            Wales (company no. {siteConfig.companyNumber}).
          </p>
          <p>
            Authorised and regulated by the SRA, registration no.{" "}
            {siteConfig.sraNumber}.
          </p>
        </Container>
      </div>
    </footer>
  );
}
