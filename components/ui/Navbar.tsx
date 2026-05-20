"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import Button from "./Button";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between sm:h-[4.5rem]">
          <a href="#" className="flex shrink-0 items-center" aria-label="AGEC Finances — Accueil">
            <Image
              src="/images/logo-text-banner.png"
              alt="AGEC Finances — Experts-Comptables"
              width={470}
              height={123}
              sizes="(max-width: 640px) 11rem, 12.5rem"
              quality={85}
              className="h-8 w-auto max-w-[min(100%,11rem)] object-contain object-left sm:h-9 sm:max-w-[12.5rem]"
            />
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="squircle-sm px-4 py-2 text-sm font-medium text-navy/70 transition-colors duration-200 hover:bg-surface-muted hover:text-navy"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button href="#contact" size="sm" className="hidden sm:inline-flex">
              Contactez-nous
            </Button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="squircle-sm p-2 text-navy transition-colors hover:bg-surface-muted lg:hidden"
              aria-expanded={mobileOpen}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`grid overflow-hidden border-t border-border/50 bg-background/90 backdrop-blur-xl transition-[grid-template-rows,opacity] duration-300 ease-out lg:hidden ${
          mobileOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="min-h-0">
          <div className="space-y-1 px-5 py-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="squircle-md block px-4 py-3 font-medium text-navy/80 transition-colors hover:bg-surface-muted hover:text-navy"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4">
              <Button href="#contact" className="w-full" onClick={() => setMobileOpen(false)}>
                Contactez-nous
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
