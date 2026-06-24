import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Calendar, Home, KeyRound } from "lucide-react";
import { getLeadById } from "@/lib/leads";
import { DetailedBreakdown, formatGBP } from "@/lib/pricing";
import StatusSelect from "@/components/admin/StatusSelect";
import BloomMark from "@/components/BloomMark";

export const dynamic = "force-dynamic";

const transactionLabels: Record<string, string> = {
  purchase: "Purchase",
  sale: "Sale",
  "sale-purchase": "Sale & Purchase",
  remortgage: "Remortgage",
  "transfer-of-equity": "Transfer of Equity",
};

function leaseholdLabel(isLeasehold: boolean, leaseholdType: string | null) {
  return !isLeasehold
    ? "Freehold"
    : leaseholdType === "high-rise"
      ? "Leasehold — 5+ floors (BSA, £350)"
      : "Leasehold — under 5 floors (£300)";
}

function BreakdownBlock({ title, breakdown }: { title: string; breakdown: DetailedBreakdown }) {
  return (
    <div className="overflow-hidden rounded-lg border border-ink-900/8">
      <div className="bg-ink-900 px-4 py-2.5">
        <h4 className="font-display text-sm text-bone-50">{title}</h4>
      </div>
      <div className="divide-y divide-ink-900/8 bg-bone-100">
        <div className="px-4 py-2">
          <div className="flex justify-between py-1 text-sm"><dt className="text-ink-600">Legal Fees</dt><dd className="font-medium text-ink-900">{formatGBP(breakdown.legalFee)}</dd></div>
          <div className="flex justify-between py-1 text-sm"><dt className="text-ink-600">Legal Fees VAT at 20%</dt><dd className="font-medium text-ink-900">{formatGBP(breakdown.legalFeeVat)}</dd></div>
        </div>
        {breakdown.supplements.length > 0 && (
          <div className="px-4 py-2">
            <p className="pb-1 text-xs font-semibold uppercase tracking-wide text-ink-500">Supplements</p>
            {breakdown.supplements.map((s) => (
              <div key={s.label} className="flex justify-between py-1 text-sm"><dt className="text-ink-600">{s.label}</dt><dd className="font-medium text-ink-900">{formatGBP(s.amount)}</dd></div>
            ))}
            <div className="flex justify-between py-1 text-sm"><dt className="text-ink-600">VAT at 20%</dt><dd className="font-medium text-ink-900">{formatGBP(breakdown.supplementsVat)}</dd></div>
          </div>
        )}
        {breakdown.disbursements.length > 0 && (
          <div className="px-4 py-2">
            <p className="pb-1 text-xs font-semibold uppercase tracking-wide text-ink-500">Disbursements</p>
            {breakdown.disbursements.map((d) => (
              <div key={d.label} className="flex justify-between py-1 text-sm"><dt className="text-ink-600">{d.label}</dt><dd className="font-medium text-ink-900">{formatGBP(d.amount)}</dd></div>
            ))}
          </div>
        )}
        {breakdown.sdltDeferred && (
          <div className="px-4 py-2">
            <div className="flex justify-between py-1 text-sm"><dt className="text-ink-600">Stamp Duty (SDLT)</dt><dd className="font-medium text-ink-900">Deferred</dd></div>
          </div>
        )}
        <div className="flex justify-between bg-ink-900/[0.04] px-4 py-2.5">
          <dt className="font-medium text-ink-900">Total, incl. VAT and disbursements</dt>
          <dd className="font-display text-base font-semibold text-ink-900">{formatGBP(breakdown.subtotal)}</dd>
        </div>
      </div>
    </div>
  );
}

