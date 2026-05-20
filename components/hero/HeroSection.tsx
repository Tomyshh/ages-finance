"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import UnicornHeroBackground from "@/components/hero/UnicornHeroBackground";

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

export default function HeroSection() {
  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Fond Unicorn — plein écran, bord à bord */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <UnicornHeroBackground />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/30 to-transparent lg:from-background/82 lg:via-background/8 lg:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent" />
      </div>

      {/* Zone contenu (sous la navbar fixe) */}
      <section
        id="hero"
        className="relative z-10 flex min-h-0 flex-1 flex-col pt-16 sm:pt-[4.5rem]"
      >
        <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-4 sm:px-8 sm:pb-6 lg:px-12 lg:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-lg text-center lg:ml-0 lg:max-w-xl lg:text-left"
          >
            <Image
              src="/images/logo-text-banner.png"
              alt="AGEC Finances — Experts-Comptables"
              width={470}
              height={123}
              priority
              className="mx-auto mb-6 h-auto w-auto max-w-[min(100%,280px)] object-contain lg:mx-0 lg:mb-7 lg:max-w-[300px]"
            />
            <h1 className="font-display max-w-2xl text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-navy sm:text-5xl md:text-6xl lg:text-[3.25rem] xl:text-[3.5rem]">
              Nous traduisons vos chiffres en stratégie.
            </h1>
            <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg lg:mt-6">
              Cabinet d&apos;expertise comptable au Pré-Saint-Gervais. Comptabilité,
              fiscalité, social et conseil stratégique pour faire grandir votre
              entreprise.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:mt-9 lg:justify-start">
              <Button href="#contact" size="lg" className="h-12 squircle-pill pl-6 pr-4">
                <span className="text-nowrap">Prendre rendez-vous</span>
                <ChevronRight className="ml-1 size-5" />
              </Button>
              <Button href="#services" variant="ghost" size="lg" className="h-12 squircle-pill px-6">
                <span className="text-nowrap">Nos services</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Banderole — bas du premier écran */}
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
              <ProgressiveBlur
                className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 md:w-16"
                direction="left"
                blurIntensity={1}
              />
              <ProgressiveBlur
                className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 md:w-16"
                direction="right"
                blurIntensity={1}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
