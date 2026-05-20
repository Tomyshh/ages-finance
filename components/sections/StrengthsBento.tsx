"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calculator,
  Shield,
  Users,
  FileText,
  Scale,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

export default function StrengthsBento() {
  return (
    <section id="atouts" className="relative py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <SectionHeading
          label="Nos atouts"
          title="Pourquoi choisir AGEC Finances"
          description="Un cabinet de proximité allié à une expertise reconnue : nos forces, vos avantages."
        />

        <div className="relative">
          <div className="relative z-10 grid grid-cols-6 gap-3">
            {/* Carte 1 — Satisfaction */}
            <Card className="relative col-span-full flex overflow-hidden lg:col-span-2 hover:border-blue-200 transition-colors duration-500">
              <CardContent className="relative m-auto size-fit pt-6 pb-8">
                <div className="relative flex h-24 w-56 items-center justify-center">
                  <svg
                    className="text-slate-200 absolute inset-0 size-full"
                    viewBox="0 0 254 104"
                    fill="none"
                  >
                    <path
                      d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="mx-auto block w-fit text-5xl font-semibold text-accent tracking-tight">
                    98%
                  </span>
                </div>
                <h3 className="mt-6 text-center text-xl font-semibold text-navy">
                  Clients satisfaits
                </h3>
                <p className="mt-2 text-center text-sm text-muted max-w-xs mx-auto">
                  Un taux de fidélisation qui reflète notre engagement quotidien.
                </p>
              </CardContent>
            </Card>

            {/* Carte 2 — Sécurité fiscale */}
            <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 hover:border-blue-200 transition-colors duration-500">
              <CardContent className="pt-6">
                <div className="relative mx-auto flex aspect-square size-32 squircle-lg border border-border before:absolute before:-inset-2 before:squircle-lg before:border before:border-slate-100">
                  <Shield className="m-auto size-12 text-blue-400/80" strokeWidth={1} />
                </div>
                <div className="relative z-10 mt-6 space-y-2 text-center">
                  <h3 className="text-lg font-semibold text-navy">Sécurisé par défaut</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Déclarations fiscales, télétransmission et conformité réglementaire
                    pour une gestion sereine.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Carte 3 — Performance */}
            <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 hover:border-blue-200 transition-colors duration-500">
              <CardContent className="pt-6">
                <div className="pt-2 px-2">
                  <svg
                    className="w-full h-24 text-blue-400/60"
                    viewBox="0 0 386 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 60 Q50 55 100 45 T200 25 T386 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M0 60 Q50 55 100 45 T200 25 T386 10 V80 H0 Z"
                      fill="url(#growthFill)"
                      opacity="0.3"
                    />
                    <defs>
                      <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="#3b82f6" stopOpacity="0.5" />
                        <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="relative z-10 mt-8 space-y-2 text-center">
                  <h3 className="text-lg font-semibold text-navy">Croissance pilotée</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Tableaux de bord et indicateurs clés pour orienter vos décisions
                    stratégiques.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Carte 4 — Expertise comptable */}
            <Card className="relative col-span-full overflow-hidden lg:col-span-3 hover:border-blue-200 transition-colors duration-500">
              <CardContent className="grid pt-6 sm:grid-cols-2 gap-6">
                <div className="relative z-10 flex flex-col justify-between space-y-8">
                  <div className="relative flex aspect-square size-12 squircle-sm border border-border items-center justify-center">
                    <Calculator className="size-5 text-blue-400" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-navy">Expertise reconnue</h3>
                    <p className="text-sm text-muted leading-relaxed">
                      Plus de 30 ans d&apos;expérience au service des dirigeants, avec une
                      approche moderne et des outils digitaux performants.
                    </p>
                  </div>
                </div>
                <div className="relative mt-4 squircle-md border border-border/50 bg-white/35 p-4 backdrop-blur-sm sm:ml-2 sm:mt-0">
                  <div className="flex gap-1 mb-3">
                    <span className="block size-2 rounded-full bg-slate-200" />
                    <span className="block size-2 rounded-full bg-slate-200" />
                    <span className="block size-2 rounded-full bg-slate-200" />
                  </div>
                  <svg className="w-full h-28" viewBox="0 0 200 80" preserveAspectRatio="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 70 L20 65 L40 58 L60 50 L80 42 L100 35 L120 28 L140 20 L160 15 L180 10 L200 5 V80 H0 Z"
                      fill="url(#chartArea)"
                    />
                    <path
                      d="M0 70 L20 65 L40 58 L60 50 L80 42 L100 35 L120 28 L140 20 L160 15 L180 10 L200 5"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      fill="none"
                    />
                    <defs>
                      <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="#3b82f6" stopOpacity="0.35" />
                        <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </CardContent>
            </Card>

            {/* Carte 5 — Réseau */}
            <Card className="relative col-span-full overflow-hidden lg:col-span-3 hover:border-blue-200 transition-colors duration-500">
              <CardContent className="grid h-full pt-6 sm:grid-cols-2 gap-6">
                <div className="relative z-10 flex flex-col justify-between space-y-8">
                  <div className="relative flex aspect-square size-12 squircle-sm border border-border items-center justify-center">
                    <Users className="size-6 text-amber-400/90" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-navy">
                      Réseau de partenaires
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      Avocats, notaires, banquiers et conseils en patrimoine pour un
                      accompagnement 360°.
                    </p>
                  </div>
                </div>
                <div className="relative flex flex-col justify-center gap-4 py-4">
                  {[
                    { label: "Juridique", icon: Scale },
                    { label: "Fiscal", icon: FileText },
                    { label: "Social", icon: Users },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex items-center gap-3 ${i % 2 === 0 ? "ml-0" : "ml-8"}`}
                      >
                        <div className="flex size-9 shrink-0 items-center justify-center squircle-sm border border-border/50 bg-white/40">
                          <Icon size={14} className="text-navy/70" />
                        </div>
                        <span className="squircle-pill border border-border/50 bg-white/35 px-3 py-1.5 text-xs text-muted backdrop-blur-sm">
                          {item.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
