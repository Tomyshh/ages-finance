"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
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
      <nav className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[4.5rem]">
          <a href="#" className="flex shrink-0 items-center" aria-label="AGEC Finances — Accueil">
            <Image
              src="/images/logo-text-banner.png"
              alt="AGEC Finances — Experts-Comptables"
              width={470}
              height={123}
              priority
              className="h-8 w-auto max-w-[min(100%,11rem)] object-contain object-left sm:h-9 sm:max-w-[12.5rem]"
            />
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 squircle-sm text-sm font-medium text-navy/70 hover:text-navy hover:bg-surface-muted transition-colors duration-200"
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
              className="lg:hidden p-2 squircle-sm text-navy hover:bg-surface-muted transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-border/50 bg-background/90 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-5 py-6 space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 squircle-md text-navy/80 hover:text-navy hover:bg-surface-muted font-medium transition-colors"
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
