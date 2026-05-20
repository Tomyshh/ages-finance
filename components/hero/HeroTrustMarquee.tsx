"use client";

import { InfiniteSlider } from "@/components/ui/infinite-slider";

const TRUST_ITEMS = [
  "Experts-Comptables",
  "Ordre de Paris",
  "Télétransmission",
  "Conseil fiscal",
  "Gestion sociale",
  "Audit & due diligence",
  "Création d'entreprise",
  "Accompagnement PME",
];

export default function HeroTrustMarquee() {
  return (
    <section
      aria-label="Points forts du cabinet"
      className="relative z-20 shrink-0 border-t border-border/50 bg-background/55 backdrop-blur-md"
    >
      <div className="relative m-auto max-w-7xl px-5 sm:px-8">
        <div className="flex min-h-[3.25rem] flex-col items-center md:min-h-[3.5rem] md:flex-row">
          <div className="flex shrink-0 items-center py-2.5 md:max-w-44 md:border-r md:border-border/80 md:py-3 md:pr-5">
            <p className="w-full text-center text-sm font-medium text-muted md:text-end">
              Un cabinet de confiance
            </p>
          </div>
          <div className="relative flex w-full flex-1 items-center py-2.5 md:py-3 md:pl-2">
            <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
              {TRUST_ITEMS.map((item) => (
                <div key={item} className="flex items-center">
                  <span className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.12em] text-muted">
                    {item}
                  </span>
                </div>
              ))}
            </InfiniteSlider>

            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background/70 md:w-16" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background/70 md:w-16" />
          </div>
        </div>
      </div>
    </section>
  );
}
