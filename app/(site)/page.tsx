import Image from "next/image";
import { Phone, ShieldCheck, Sparkles, Users, Clock } from "lucide-react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import AnimateIn from "@/components/AnimateIn";
import ServiceCard from "@/components/ServiceCard";
import FAQAccordion from "@/components/FAQAccordion";
import { differentiators, faqs, services, siteConfig } from "@/lib/data";

const differentiatorIcons = [ShieldCheck, Clock, Sparkles, Users];

const differentiatorImages = [
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80&fit=crop",
  "https://images.unsplash.com/photo-1508780709619-79562169bc64?w=600&q=80&fit=crop",
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80&fit=crop",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80&fit=crop",
];

const serviceImages: Record<string, string> = {
  residential: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&q=80&fit=crop",
  commercial: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80&fit=crop",
  "landlord-tenant": "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=900&q=80&fit=crop",
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bone-100 pb-24 pt-20 sm:pt-28">
        <div aria-hidden="true" className="absolute -right-32 -top-32 h-96 w-96 animate-float rounded-full bg-brass-300/30 blur-3xl" />
        <div aria-hidden="true" className="absolute -left-24 top-40 h-72 w-72 rounded-full bg-ink-300/25 blur-3xl" />
        <Container className="relative grid items-center gap-12 lg:grid-cols-2">
          <div>
            <AnimateIn>
              <p className="font-display text-sm uppercase tracking-[0.2em] text-brass-600">
                Property law, perfected
              </p>
            </AnimateIn>
            <AnimateIn delay={0.08}>
              <h1 className="mt-5 max-w-xl text-balance font-display text-4xl leading-[1.08] text-ink-900 sm:text-5xl lg:text-6xl">
                Clear, careful legal guidance for every property move
              </h1>
            </AnimateIn>
            <AnimateIn delay={0.16}>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-700">
                March &amp; Bloom Law specialises exclusively in property
                law — residential, commercial, and everything in between.
                Plain-English advice, handled with precision.
              </p>
            </AnimateIn>
            <AnimateIn delay={0.24} className="mt-9 flex flex-wrap items-center gap-4">
              <Button href="/book-a-consultation">Get a free quote</Button>
              <a href={`tel:${siteConfig.phoneLandline.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-ink-800 hover:text-ink-900">
                <Phone size={16} className="text-brass-600" />
                {siteConfig.phoneLandline}
              </a>
            </AnimateIn>
          </div>
          <AnimateIn delay={0.2} className="relative hidden lg:block">
            <div className="relative h-[460px] w-full overflow-hidden rounded-xl2 shadow-lift">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80&fit=crop"
                alt="Property law consultation"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-ink-900/10" />
            </div>
          </AnimateIn>
        </Container>
      </section>

      {/* Intro */}
      <section className="bg-bone-50 py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <AnimateIn className="relative h-80 overflow-hidden rounded-xl2 shadow-soft lg:h-96">
            <Image
              src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1000&q=80&fit=crop"
              alt="Solicitors at work"
              fill
              className="object-cover"
            />
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">
              Property law specialists, based in London
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-ink-700">
              We work with first-time buyers, growing families, landlords,
              and commercial portfolios — anyone navigating the legal side
              of a property transaction. Whatever the size or shape of your
              matter, you get the same direct access to an experienced
              solicitor from start to completion.
            </p>
          </AnimateIn>
        </Container>
      </section>

      {/* Services */}
      <section className="bg-bone-100 py-20">
        <Container>
          <AnimateIn className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">Where we help</h2>
            <p className="mt-4 text-ink-600">Three areas, one consistent standard of care.</p>
          </AnimateIn>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <AnimateIn key={service.slug} delay={i * 0.08}>
                <div className="group flex flex-col overflow-hidden rounded-xl2 border border-ink-900/8 bg-bone-50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="relative h-52 w-full overflow-hidden">
                    <Image
                      src={serviceImages[service.slug] ?? serviceImages.residential}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-ink-900/20" />
                    <span className="absolute bottom-4 left-5 font-display text-3xl text-bone-50/20 transition-colors duration-300 group-hover:text-brass-400/30">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-xl text-ink-900">{service.title}</h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.1em] text-brass-600">{service.tagline}</p>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-700">{service.description}</p>
                    <a href="/book-a-consultation"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink-900 transition-colors hover:text-brass-600">
                      Speak to us
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Differentiators */}
      <section className="bg-ink-900 py-20 text-bone-100">
        <Container>
          <AnimateIn className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl sm:text-4xl">Why clients choose March &amp; Bloom</h2>
            <p className="mt-4 text-bone-100/70">Four habits that shape every matter we run, big or small.</p>
          </AnimateIn>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((item, i) => (
              <AnimateIn key={item.title} delay={i * 0.08}>
                <div className="overflow-hidden rounded-xl2 bg-bone-50/5 transition-all duration-300 hover:bg-bone-50/10">
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={differentiatorImages[i]}
                      alt={item.title}
                      fill
                      className="object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-ink-900/40" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-bone-100/65">{item.description}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-bone-50 py-20">
        <Container className="max-w-3xl">
          <AnimateIn className="text-center">
            <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">Frequently asked questions</h2>
            <p className="mt-4 text-ink-600">The things clients ask us most often.</p>
          </AnimateIn>
          <AnimateIn delay={0.1} className="mt-10">
            <FAQAccordion items={faqs} />
          </AnimateIn>
        </Container>
      </section>

      {/* CTA banner */}
      <section className="bg-bone-100 py-20">
        <Container>
          <AnimateIn>
            <div className="relative overflow-hidden rounded-xl2 bg-ink-900 px-8 py-14 text-center text-bone-100 sm:px-16">
              <div aria-hidden="true" className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brass-500/10 blur-3xl" />
              <div aria-hidden="true" className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-ink-700/50 blur-3xl" />
              <div className="relative">
                <h2 className="max-w-xl mx-auto font-display text-3xl sm:text-4xl">
                  Ready to talk through your transaction?
                </h2>
                <p className="mt-4 max-w-md mx-auto text-bone-100/70">
                  Tell us a little about what you need and we'll come back with
                  a clear quote — usually within one working day.
                </p>
                <div className="mt-8">
                  <Button href="/book-a-consultation" variant="secondary">
                    Get a free quote
                  </Button>
                </div>
              </div>
            </div>
          </AnimateIn>
        </Container>
      </section>
    </>
  );
}