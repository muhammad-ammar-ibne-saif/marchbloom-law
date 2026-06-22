"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export default function LeadsFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [transactionType, setTransactionType] = useState(
    searchParams.get("transactionType") || "all"
  );
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") || "");
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") || "");

  function applyFilters(e?: FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (transactionType !== "all")
      params.set("transactionType", transactionType);
    if (status !== "all") params.set("status", status);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    router.push(`/admin?${params.toString()}`);
  }

  function clearFilters() {
    setSearch("");
    setTransactionType("all");
    setStatus("all");
    setDateFrom("");
    setDateTo("");
    router.push("/admin");
  }

  const selectClasses =
    "rounded-lg border border-ink-900/15 bg-bone-50 px-3 py-2.5 text-sm text-ink-900 focus:border-brass-500 focus:outline-none";

  return (
    <form
      onSubmit={applyFilters}
      className="flex flex-wrap items-end gap-3 rounded-xl2 border border-ink-900/10 bg-bone-50 p-4"
    >
      <div className="min-w-[200px] flex-1">
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">
          Search
        </label>
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, email, or phone"
            className="w-full rounded-lg border border-ink-900/15 bg-bone-50 py-2.5 pl-9 pr-3 text-sm text-ink-900 focus:border-brass-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">
          Transaction
        </label>
        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
          className={selectClasses}
        >
          <option value="all">All</option>
          <option value="sale">Sale</option>
          <option value="purchase">Purchase</option>
          <option value="sale-purchase">Sale & Purchase</option>
          <option value="remortgage">Remortgage</option>
          <option value="transfer-of-equity">Transfer of Equity</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={selectClasses}
        >
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="quoted">Quoted</option>
          <option value="instructed">Instructed</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">
          From
        </label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className={selectClasses}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">
          To
        </label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className={selectClasses}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-bone-50 transition-colors hover:bg-ink-800"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={clearFilters}
          className="flex items-center gap-1 rounded-full border border-ink-900/15 px-4 py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-900/5"
        >
          <X size={14} /> Clear
        </button>
      </div>
    </form>
  );
}
