import Container from "@/components/Container";
import Button from "@/components/Button";
import AnimateIn from "@/components/AnimateIn";
import FAQAccordion from "@/components/FAQAccordion";
import { faqs, team } from "@/lib/data";

export default function AboutPage() {
  return (
    <>
      <section className="bg-bone-100 pb-16 pt-20 sm:pt-24">
        <Container>
          <AnimateIn>
            <p className="font-display text-sm uppercase tracking-[0.2em] text-brass-600">
              About us
            </p>
            <h1 className="mt-4 max-w-2xl text-balance font-display text-4xl text-ink-900 sm:text-5xl">
              Property law. Nothing else.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-700">
              A focused practice built on trust, plain speaking, and steady
              results.
            </p>
          </AnimateIn>
        </Container>
      </section>

      <section className="bg-bone-50 py-16">
        <Container className="grid gap-12 lg:grid-cols-2">
          <AnimateIn>
            <h2 className="font-display text-2xl text-ink-900">Who we are</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
              March &amp; Bloom Law is a London property practice built
              around lasting relationships rather than one-off transactions.
              We act for private individuals, small businesses, and larger
              corporate clients alike, shaping the service around what each
              matter actually needs.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 className="font-display text-2xl text-ink-900">Who we're for</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
              Straightforward purchase or complicated chain — we bring the
              same level of attention either way. What sets the practice
              apart is a refusal to hide behind jargon: costs and timelines
              are laid out from day one, and you're kept in the loop without
              having to chase us for updates.
            </p>
          </AnimateIn>
        </Container>
      </section>

      <section className="bg-bone-100 py-16">
        <Container>
          <AnimateIn className="text-center">
            <h2 className="font-display text-3xl text-ink-900">Meet the team</h2>
            <p className="mt-3 text-ink-600">
              The solicitors handling your matter, named and accountable.
            </p>
          </AnimateIn>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <AnimateIn
                key={member.name}
                delay={i * 0.08}
                className="rounded-xl2 border border-ink-900/10 bg-bone-50 p-6 text-center transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink-900/8 font-display text-lg text-ink-700">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="mt-4 font-display text-lg text-ink-900">
                  {member.name}
                </h3>
                <p className="text-sm text-brass-600">{member.role}</p>
                <p className="mt-2 text-xs text-ink-500">
                  {member.experience} · {member.location}
                </p>
              </AnimateIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-bone-50 py-16">
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

      <section className="bg-bone-100 py-16">
        <Container className="flex flex-col items-center gap-5 text-center">
          <h2 className="font-display text-2xl text-ink-900">
            Want to talk it through first?
          </h2>
          <Button href="/book-a-consultation">Speak to us today</Button>
        </Container>
      </section>
    </>
  );
}
