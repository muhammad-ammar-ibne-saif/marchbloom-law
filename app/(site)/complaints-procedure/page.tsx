import Container from "@/components/Container";
import AnimateIn from "@/components/AnimateIn";
import { siteConfig } from "@/lib/data";

const steps = [
  {
    title: "Raise it with your solicitor first",
    body: "Speak to whoever is handling your file — by phone, email, letter, or in person. The more detail you can give us, the faster we can look into it properly. You should hear back within 28 days.",
  },
  {
    title: "Escalate to a supervisor",
    body: "If the response doesn't resolve things, we'll bring in a supervisor to review the matter and come back to you once that review is complete.",
  },
  {
    title: "Write to our Client Care Partner",
    body: "Still unhappy? Put your complaint in writing to Kiran Odedra, our Client Care Partner. We'll acknowledge it within five working days, investigate fully, and respond in writing within four weeks.",
  },
  {
    title: "Independent review",
    body: "If our final response doesn't resolve things, you can ask another partner to reconsider, or refer the matter to the Legal Ombudsman.",
  },
];

export default function ComplaintsProcedurePage() {
  return (
    <section className="bg-bone-100 py-20">
      <Container className="max-w-3xl">
        <AnimateIn>
          <p className="font-display text-sm uppercase tracking-[0.2em] text-brass-600">
            Complaints procedure
          </p>
          <h1 className="mt-4 font-display text-4xl text-ink-900">
            If something hasn't gone right
          </h1>
          <p className="mt-5 text-ink-700">
            We take every concern seriously. Here's exactly how we handle a
            complaint, and what to expect at each stage.
          </p>
        </AnimateIn>

        <div className="mt-12 space-y-8">
          {steps.map((step, i) => (
            <AnimateIn
              key={step.title}
              delay={i * 0.06}
              className="flex gap-5 rounded-xl2 border border-ink-900/10 bg-bone-50 p-6"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900 font-display text-sm text-bone-50">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-lg text-ink-900">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{step.body}</p>
              </div>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn delay={0.3} className="mt-12 rounded-xl2 border border-ink-900/10 bg-bone-50 p-7">
          <h3 className="font-display text-lg text-ink-900">Contact details</h3>
          <dl className="mt-4 grid gap-3 text-sm text-ink-700 sm:grid-cols-2">
            <div>
              <dt className="text-ink-500">Client Care Partner</dt>
              <dd>Kiran Odedra</dd>
            </div>
            <div>
              <dt className="text-ink-500">Address</dt>
              <dd>{siteConfig.registeredOffice}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Phone</dt>
              <dd>{siteConfig.phoneLandline}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Email</dt>
              <dd>{siteConfig.email}</dd>
            </div>
          </dl>
        </AnimateIn>

        <AnimateIn delay={0.36} className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl2 border border-ink-900/10 bg-bone-50 p-6">
            <h4 className="font-display text-base text-ink-900">Legal Ombudsman</h4>
            <p className="mt-2 text-sm text-ink-600">
              PO Box 6167, Slough, SL1 0EH<br />
              0300 555 0333 · legalombudsman.org.uk
            </p>
            <p className="mt-2 text-xs text-ink-500">
              Complaints must usually be raised within six months of our
              final response, and within one year of the issue itself.
            </p>
          </div>
          <div className="rounded-xl2 border border-ink-900/10 bg-bone-50 p-6">
            <h4 className="font-display text-base text-ink-900">
              Solicitors Regulation Authority
            </h4>
            <p className="mt-2 text-sm text-ink-600">
              The Cube, 199 Wharfside Street, Birmingham B1 1RN<br />
              0370 606 2555 · sra.org.uk
            </p>
            <p className="mt-2 text-xs text-ink-500">
              For concerns about a possible breach of professional conduct.
            </p>
          </div>
        </AnimateIn>
      </Container>
    </section>
  );
}
