"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { ServiceCard as ServiceCardType } from "@/lib/data";

export default function ServiceCard({
  service,
  index,
}: {
  service: ServiceCardType;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col rounded-xl2 border border-ink-900/8 bg-bone-50 p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
    >
      <span className="font-display text-5xl text-ink-200 transition-colors duration-300 group-hover:text-brass-400">
        0{index + 1}
      </span>
      <h3 className="mt-5 font-display text-2xl text-ink-900">
        {service.title}
      </h3>
      <p className="mt-1 text-sm font-medium uppercase tracking-[0.1em] text-brass-600">
        {service.tagline}
      </p>
      <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
        {service.description}
      </p>
      <ul className="mt-5 space-y-2">
        {service.points.map((point) => (
          <li key={point} className="flex items-center gap-2 text-sm text-ink-700">
            <Check size={15} className="text-ink-400" />
            {point}
          </li>
        ))}
      </ul>
      <Link
        href="/book-a-consultation"
        className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-ink-900 transition-colors hover:text-brass-600"
      >
        Speak to us
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </Link>
    </motion.div>
  );
}
