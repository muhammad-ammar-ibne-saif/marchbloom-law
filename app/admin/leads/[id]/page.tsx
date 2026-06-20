import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Calendar, Home, KeyRound } from "lucide-react";
import { getLeadById } from "@/lib/leads";
import StatusSelect from "@/components/admin/StatusSelect";
import BloomMark from "@/components/BloomMark";

export const dynamic = "force-dynamic";

function formatGBP(amount: number | null): string {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}

const transactionLabels: Record<string, string> = {
  purchase: "Purchase",
  sale: "Sale",
  "sale-purchase": "Sale & Purchase",
  remortgage: "Remortgage",
  "transfer-of-equity": "Transfer of Equity",
};

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
        </div>
        <StatusSelect id={params.id} initialStatus={lead.status} />
      </div>

      {/* Contact */}
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

      {/* Transaction */}
      <section className="mt-6 rounded-xl2 border border-ink-900/10 bg-bone-50 p-6">
        <h2 className="font-display text-lg text-ink-900">
          Transaction details
        </h2>

        {/* Top-level type */}
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

        {/* Sale & Purchase: show each section separately */}
        {lead.transactionType === "sale-purchase" && (
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {/* Sale section */}
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
                      {formatGBP(lead.saleSection.propertyValue)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-500">Tenure</dt>
                    <dd className="font-medium text-ink-900">
                      {!lead.saleSection.isLeasehold
                        ? "Freehold"
                        : lead.saleSection.leaseholdType === "high-rise"
                          ? "Leasehold — 5+ floors (BSA, £350)"
                          : "Leasehold — under 5 floors (£300)"}
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
                        {lead.saleSection.additionalOptions.map((opt) => (
                          <span
                            key={opt}
                            className="rounded-full bg-ink-900/8 px-2 py-0.5 text-xs text-ink-700"
                          >
                            {opt}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Purchase section */}
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
                      {formatGBP(lead.purchaseSection.propertyValue)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-500">Tenure</dt>
                    <dd className="font-medium text-ink-900">
                      {!lead.purchaseSection.isLeasehold
                        ? "Freehold"
                        : lead.purchaseSection.leaseholdType === "high-rise"
                          ? "Leasehold — 5+ floors (BSA, £350)"
                          : "Leasehold — under 5 floors (£300)"}
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
                        {lead.purchaseSection.additionalOptions.map((opt) => (
                          <span
                            key={opt}
                            className="rounded-full bg-ink-900/8 px-2 py-0.5 text-xs text-ink-700"
                          >
                            {opt}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        )}

        {/* All other types: show flat fields as before */}
        {lead.transactionType !== "sale-purchase" && (
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
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink-500">
                Property Value
              </dt>
              <dd className="text-sm font-medium text-ink-900">
                {formatGBP(lead.propertyValue)}
              </dd>
            </div>
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
            <div className="flex items-start gap-2.5 ">
              <KeyRound size={16} className="mt-0.5 shrink-0 text-brass-600" />
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-500">
                  Tenure
                </dt>
                <dd className="text-sm font-medium text-ink-900">
                  {!lead.isLeasehold
                    ? "Freehold"
                    : lead.leaseholdType === "high-rise"
                      ? "Leasehold — 5+ floors (BSA high-rise, £350)"
                      : "Leasehold — less than 5 floors (£300)"}
                </dd>
              </div>
            </div>
            {lead.hasMortgage !== null && lead.hasMortgage !== undefined && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-500">
                  Mortgage
                </dt>
                <dd className="text-sm font-medium text-ink-900">
                  {lead.hasMortgage ? "Yes" : "No"}
                </dd>
              </div>
            )}
            {lead.peopleInvolved > 0 && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-500">
                  People Involved
                </dt>
                <dd className="text-sm font-medium text-ink-900">
                  {lead.peopleInvolved}
                </dd>
              </div>
            )}
            {lead.peopleBeingAdded !== null &&
              lead.peopleBeingAdded !== undefined && (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-ink-500">
                    People Being Added
                  </dt>
                  <dd className="text-sm font-medium text-ink-900">
                    {lead.peopleBeingAdded}
                  </dd>
                </div>
              )}
            {lead.peopleBeingRemoved !== null &&
              lead.peopleBeingRemoved !== undefined && (
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

        {/* Additional options for non sale-purchase types */}
        {lead.transactionType !== "sale-purchase" &&
          lead.additionalOptions?.length > 0 && (
            <div className="mt-4 border-t border-ink-900/10 pt-4">
              <dt className="text-xs uppercase tracking-wide text-ink-500">
                Additional Options Selected
              </dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {lead.additionalOptions.map((opt) => (
                  <span
                    key={opt}
                    className="rounded-full bg-ink-900/8 px-3 py-1 text-xs font-medium text-ink-700"
                  >
                    {opt}
                  </span>
                ))}
              </dd>
            </div>
          )}
      </section>

      {/* Estimate */}
      {lead.estimate && (
        <section className="mt-6 rounded-xl2 border border-ink-900/10 bg-bone-50 p-6">
          <h2 className="font-display text-lg text-ink-900">
            Estimate shown to client
          </h2>
          <div className="mt-4 space-y-2 text-sm text-ink-700">
            <div className="flex justify-between">
              <span>Legal fee</span>
              <span className="font-medium">
                {formatGBP(lead.estimate.legalFee)}
              </span>
            </div>
            {lead.estimate.leaseholdFee > 0 && (
              <div className="flex justify-between">
                <span>Leasehold supplement</span>
                <span className="font-medium">
                  {formatGBP(lead.estimate.leaseholdFee)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated disbursements</span>
              <span className="font-medium">
                {formatGBP(lead.estimate.disbursementsEstimate)}
              </span>
            </div>
            <div className="flex justify-between border-t border-ink-900/10 pt-2 text-base">
              <span className="font-medium text-ink-900">Total</span>
              <span className="font-display text-lg text-ink-900">
                {formatGBP(lead.estimate.total)}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Message */}
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
