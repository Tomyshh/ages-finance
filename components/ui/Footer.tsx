"use client";

import { MapPin, Phone, Mail } from "lucide-react";
import { SITE, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/50 bg-transparent text-foreground">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <div className="grid grid-cols-1 gap-10 py-12 md:grid-cols-2 lg:grid-cols-4 md:gap-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 squircle-md bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center font-bold text-sm text-white">
                AG
              </div>
              <div>
                <span className="font-bold text-base block text-navy">AGEC Finances</span>
                <span className="text-[10px] tracking-widest uppercase text-muted">
                  Experts-Comptables
                </span>
              </div>
            </div>
            <p className="text-muted text-sm leading-relaxed">
              Cabinet inscrit au Tableau de l&apos;Ordre des Experts-Comptables de Paris.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xs uppercase tracking-[0.2em] text-muted mb-5">
              Navigation
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-navy/70 hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-xs uppercase tracking-[0.2em] text-muted mb-5">
              Services
            </h3>
            <ul className="space-y-3 text-sm text-navy/70">
              <li>Expertise comptable</li>
              <li>Conseil fiscal</li>
              <li>Gestion sociale</li>
              <li>Audit & Transaction</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-xs uppercase tracking-[0.2em] text-muted mb-5">
              Contact
            </h3>
            <ul className="space-y-4 text-sm text-navy/70">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-accent mt-0.5 shrink-0" />
                {SITE.address}
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-accent shrink-0" />
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="hover:text-accent transition-colors"
                >
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-accent shrink-0" />
                <a href={`mailto:${SITE.email}`} className="hover:text-accent transition-colors">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <p>&copy; {new Date().getFullYear()} AGEC Finances. Tous droits réservés.</p>
          <p>Ordre des Experts-Comptables de Paris</p>
        </div>
      </div>
    </footer>
  );
}
