"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}

export default function SectionHeading({
  label,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  return (
    <motion.div
      className={`mb-10 sm:mb-12 ${align === "center" ? "text-center max-w-3xl mx-auto" : "max-w-2xl"}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {label && (
        <span className="inline-flex items-center gap-2 text-accent font-semibold text-xs tracking-[0.25em] uppercase mb-4">
          <span className="w-8 h-px bg-accent/30" />
          {label}
          {align === "center" && <span className="w-8 h-px bg-accent/30" />}
        </span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-[1.12] tracking-tight text-navy">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-lg leading-relaxed text-muted">{description}</p>
      )}
    </motion.div>
  );
}
