export const siteConfig = {
  name: "March & Bloom Law",
  shortName: "March & Bloom",
  phoneLandline: "020 8255 4186",
  phoneMobile: "078 8955 5265",
  email: "conveyancers@marchbloomlaw.com",
  registeredOffice: "32 Richmond Avenue, London SW20 8LA",
  correspondenceOffice: "30 Durham Road, London SW20 0TW",
  companyNumber: "11155381",
  sraNumber: "646763",
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  { label: "Services", href: "/our-services" },
  { label: "Pricing", href: "/price-transparency" },
  { label: "Contact", href: "/book-a-consultation" },
];

export const footerServiceLinks = [
  { label: "Residential Conveyancing", href: "/our-services" },
  { label: "Commercial Conveyancing", href: "/our-services" },
  { label: "Landlord & Tenant", href: "/our-services" },
];

export const footerUsageLinks = [
  { label: "Price Transparency", href: "/price-transparency" },
  { label: "Complaints Procedure", href: "/complaints-procedure" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

export type ServiceCard = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  points: string[];
};

export const services: ServiceCard[] = [
  {
    slug: "residential",
    title: "Residential Property",
    tagline: "A smoother way to move",
    description:
      "From a first flat to a forever home, we handle the legal side of buying, selling, and remortgaging so you can focus on the move itself.",
    points: ["Purchases & sales", "Remortgages", "New-build & leasehold"],
  },
  {
    slug: "commercial",
    title: "Commercial Property",
    tagline: "Built for serious transactions",
    description:
      "Practical, commercially minded advice for acquiring, disposing of, or leasing business premises — without the legal fog.",
    points: ["Acquisitions & disposals", "Commercial leases", "Portfolio transactions"],
  },
  {
    slug: "landlord-tenant",
    title: "Landlord & Tenant",
    tagline: "Agreements that hold up",
    description:
      "Clear drafting and steady guidance for tenancy agreements, lease renewals, and the disputes that occasionally follow.",
    points: ["Tenancy agreements", "Lease renewals", "Dispute resolution"],
  },
];

export type Differentiator = {
  title: string;
  description: string;
};

export const differentiators: Differentiator[] = [
  {
    title: "Property law, exclusively",
    description:
      "We don't dabble. Every matter we take on sits inside residential, commercial, or leasehold property — so the advice is sharper.",
  },
  {
    title: "Fast, without cutting corners",
    description:
      "We move quickly on the parts that can move quickly, and slow down precisely where care matters most.",
  },
  {
    title: "No jargon, by design",
    description:
      "Every option is explained in plain English first. If a term needs translating, we translate it before you ask.",
  },
  {
    title: "One point of contact",
    description:
      "You deal directly with the solicitor on your file — not a rotating queue of case handlers.",
  },
];

export type FAQItem = {
  question: string;
  answer: string;
};

export const faqs: FAQItem[] = [
  {
    question: "How long does a typical property transaction take?",
    answer:
      "Most freehold transactions complete in around 10–12 weeks, and leasehold transactions in 12–14 weeks. Chains, mortgage offers, and search turnaround times are the biggest variables, and most of those sit outside our control.",
  },
  {
    question: "Do I need a solicitor before making an offer?",
    answer:
      "No — you can make an offer first. But instructing us early means your ID checks, searches, and paperwork are already moving by the time an offer is accepted, which tends to save a week or two later on.",
  },
  {
    question: "What's the difference between freehold and leasehold?",
    answer:
      "Freehold means you own the building and the land beneath it outright. Leasehold means you own the property for a fixed term under a lease, with the land remaining owned by a freeholder — usually alongside ground rent or service charges.",
  },
  {
    question: "Can you act for both the buyer and the seller?",
    answer:
      "No. Acting for both sides in the same transaction is a conflict of interest, so we only ever represent one party — meaning the advice you get is unambiguously in your corner.",
  },
  {
    question: "What documents will I need to provide?",
    answer:
      "Proof of identity and address, details of the property, mortgage offer documents where relevant, and our standard client onboarding forms. We'll send a checklist the moment you instruct us.",
  },
  {
    question: "Do I need a solicitor for a remortgage?",
    answer:
      "Yes. A solicitor still needs to handle the title checks, liaise with your new lender, and register the change at the Land Registry — we run that process quickly and keep you posted at each step.",
  },
];

export type PriceRow = {
  range: string;
  fee: string;
};

export const purchaseFees: PriceRow[] = [
  { range: "£0 – £150,000", fee: "£750" },
  { range: "£150,001 – £300,000", fee: "£850" },
  { range: "£300,001 – £600,000", fee: "£900" },
  { range: "£600,001 – £900,000", fee: "£1,100" },
  { range: "£900,001 – £999,000", fee: "£1,200" },
  { range: "£1,000,000+", fee: "0.15% of purchase price" },
];

export const saleFees: PriceRow[] = [
  { range: "£0 – £150,000", fee: "£700" },
  { range: "£150,001 – £300,000", fee: "£800" },
  { range: "£300,001 – £600,000", fee: "£850" },
  { range: "£600,001 – £900,000", fee: "£1,050" },
  { range: "£900,001 – £999,000", fee: "£1,150" },
  { range: "£1,000,000+", fee: "0.15% of sale price" },
];

export const purchaseExtras: PriceRow[] = [
  { range: "Bank transfer fee", fee: "£36" },
  { range: "Mortgage admin", fee: "£100" },
  { range: "Standard leasehold", fee: "£300" },
  { range: "High-rise leasehold (BSA)", fee: "£350" },
  { range: "Buy to let", fee: "£50" },
  { range: "Gifted deposit", fee: "£150" },
  { range: "Priority service", fee: "£300" },
  { range: "Auction legal pack review", fee: "£450" },
];

export const saleExtras: PriceRow[] = [
  { range: "Bank transfer fee", fee: "£36" },
  { range: "Leasehold fee", fee: "£300" },
  { range: "Mortgage redemption", fee: "£100" },
  { range: "Expedited completion (28 days)", fee: "£250" },
];

export const purchaseDisbursements: PriceRow[] = [
  { range: "ID verification", fee: "£30" },
  { range: "HMLR search", fee: "£3" },
  { range: "Office copies", fee: "£6" },
  { range: "Search pack", fee: "£250" },
  { range: "Land Registry OS1", fee: "£3" },
];

export const saleDisbursements: PriceRow[] = [
  { range: "ID verification", fee: "£30" },
  { range: "Office copies", fee: "£6" },
  { range: "File opening fee", fee: "Up to £150" },
];

export const team = [
  { name: "Kiran Odedra", role: "Partner & Principal Solicitor", rate: "£300/hr", experience: "11 years PQE", location: "Office-based" },
  { name: "Dilshad Begum", role: "Solicitor", rate: "£300/hr", experience: "8 years PQE", location: "Remote" },
  { name: "Anita Chodha", role: "Solicitor", rate: "£200/hr", experience: "7 years PQE", location: "Remote" },
  { name: "Safwaan Al-Khayr", role: "Solicitor", rate: "£160/hr", experience: "1 year PQE", location: "Remote" },
];
