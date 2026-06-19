import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { listLeads } from "@/lib/leads";
import LeadsFilterBar from "@/components/admin/LeadsFilterBar";
import LeadsTable from "@/components/admin/LeadsTable";
import LogoutButton from "@/components/admin/LogoutButton";
import BloomMark from "@/components/BloomMark";

export const dynamic = "force-dynamic";

type SearchParams = {
  search?: string;
  transactionType?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: string;
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Number(searchParams.page) || 1;
  const { leads, total, totalPages } = await listLeads({
    search: searchParams.search,
    transactionType: searchParams.transactionType,
    status: searchParams.status,
    dateFrom: searchParams.dateFrom,
    dateTo: searchParams.dateTo,
    page,
  });

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (searchParams.search) params.set("search", searchParams.search);
    if (searchParams.transactionType) params.set("transactionType", searchParams.transactionType);
    if (searchParams.status) params.set("status", searchParams.status);
    if (searchParams.dateFrom) params.set("dateFrom", searchParams.dateFrom);
    if (searchParams.dateTo) params.set("dateTo", searchParams.dateTo);
    params.set("page", String(targetPage));
    return `/admin?${params.toString()}`;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-ink-900">
          <BloomMark className="h-7 w-7 text-ink-700" />
          <div>
            <h1 className="font-display text-2xl">Leads</h1>
            <p className="text-sm text-ink-500">{total} total enquiries</p>
          </div>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-8">
        <LeadsFilterBar />
      </div>

      <div className="mt-6">
        <LeadsTable leads={leads} />
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href={pageHref(Math.max(page - 1, 1))}
            className={`flex items-center gap-1 rounded-full border border-ink-900/15 px-4 py-2 text-sm font-medium ${
              page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-ink-900/5"
            }`}
          >
            <ChevronLeft size={14} /> Previous
          </Link>
          <span className="text-sm text-ink-500">
            Page {page} of {totalPages}
          </span>
          <Link
            href={pageHref(Math.min(page + 1, totalPages))}
            className={`flex items-center gap-1 rounded-full border border-ink-900/15 px-4 py-2 text-sm font-medium ${
              page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-ink-900/5"
            }`}
          >
            Next <ChevronRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
