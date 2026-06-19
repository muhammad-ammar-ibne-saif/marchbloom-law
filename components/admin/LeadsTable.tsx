import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Lead } from "@/lib/leads";
import StatusBadge from "./StatusBadge";

function formatGBP(amount: number | null): string {
  if (amount === null) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}

const transactionLabels: Record<Lead["transactionType"], string> = {
  purchase: "Buying",
  sale: "Selling",
  remortgage: "Remortgaging",
};

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xl2 border border-ink-900/10 bg-bone-50 p-12 text-center text-ink-500">
        No leads match these filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl2 border border-ink-900/10 bg-bone-50">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="border-b border-ink-900/10 bg-ink-900/[0.03] text-left text-xs uppercase tracking-[0.06em] text-ink-500">
            <th className="px-5 py-3 font-medium">Date</th>
            <th className="px-5 py-3 font-medium">Name</th>
            <th className="px-5 py-3 font-medium">Contact</th>
            <th className="px-5 py-3 font-medium">Transaction</th>
            <th className="px-5 py-3 font-medium">Property value</th>
            <th className="px-5 py-3 font-medium">Estimate</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium text-right">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, i) => (
            <tr
              key={lead._id.toString()}
              className={`border-b border-ink-900/5 transition-colors hover:bg-ink-900/[0.025] ${
                i % 2 === 1 ? "bg-ink-900/[0.015]" : ""
              }`}
            >
              <td className="whitespace-nowrap px-5 py-3.5 text-ink-600">
                {new Date(lead.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 font-medium text-ink-900">
                {lead.firstName} {lead.lastName}
              </td>
              <td className="px-5 py-3.5 text-ink-600">
                <div>{lead.email}</div>
                <div className="text-xs text-ink-400">{lead.phone}</div>
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-ink-700">
                {transactionLabels[lead.transactionType]}
                {lead.isLeasehold && (
                  <span className="ml-1.5 text-xs text-ink-400">(Leasehold)</span>
                )}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-ink-700">
                {formatGBP(lead.propertyValue)}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 font-medium text-ink-900">
                {lead.estimate ? formatGBP(lead.estimate.total) : "—"}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5">
                <StatusBadge status={lead.status} />
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-right">
                <Link
                  href={`/admin/leads/${lead._id.toString()}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-ink-700 hover:text-brass-600"
                >
                  Details <ArrowRight size={14} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
