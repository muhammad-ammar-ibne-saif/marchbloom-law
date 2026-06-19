"use client";

import { useState, useTransition } from "react";
import { updateLeadStatusAction } from "@/lib/actions";
import { LeadStatus } from "@/lib/leads";

const options: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "instructed", label: "Instructed" },
  { value: "completed", label: "Completed" },
];

export default function StatusSelect({
  id,
  initialStatus,
}: {
  id: string;
  initialStatus: LeadStatus;
}) {
  const [status, setStatus] = useState<LeadStatus>(initialStatus);
  const [pending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as LeadStatus;
    setStatus(next);
    startTransition(async () => {
      await updateLeadStatusAction(id, next);
    });
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={pending}
      className="rounded-full border border-ink-900/15 bg-bone-50 px-4 py-2 text-sm font-medium text-ink-900 transition-opacity focus:border-brass-500 focus:outline-none disabled:opacity-60"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
