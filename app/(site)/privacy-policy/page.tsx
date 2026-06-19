import Container from "@/components/Container";
import AnimateIn from "@/components/AnimateIn";
import { siteConfig } from "@/lib/data";

const sections = [
  {
    title: "What we collect",
    body: "When you contact us or instruct us, we collect details like your name, contact information, and the documents needed to act on a property matter — for example proof of ID, mortgage offers, and property details.",
  },
  {
    title: "Why we collect it",
    body: "To respond to enquiries, carry out the legal work you've instructed us to do, meet our regulatory and anti-money-laundering obligations, and keep you updated on your matter.",
  },
  {
    title: "How long we keep it",
    body: "We retain client files for the period required by SRA regulation and our professional indemnity insurer, typically several years after a matter closes, after which records are securely destroyed.",
  },
  {
    title: "Who we share it with",
    body: "Only where necessary — for example with mortgage lenders, the Land Registry, HMRC, or other solicitors involved in your transaction. We don't sell personal data or share it for marketing purposes.",
  },
  {
    title: "Your rights",
    body: "Under UK GDPR you can ask to see the data we hold about you, ask us to correct it, or in some cases ask us to delete it. Contact us using the details below to make a request.",
  },
  {
    title: "Cookies",
    body: "This site uses a small number of essential cookies to remember preferences and basic, anonymised analytics to understand how the site is used. No personal data is sold to third parties via cookies.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-bone-100 py-20">
      <Container className="max-w-3xl">
        <AnimateIn>
          <p className="font-display text-sm uppercase tracking-[0.2em] text-brass-600">
            Privacy policy
          </p>
          <h1 className="mt-4 font-display text-4xl text-ink-900">
            How we handle your data
          </h1>
          <p className="mt-5 text-ink-700">
            This explains what personal data we collect, why, and what
            rights you have over it, in line with UK GDPR and the Data
            Protection Act 2018.
          </p>
        </AnimateIn>

        <div className="mt-12 space-y-7">
          {sections.map((section, i) => (
            <AnimateIn key={section.title} delay={Math.min(i * 0.04, 0.3)}>
              <h2 className="font-display text-xl text-ink-900">{section.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-700">
                {section.body}
              </p>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn delay={0.3} className="mt-10 rounded-xl2 border border-ink-900/10 bg-bone-50 p-7">
          <h3 className="font-display text-lg text-ink-900">Data protection contact</h3>
          <p className="mt-2 text-sm text-ink-700">
            {siteConfig.registeredOffice}<br />
            {siteConfig.phoneLandline} · {siteConfig.email}
          </p>
          <p className="mt-3 text-xs text-ink-500">
            You can also raise a concern with the Information Commissioner's
            Office (ICO) at ico.org.uk.
          </p>
        </AnimateIn>
      </Container>
    </section>
  );
}
