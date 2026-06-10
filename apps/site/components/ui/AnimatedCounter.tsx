"use client";

import { useEffect, useRef, useState } from "react";

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
  const [isInView, setIsInView] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-60px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
    <div
      ref={ref}
      className={`scroll-reveal ${isInView ? "scroll-reveal-visible" : ""} ${align === "left" ? "text-left" : "text-center"}`}
      style={delay ? { transitionDelay: `${delay * 1000}ms` } : undefined}
    >
      <div className="font-display text-4xl font-semibold tracking-tight text-navy tabular-nums sm:text-5xl">
        <span className="text-accent">{count}</span>
        <span className="text-accent">{suffix}</span>
      </div>
      <div className="mt-1.5 text-sm text-muted">{label}</div>
    </div>
  );
}
