import Container from "@/components/Container";
import AnimateIn from "@/components/AnimateIn";
import ContactForm from "@/components/ContactForm";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/data";

export default function ContactPage() {
  return (
    <section className="bg-bone-100 py-20">
      <Container>
        <AnimateIn className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm uppercase tracking-[0.2em] text-brass-600">
            Get in touch
          </p>
          <h1 className="mt-4 font-display text-4xl text-ink-900 sm:text-5xl">
            Have a question? Talk to us.
          </h1>
          <p className="mt-4 text-lg text-ink-700">
            No need for a quote first — if you'd just like to ask something,
            send us a message and we'll get back to you.
          </p>
        </AnimateIn>

        <div className="mx-auto mt-14 grid max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <AnimateIn className="rounded-xl2 border border-ink-900/10 bg-bone-50 p-7 sm:p-9">
            <ContactForm />
          </AnimateIn>

          <AnimateIn delay={0.1} className="space-y-5">
            <div className="rounded-xl2 border border-ink-900/10 bg-bone-50 p-7">
              <h3 className="font-display text-lg text-ink-900">
                Other ways to reach us
              </h3>
              <div className="mt-4 space-y-3 text-sm text-ink-700">
                <a
                  href={`tel:${siteConfig.phoneLandline.replace(/\s/g, "")}`}
                  className="flex items-center gap-2.5 hover:text-ink-900"
                >
                  <Phone size={16} className="text-brass-600" />{" "}
                  {siteConfig.phoneLandline}
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2.5 hover:text-ink-900"
                >
                  <Mail size={16} className="text-brass-600" />{" "}
                  {siteConfig.email}
                </a>
              </div>
            </div>
            <div className="rounded-xl2 border border-ink-900/10 bg-bone-50 p-7">
              <h3 className="font-display text-lg text-ink-900">Our offices</h3>
              <div className="mt-4 space-y-4 text-sm text-ink-700">
                <div className="flex items-start gap-2.5">
                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0 text-brass-600"
                  />
                  <div>
                    <p className="font-medium text-ink-900">
                      Registered office
                    </p>
                    <p>{siteConfig.registeredOffice}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0 text-brass-600"
                  />
                  <div>
                    <p className="font-medium text-ink-900">Correspondence</p>
                    <p>{siteConfig.correspondenceOffice}</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </Container>
    </section>
  );
}
