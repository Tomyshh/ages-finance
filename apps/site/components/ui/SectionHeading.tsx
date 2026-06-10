import ScrollReveal from "@/components/ui/scroll-reveal";

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
    <ScrollReveal
      className={`mb-10 sm:mb-12 ${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}`}
    >
      {label && (
        <span className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          <span className="h-px w-8 bg-accent/30" />
          {label}
          {align === "center" && <span className="h-px w-8 bg-accent/30" />}
        </span>
      )}
      <h2 className="font-display text-3xl font-semibold leading-[1.12] tracking-tight text-navy sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-lg leading-relaxed text-muted">{description}</p>
      )}
    </ScrollReveal>
  );
}
