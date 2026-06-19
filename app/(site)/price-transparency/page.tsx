import Container from "@/components/Container";
import AnimateIn from "@/components/AnimateIn";
import PricingTable from "@/components/PricingTable";
import {
  purchaseDisbursements,
  purchaseExtras,
  purchaseFees,
  saleDisbursements,
  saleExtras,
  saleFees,
  team,
} from "@/lib/data";

export default function PriceTransparencyPage() {
  return (
    <>
      <section className="bg-bone-100 pb-14 pt-20 sm:pt-24">
        <Container>
          <AnimateIn>
            <p className="font-display text-sm uppercase tracking-[0.2em] text-brass-600">
              Price transparency
            </p>
            <h1 className="mt-4 max-w-2xl text-balance font-display text-4xl text-ink-900 sm:text-5xl">
              Conveyancing fees, in full
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-ink-700">
              Every fee a typical residential purchase or sale involves —
              no hidden extras, no surprises at completion.
            </p>
          </AnimateIn>
        </Container>
      </section>

      {/* Purchase */}
      <section className="bg-bone-50 py-14">
        <Container>
          <AnimateIn>
            <h2 className="font-display text-2xl text-ink-900">
              Residential purchase
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-ink-600">
              Covers step-by-step guidance, Stamp Duty/LTT advice, property
              searches, contract review, mortgage liaison, and registering
              your ownership at the Land Registry.
            </p>
          </AnimateIn>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <AnimateIn className="lg:col-span-2">
              <PricingTable title="Fee by property value" rows={purchaseFees} />
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <PricingTable title="Supplementary fees" rows={purchaseExtras} leftLabel="Item" rightLabel="Fee" />
            </AnimateIn>
          </div>
          <AnimateIn delay={0.15} className="mt-6">
            <PricingTable
              title="Typical disbursements (incl. VAT)"
              rows={purchaseDisbursements}
              leftLabel="Item"
              rightLabel="Cost"
            />
          </AnimateIn>
        </Container>
      </section>

      {/* Sale */}
      <section className="bg-bone-100 py-14">
        <Container>
          <AnimateIn>
            <h2 className="font-display text-2xl text-ink-900">
              Residential sale
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-ink-600">
              Covers preparing your property information forms, drafting the
              contract pack, liaising with the buyer's solicitor, and
              completing the sale.
            </p>
          </AnimateIn>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <AnimateIn className="lg:col-span-2">
              <PricingTable title="Fee by property value" rows={saleFees} />
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <PricingTable title="Supplementary fees" rows={saleExtras} leftLabel="Item" rightLabel="Fee" />
            </AnimateIn>
          </div>
          <AnimateIn delay={0.15} className="mt-6">
            <PricingTable
              title="Typical disbursements (incl. VAT)"
              rows={saleDisbursements}
              leftLabel="Item"
              rightLabel="Cost"
            />
          </AnimateIn>
        </Container>
      </section>

      {/* Timescales + exclusions */}
      <section className="bg-bone-50 py-14">
        <Container className="grid gap-8 sm:grid-cols-2">
          <AnimateIn className="rounded-xl2 border border-ink-900/10 bg-bone-100 p-7">
            <h3 className="font-display text-lg text-ink-900">
              Estimated timescales
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-ink-700">
              <li>Freehold sale or purchase: 10–12 weeks</li>
              <li>Leasehold transactions: 12–14 weeks</li>
            </ul>
            <p className="mt-3 text-xs text-ink-500">
              Actual timing depends on your chain, lender, and search
              turnaround — these are typical ranges, not guarantees.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.1} className="rounded-xl2 border border-ink-900/10 bg-bone-100 p-7">
            <h3 className="font-display text-lg text-ink-900">
              Not included in our fee
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-ink-700">
              <li>Tax advice (CGT, IHT, income tax)</li>
              <li>Stamp duty minimisation planning</li>
              <li>Property surveys or inspections</li>
              <li>Utility arrangements</li>
              <li>Complex title defect resolution (quoted separately)</li>
            </ul>
          </AnimateIn>
        </Container>
      </section>

      {/* Team rates */}
      <section className="bg-bone-100 py-14">
        <Container>
          <AnimateIn className="text-center">
            <h2 className="font-display text-2xl text-ink-900">
              Team experience &amp; hourly rates
            </h2>
            <p className="mt-2 text-sm text-ink-600">
              For matters billed by the hour rather than fixed fee.
            </p>
          </AnimateIn>
          <div className="mt-10 overflow-hidden rounded-xl2 border border-ink-900/10 bg-bone-50">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink-900/[0.03] text-left text-xs uppercase tracking-[0.08em] text-ink-500">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Experience</th>
                  <th className="px-6 py-3 font-medium">Location</th>
                  <th className="px-6 py-3 text-right font-medium">Rate</th>
                </tr>
              </thead>
              <tbody>
                {team.map((member, i) => (
                  <tr key={member.name} className={i % 2 === 1 ? "bg-ink-900/[0.02]" : ""}>
                    <td className="px-6 py-3.5 font-medium text-ink-900">{member.name}</td>
                    <td className="px-6 py-3.5 text-ink-700">{member.experience}</td>
                    <td className="px-6 py-3.5 text-ink-700">{member.location}</td>
                    <td className="px-6 py-3.5 text-right text-ink-900">{member.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>
    </>
  );
}
