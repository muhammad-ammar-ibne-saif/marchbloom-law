import { Phone, ShieldCheck, Sparkles, Users } from "lucide-react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import AnimateIn from "@/components/AnimateIn";
import ServiceCard from "@/components/ServiceCard";
import FAQAccordion from "@/components/FAQAccordion";
import { differentiators, faqs, services, siteConfig } from "@/lib/data";

const icons = [ShieldCheck, Sparkles, Users, Phone];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bone-100 pb-24 pt-20 sm:pt-20 lg:pt-10">
        <div
          aria-hidden="true"
          className="absolute -right-32 -top-32 h-96 w-96 animate-float rounded-full bg-brass-300/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -left-24 top-40 h-72 w-72 rounded-full bg-ink-300/25 blur-3xl"
        />
        <Container className="relative">
          <AnimateIn>
            <p className="font-display text-sm uppercase tracking-[0.2em] text-brass-600">
              Property law, perfected
            </p>
          </AnimateIn>
          <AnimateIn delay={0.08}>
            <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl leading-[1.08] text-ink-900 sm:text-5xl lg:text-6xl">
              Clear, careful legal guidance for every property move
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.16}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-700">
              March &amp; Bloom Law specialises exclusively in property law —
              residential, commercial, and everything in between. Plain-English
              advice, handled with precision.
            </p>
          </AnimateIn>
          <AnimateIn
            delay={0.24}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button href="/book-a-consultation">Get a free quote</Button>
            <a
              href={`tel:${siteConfig.phoneLandline.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-ink-800 hover:text-ink-900"
            >
              <Phone size={16} className="text-brass-600" />
              {siteConfig.phoneLandline}
            </a>
          </AnimateIn>
        </Container>
      </section>

      {/* Intro */}
      <section className="bg-bone-50 py-20">
        <Container>
          <AnimateIn className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">
              Property law specialists, based in London
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-ink-700">
              We work with first-time buyers, growing families, landlords, and
              commercial portfolios — anyone navigating the legal side of a
              property transaction. Whatever the size or shape of your matter,
              you get the same direct access to an experienced solicitor from
              start to completion.
            </p>
          </AnimateIn>
        </Container>
      </section>

      {/* Services */}
      <section className="bg-bone-100 py-20">
        <Container>
          <AnimateIn className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">
              Where we help
            </h2>
            <p className="mt-4 text-ink-600">
              Three areas, one consistent standard of care.
            </p>
          </AnimateIn>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <ServiceCard key={service.slug} service={service} index={i} />
            ))}
          </div>
        </Container>
      </section>

      {/* Differentiators */}
      <section className="bg-ink-900 py-20 text-bone-100">
        <Container>
          <AnimateIn className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl sm:text-4xl">
              Why clients choose March &amp; Bloom
            </h2>
            <p className="mt-4 text-bone-100/70">
              Four habits that shape every matter we run, big or small.
            </p>
          </AnimateIn>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((item, i) => {
              const Icon = icons[i];
              return (
                <AnimateIn key={item.title} delay={i * 0.08}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brass-500/15 text-brass-400">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 font-display text-xl">{item.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-bone-100/65">
                    {item.description}
                  </p>
                </AnimateIn>
              );
            })}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-bone-50 py-20">
        <Container className="max-w-3xl">
          <AnimateIn className="text-center">
            <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-ink-600">
              The things clients ask us most often.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.1} className="mt-10">
            <FAQAccordion items={faqs} />
          </AnimateIn>
        </Container>
      </section>

      {/* CTA banner */}
      <section className="bg-bone-100 py-20">
        <Container>
          <AnimateIn className="flex flex-col items-center gap-6 rounded-xl2 bg-ink-900 px-8 py-14 text-center text-bone-100 sm:px-16">
            <h2 className="max-w-xl font-display text-3xl sm:text-4xl">
              Ready to talk through your transaction?
            </h2>
            <p className="max-w-md text-bone-100/70">
              Tell us a little about what you need and we'll come back with a
              clear quote — usually within one working day.
            </p>
            <Button href="/book-a-consultation" variant="secondary">
              Get a free quote
            </Button>
          </AnimateIn>
        </Container>
      </section>
    </>
  );
}
