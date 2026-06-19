import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Calendar, Home, KeyRound } from "lucide-react";
import { getLeadById } from "@/lib/leads";
import StatusSelect from "@/components/admin/StatusSelect";
import BloomMark from "@/components/BloomMark";

export const dynamic = "force-dynamic";

function formatGBP(amount: number | null): string {
  if (amount === null) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}

const transactionLabels: Record<string, string> = {
  purchase: "Buying",
  sale: "Selling",
  remortgage: "Remortgaging",
};

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = await getLeadById(params.id);

  if (!lead) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8">
      <div className="flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900">
          <ArrowLeft size={15} /> Back to all leads
        </Link>
        <div className="flex items-center gap-2 text-ink-900">
          <BloomMark className="h-6 w-6 text-ink-700" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink-900">
            {lead.firstName} {lead.lastName}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
            <Calendar size={14} />
            Submitted{" "}
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
              <dt className="text-xs uppercase tracking-wide text-ink-500">Email</dt>
              <dd className="text-sm font-medium text-ink-900">{lead.email}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Phone size={16} className="mt-0.5 shrink-0 text-brass-600" />
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink-500">Phone</dt>
              <dd className="text-sm font-medium text-ink-900">{lead.phone}</dd>
            </div>
          </div>
        </dl>
      </section>

      {/* Transaction */}
      <section className="mt-6 rounded-xl2 border border-ink-900/10 bg-bone-50 p-6">
        <h2 className="font-display text-lg text-ink-900">Transaction details</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-2.5">
            <Home size={16} className="mt-0.5 shrink-0 text-brass-600" />
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink-500">Type</dt>
              <dd className="text-sm font-medium text-ink-900">
                {transactionLabels[lead.transactionType] ?? lead.transactionType}
              </dd>
            </div>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-500">Property value</dt>
            <dd className="text-sm font-medium text-ink-900">{formatGBP(lead.propertyValue)}</dd>
          </div>
          <div className="flex items-start gap-2.5">
            <KeyRound size={16} className="mt-0.5 shrink-0 text-brass-600" />
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink-500">Tenure</dt>
              <dd className="text-sm font-medium text-ink-900">
                {lead.isLeasehold ? "Leasehold" : "Freehold"}
              </dd>
            </div>
          </div>
        </dl>
      </section>

      {/* Estimate */}
      {lead.estimate && (
        <section className="mt-6 rounded-xl2 border border-ink-900/10 bg-bone-50 p-6">
          <h2 className="font-display text-lg text-ink-900">Quote estimate shown to client</h2>
          <div className="mt-4 space-y-2 text-sm text-ink-700">
            <div className="flex justify-between">
              <span>Legal fee</span>
              <span className="font-medium">{formatGBP(lead.estimate.legalFee)}</span>
            </div>
            {lead.estimate.leaseholdFee > 0 && (
              <div className="flex justify-between">
                <span>Leasehold supplement</span>
                <span className="font-medium">{formatGBP(lead.estimate.leaseholdFee)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated disbursements</span>
              <span className="font-medium">{formatGBP(lead.estimate.disbursementsEstimate)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-ink-900/10 pt-2 text-base">
              <span className="font-medium text-ink-900">Total</span>
              <span className="font-display text-lg text-ink-900">{formatGBP(lead.estimate.total)}</span>
            </div>
          </div>
        </section>
      )}

      {/* Message */}
      <section className="mt-6 rounded-xl2 border border-ink-900/10 bg-bone-50 p-6">
        <h2 className="font-display text-lg text-ink-900">Message</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-700">
          {lead.message || <span className="text-ink-400">No message was left.</span>}
        </p>
      </section>
    </div>
  );
}
