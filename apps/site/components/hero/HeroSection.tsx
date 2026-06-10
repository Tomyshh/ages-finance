"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import UnicornHeroBackground from "@/components/hero/UnicornHeroBackground";

const HeroTrustMarquee = dynamic(
  () => import("@/components/hero/HeroTrustMarquee"),
  { ssr: false }
);

export default function HeroSection() {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <UnicornHeroBackground />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/30 to-transparent lg:from-background/82 lg:via-background/8 lg:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent" />
      </div>

      <section
        id="hero"
        className="relative z-10 flex min-h-0 flex-1 flex-col pt-16 sm:pt-[4.5rem]"
      >
        <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-4 sm:px-8 sm:pb-6 lg:px-12 lg:pb-8">
          <div className="hero-fade-in mx-auto max-w-lg text-center lg:ml-0 lg:max-w-xl lg:text-left">
            <Image
              src="/images/logo-text-banner.png"
              alt="AGEC Finances — Experts-Comptables"
              width={470}
              height={123}
              priority
              sizes="(max-width: 1024px) 280px, 300px"
              quality={85}
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
          </div>
        </div>
      </section>

      <HeroTrustMarquee />
    </div>
  );
}