export default async function LeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const lead = await getLeadById(params.id);
  if (!lead) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8">
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900"
        >
          <ArrowLeft size={15} /> Back to all leads
        </Link>
        <BloomMark className="h-6 w-6 text-ink-700" />
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink-900">
            {lead.firstName} {lead.lastName}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
            <Calendar size={14} />
            {new Date(lead.createdAt).toLocaleString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          {lead.intent && (
            <span className="mt-2 inline-block rounded-full bg-brass-500/15 px-3 py-1 text-xs font-medium text-brass-700">
              Wants to:{" "}
              {lead.intent === "proceed"
                ? "Proceed with quote"
                : "Discuss quote"}
            </span>
          )}
        </div>
        <StatusSelect id={params.id} initialStatus={lead.status} />
      </div>

      <section className="mt-8 rounded-xl2 border border-ink-900/10 bg-bone-50 p-6">
        <h2 className="font-display text-lg text-ink-900">Contact details</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-2.5">
            <Mail size={16} className="mt-0.5 shrink-0 text-brass-600" />
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink-500">
                Email
              </dt>
              <dd className="text-sm font-medium text-ink-900">
                <a
                  href={`mailto:${lead.email}`}
                  className="hover:text-brass-600"
                >
                  {lead.email}
                </a>
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Phone size={16} className="mt-0.5 shrink-0 text-brass-600" />
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink-500">
                Phone
              </dt>
              <dd className="text-sm font-medium text-ink-900">
                <a href={`tel:${lead.phone}`} className="hover:text-brass-600">
                  {lead.phone}
                </a>
              </dd>
            </div>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-xl2 border border-ink-900/10 bg-bone-50 p-6">
        <h2 className="font-display text-lg text-ink-900">
          Transaction details
        </h2>
        <div className="mt-4 flex items-start gap-2.5">
          <Home size={16} className="mt-0.5 shrink-0 text-brass-600" />
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-500">
              Type
            </dt>
            <dd className="text-sm font-medium text-ink-900">
              {transactionLabels[lead.transactionType] ?? lead.transactionType}
            </dd>
          </div>
        </div>

        {lead.transactionType === "sale-purchase" ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {lead.saleSection && (
              <div className="rounded-lg border border-ink-900/8 bg-bone-100 p-4">
                <h3 className="font-display text-sm uppercase tracking-wide text-ink-700">
                  Sale
                </h3>
                <dl className="mt-3 space-y-2 text-sm">
                  {lead.saleSection.transactionAddress && (
                    <div>
                      <dt className="text-xs text-ink-500">Address</dt>
                      <dd className="font-medium text-ink-900">
                        {lead.saleSection.transactionAddress}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs text-ink-500">Property Value</dt>
                    <dd className="font-medium text-ink-900">
                      {lead.saleSection.propertyValue
                        ? formatGBP(lead.saleSection.propertyValue)
                        : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-500">Tenure</dt>
                    <dd className="font-medium text-ink-900">
                      {leaseholdLabel(
                        lead.saleSection.isLeasehold,
                        lead.saleSection.leaseholdType
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-500">People Involved</dt>
                    <dd className="font-medium text-ink-900">
                      {lead.saleSection.peopleInvolved}
                    </dd>
                  </div>
                  {lead.saleSection.additionalOptions.length > 0 && (
                    <div>
                      <dt className="text-xs text-ink-500">Options</dt>
                      <dd className="mt-1 flex flex-wrap gap-1">
                        {lead.saleSection.additionalOptions.map((o) => (
                          <span
                            key={o}
                            className="rounded-full bg-ink-900/8 px-2 py-0.5 text-xs text-ink-700"
                          >
                            {o}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
            {lead.purchaseSection && (
              <div className="rounded-lg border border-ink-900/8 bg-bone-100 p-4">
                <h3 className="font-display text-sm uppercase tracking-wide text-ink-700">
                  Purchase
                </h3>
                <dl className="mt-3 space-y-2 text-sm">
                  {lead.purchaseSection.transactionAddress && (
                    <div>
                      <dt className="text-xs text-ink-500">Address</dt>
                      <dd className="font-medium text-ink-900">
                        {lead.purchaseSection.transactionAddress}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs text-ink-500">Property Value</dt>
                    <dd className="font-medium text-ink-900">
                      {lead.purchaseSection.propertyValue
                        ? formatGBP(lead.purchaseSection.propertyValue)
                        : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-500">Tenure</dt>
                    <dd className="font-medium text-ink-900">
                      {leaseholdLabel(
                        lead.purchaseSection.isLeasehold,
                        lead.purchaseSection.leaseholdType
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-500">People Involved</dt>
                    <dd className="font-medium text-ink-900">
                      {lead.purchaseSection.peopleInvolved}
                    </dd>
                  </div>
                  {lead.hasMortgage !== null && (
                    <div>
                      <dt className="text-xs text-ink-500">Mortgage</dt>
                      <dd className="font-medium text-ink-900">
                        {lead.hasMortgage ? "Yes" : "No"}
                      </dd>
                    </div>
                  )}
                  {lead.purchaseSection.additionalOptions.length > 0 && (
                    <div>
                      <dt className="text-xs text-ink-500">Options</dt>
                      <dd className="mt-1 flex flex-wrap gap-1">
                        {lead.purchaseSection.additionalOptions.map((o) => (
                          <span
                            key={o}
                            className="rounded-full bg-ink-900/8 px-2 py-0.5 text-xs text-ink-700"
                          >
                            {o}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        ) : (
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {lead.transactionAddress && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-500">
                  Property Address
                </dt>
                <dd className="text-sm font-medium text-ink-900">
                  {lead.transactionAddress}
                </dd>
              </div>
            )}
            {lead.propertyValue !== null && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-500">
                  Property Value
                </dt>
                <dd className="text-sm font-medium text-ink-900">
                  {formatGBP(lead.propertyValue)}
                </dd>
              </div>
            )}
            {lead.remortgageValue && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-500">
                  Remortgage Value
                </dt>
                <dd className="text-sm font-medium text-ink-900">
                  {formatGBP(lead.remortgageValue)}
                </dd>
              </div>
            )}
            <div className="flex items-start gap-2.5">
              <KeyRound size={16} className="mt-0.5 shrink-0 text-brass-600" />
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-500">
                  Tenure
                </dt>
                <dd className="text-sm font-medium text-ink-900">
                  {leaseholdLabel(lead.isLeasehold, lead.leaseholdType)}
                </dd>
              </div>
            </div>
            {lead.hasMortgage !== null && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-500">
                  Mortgage
                </dt>
                <dd className="text-sm font-medium text-ink-900">
                  {lead.hasMortgage ? "Yes" : "No"}
                </dd>
              </div>
            )}
            {lead.peopleBeingAdded !== null && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-500">
                  People Being Added
                </dt>
                <dd className="text-sm font-medium text-ink-900">
                  {lead.peopleBeingAdded}
                </dd>
              </div>
            )}
            {lead.peopleBeingRemoved !== null && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-500">
                  People Being Removed
                </dt>
                <dd className="text-sm font-medium text-ink-900">
                  {lead.peopleBeingRemoved}
                </dd>
              </div>
            )}
          </dl>
        )}
      </section>

      {(lead.saleBreakdown ||
        lead.purchaseBreakdown ||
        lead.singleBreakdown) && (
        <section className="mt-6 rounded-xl2 border border-ink-900/10 bg-bone-50 p-6">
          <h2 className="font-display text-lg text-ink-900">
            Quotation given to client
          </h2>
          <div className="mt-4 space-y-4">
            {lead.combinedTotal !== null && (
              <div className="rounded-lg bg-ink-900 p-4 text-bone-100">
                <p className="text-xs uppercase tracking-wide text-bone-100/60">
                  Combined total
                </p>
                <p className="font-display text-2xl">
                  {formatGBP(lead.combinedTotal)}
                </p>
              </div>
            )}
            {lead.saleBreakdown && (
              <BreakdownBlock title="Sale" breakdown={lead.saleBreakdown} />
            )}
            {lead.purchaseBreakdown && (
              <BreakdownBlock
                title="Purchase"
                breakdown={lead.purchaseBreakdown}
              />
            )}
            {lead.singleBreakdown && (
              <BreakdownBlock
                title={transactionLabels[lead.transactionType] ?? "Quote"}
                breakdown={lead.singleBreakdown}
              />
            )}
          </div>
        </section>
      )}

      <section className="mt-6 rounded-xl2 border border-ink-900/10 bg-bone-50 p-6">
        <h2 className="font-display text-lg text-ink-900">Message</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-700">
          {lead.message || (
            <span className="text-ink-400">No message left.</span>
          )}
        </p>
      </section>
    </div>
  );
}
