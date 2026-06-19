import { LeadStatus } from "@/lib/leads";

const statusStyles: Record<LeadStatus, string> = {
  new: "bg-brass-500/15 text-brass-700",
  contacted: "bg-ink-400/15 text-ink-700",
  quoted: "bg-clay-400/15 text-clay-500",
  instructed: "bg-ink-600/15 text-ink-700",
  completed: "bg-ink-900/10 text-ink-900",
};

const statusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  instructed: "Instructed",
  completed: "Completed",
};

export default function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
