"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  label: string;
  align?: "left" | "center";
  delay?: number;
}

export default function AnimatedCounter({
  value,
  suffix = "",
  label,
  align = "center",
  delay = 0,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = value / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className={align === "left" ? "text-left" : "text-center"}
    >
      <div className="font-display text-4xl font-semibold tracking-tight text-navy tabular-nums sm:text-5xl">
        <span className="text-accent">{count}</span>
        <span className="text-accent">{suffix}</span>
      </div>
      <div className="mt-1.5 text-sm text-muted">{label}</div>
    </motion.div>
  );
}
