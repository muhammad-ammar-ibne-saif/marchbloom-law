import { PriceRow } from "@/lib/data";

export default function PricingTable({
  title,
  rows,
  leftLabel = "Property value",
  rightLabel = "Fee (excl. VAT)",
}: {
  title: string;
  rows: PriceRow[];
  leftLabel?: string;
  rightLabel?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl2 border border-ink-900/10 bg-bone-50">
      <div className="border-b border-ink-900/10 bg-ink-900/[0.03] px-6 py-4">
        <h3 className="font-display text-lg text-ink-900">{title}</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-[0.08em] text-ink-500">
            <th className="px-6 py-3 font-medium">{leftLabel}</th>
            <th className="px-6 py-3 font-medium text-right">{rightLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.range}
              className={i % 2 === 0 ? "bg-transparent" : "bg-ink-900/[0.02]"}
            >
              <td className="px-6 py-3.5 text-ink-800">{row.range}</td>
              <td className="px-6 py-3.5 text-right font-medium text-ink-900">
                {row.fee}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
