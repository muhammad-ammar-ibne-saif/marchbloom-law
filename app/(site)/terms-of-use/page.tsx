import Container from "@/components/Container";
import AnimateIn from "@/components/AnimateIn";
import { siteConfig } from "@/lib/data";

const sections = [
  {
    title: "1. Who we are",
    body: `March and Bloom Law is a limited company registered in England and Wales under company number ${siteConfig.companyNumber}, authorised and regulated by the Solicitors Regulation Authority under registration number ${siteConfig.sraNumber}.`,
  },
  {
    title: "2. General information only",
    body: "Nothing on this website constitutes legal advice. It's provided for general information, and shouldn't be relied on as a substitute for advice tailored to your specific circumstances.",
  },
  {
    title: "3. Accuracy",
    body: "We do our best to keep this site accurate and up to date, but we make no guarantee that it is. We won't be liable for loss arising from reliance on anything published here.",
  },
  {
    title: "4. No solicitor-client relationship",
    body: "Browsing this site doesn't create a solicitor-client relationship. That only begins once we've confirmed instructions with you in writing, under our standard terms of business.",
  },
  {
    title: "5. Intellectual property",
    body: "Unless stated otherwise, we own the rights to the text, graphics, and branding on this site. You're welcome to view or download material for personal use, but not to reproduce or redistribute it without our written consent.",
  },
  {
    title: "6. External links",
    body: "Where this site links out to third-party websites, those links are for convenience only. We don't control or endorse their content and aren't responsible for it.",
  },
  {
    title: "7. Data protection",
    body: "We handle personal data in line with UK GDPR and the Data Protection Act 2018. See our Privacy Policy for the details of what we collect and why.",
  },
  {
    title: "8. Limitation of liability",
    body: "To the extent the law allows, we exclude liability for loss arising from your use of this site or reliance on its content. This doesn't affect liability that can't be excluded by law, including for negligence causing death or personal injury, or fraud.",
  },
  {
    title: "9. Complaints",
    body: "If something's gone wrong, our Complaints Procedure page sets out exactly how to raise it and what happens next.",
  },
  {
    title: "10. Governing law",
    body: "These terms are governed by the law of England and Wales, and any disputes fall under the exclusive jurisdiction of its courts.",
  },
  {
    title: "11. Changes to these terms",
    body: "We may update these terms from time to time without prior notice. Continuing to use the site after a change means you accept the revised terms.",
  },
];

export default function TermsOfUsePage() {
  return (
    <section className="bg-bone-100 py-20">
      <Container className="max-w-3xl">
        <AnimateIn>
          <p className="font-display text-sm uppercase tracking-[0.2em] text-brass-600">
            Terms of use
          </p>
          <h1 className="mt-4 font-display text-4xl text-ink-900">
            How this website may be used
          </h1>
          <p className="mt-5 text-ink-700">
            By using marchbloomlaw.com you agree to the following terms. If
            you don't agree to them, please don't continue using the site.
          </p>
        </AnimateIn>

        <div className="mt-12 space-y-7">
          {sections.map((section, i) => (
            <AnimateIn key={section.title} delay={Math.min(i * 0.03, 0.3)}>
              <h2 className="font-display text-xl text-ink-900">{section.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-700">
                {section.body}
              </p>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn delay={0.3} className="mt-10 rounded-xl2 border border-ink-900/10 bg-bone-50 p-7">
          <h3 className="font-display text-lg text-ink-900">Questions about these terms?</h3>
          <p className="mt-2 text-sm text-ink-700">
            Kiran Odedra, Partner &amp; Principal Solicitor<br />
            {siteConfig.registeredOffice}<br />
            {siteConfig.phoneLandline} · {siteConfig.email}
          </p>
        </AnimateIn>
      </Container>
    </section>
  );
}
