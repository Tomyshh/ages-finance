"use client";

import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { STATS } from "@/lib/constants";

export default function AboutStats() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-border/70 pt-10 sm:gap-x-10 sm:gap-y-12 lg:pt-12">
      {STATS.map((stat, i) => (
        <AnimatedCounter
          key={stat.label}
          value={stat.value}
          suffix={stat.suffix}
          label={stat.label}
          align="left"
          delay={i * 0.05}
        />
      ))}
    </div>
  );
}
