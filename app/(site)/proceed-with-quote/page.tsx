import Container from "@/components/Container";
import ProceedWithQuoteForm from "@/components/ProceedWithQuoteForm";

type SearchParams = {
  leadId?: string;
  type?: string;
  address?: string;
  value?: string;
  leasehold?: string;
  hasMortgage?: string;
  includeSearchPack?: string;
  giftedDepositCount?: string;
  htbIsaCount?: string;
  lifetimeIsaCount?: string;
  options?: string;
};

export default function ProceedWithQuotePage({ searchParams }: { searchParams: SearchParams }) {
  const quoteData = {
    leadId: searchParams.leadId ?? null,
    transactionType: searchParams.type ?? "",
    transactionAddress: searchParams.address ? decodeURIComponent(searchParams.address) : "",
    transactionValue: searchParams.value ? Number(searchParams.value) : null,
    isLeasehold: searchParams.leasehold === "true",
    hasMortgage: searchParams.hasMortgage !== "false",
    includeSearchPack: searchParams.includeSearchPack !== "false",
    giftedDepositCount: searchParams.giftedDepositCount ? Number(searchParams.giftedDepositCount) : 0,
    htbIsaCount: searchParams.htbIsaCount ? Number(searchParams.htbIsaCount) : 0,
    lifetimeIsaCount: searchParams.lifetimeIsaCount ? Number(searchParams.lifetimeIsaCount) : 0,
    selectedOptions: searchParams.options
      ? decodeURIComponent(searchParams.options).split(",").filter(Boolean)
      : [],
  };

  return (
    <section className="bg-bone-100 py-16">
      <Container className="max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl text-ink-900 sm:text-4xl">
            To proceed with your quote
          </h1>
          <p className="mt-2 text-ink-600">fill out the form below.</p>
        </div>
        <div className="rounded-xl2 border border-ink-900/10 bg-bone-50 p-6 sm:p-8">
          <ProceedWithQuoteForm quoteData={quoteData} />
        </div>
      </Container>
    </section>
  );
}