import Image from "next/image";
import CQS from "@/public/badges/CQS-logo.png";
import SRA from "@/public/badges/SRA-logo.png";

const badges = [
  {
    name: "Solicitors Regulation Authority",
    href: "https://www.sra.org.uk/consumers/register/firm/?sraNumber=646763",
    src: SRA,
    alt: "Regulated by the Solicitors Regulation Authority",
  },
  {
    name: "Conveyancing Quality Scheme",
    href: "https://www.lawsociety.org.uk/topics/property/conveyancing-quality-scheme",
    src: CQS,
    alt: "Law Society Conveyancing Quality Scheme accredited",
  },
];

export default function AccreditationBadges({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-6 ${className}`}>
      {badges.map((badge) => (
        <a
          key={badge.name}
          href={badge.href}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-90 transition-opacity hover:opacity-100"
          title={badge.name}
        >
          <Image
            src={badge.src}
            alt={badge.alt}
            width={120}
            height={48}
            className="h-24 w-auto object-contain"
          />
        </a>
      ))}
    </div>
  );
}
