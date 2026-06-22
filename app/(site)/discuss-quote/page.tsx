import Link from "next/link";
import { Phone } from "lucide-react";
import Container from "@/components/Container";
import { siteConfig } from "@/lib/data";

export default function DiscussQuotePage() {
  return (
    <section className="bg-bone-100 pb-24 pt-6">
      <Container className="flex flex-col items-center text-center">
        <div className="mx-auto max-w-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink-900/8">
            <Phone size={28} className="text-ink-700" />
          </div>
          <h1 className="mt-6 font-display text-3xl text-ink-900 sm:text-4xl">
            We have received your call back request.
          </h1>
          <p className="mt-4 text-lg text-ink-600">
            A member of the team will be in touch shortly!
          </p>

          <div className="mt-10 rounded-xl2 border border-ink-900/10 bg-bone-50 p-8">
            <p className="text-ink-700">Want to speak to someone straight away?</p>
            <a
              href={`tel:${siteConfig.phoneLandline.replace(/\s/g, "")}`}
              className="mt-3 block font-display text-3xl text-brass-600 hover:text-brass-500"
            >
              {siteConfig.phoneLandline}
            </a>
          </div>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink-600 hover:text-ink-900"
          >
            ← Back to home
          </Link>
        </div>
      </Container>
    </section>
  );
}