import Container from "@/components/Container";
import Button from "@/components/Button";
import AnimateIn from "@/components/AnimateIn";
import ServiceCard from "@/components/ServiceCard";
import FAQAccordion from "@/components/FAQAccordion";
import { faqs, services } from "@/lib/data";
import Image from "next/image";

export default function ServicesPage() {
  return (
    <>
     {/* Hero with image */}
      <section className="relative overflow-hidden bg-bone-100 pb-16 pt-20 sm:pt-24">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <AnimateIn>
            <p className="font-display text-sm uppercase tracking-[0.2em] text-brass-600">Our services</p>
            <h1 className="mt-4 max-w-2xl text-balance font-display text-4xl text-ink-900 sm:text-5xl">
              Specialist support for every property transaction
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-700">
              One firm, one standard of care, across residential, commercial,
              and landlord &amp; tenant matters.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.15} className="relative h-72 overflow-hidden rounded-xl2 shadow-lift lg:h-80">
            <Image
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1000&q=80&fit=crop"
              alt="Property law services"
              fill
              className="object-cover"
            />
          </AnimateIn>
        </Container>
      </section>

      <section className="bg-bone-50 py-16">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <ServiceCard key={service.slug} service={service} index={i} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-bone-100 py-16">
        <Container className="max-w-3xl">
          <AnimateIn className="text-center">
            <h2 className="font-display text-3xl text-ink-900">
              Frequently asked questions
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.1} className="mt-10">
            <FAQAccordion items={faqs} />
          </AnimateIn>
        </Container>
      </section>

      <section className="bg-bone-50 py-16">
        <Container className="flex flex-col items-center gap-5 text-center">
          <h2 className="font-display text-2xl text-ink-900">
            Not sure which service you need?
          </h2>
          <p className="max-w-md text-ink-600">
            Tell us what's happening and we'll point you in the right
            direction — no obligation.
          </p>
          <Button href="/book-a-consultation">Get an instant quote</Button>
        </Container>
      </section>
    </>
  );
}
