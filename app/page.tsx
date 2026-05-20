import { Suspense } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/ui/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import Footer from "@/components/ui/Footer";
import SectionFallback from "@/components/ui/section-fallback";

const AboutSection = dynamic(
  () => import("@/components/sections/AboutSection"),
  { loading: () => <SectionFallback minHeight="20rem" /> }
);

const StrengthsBento = dynamic(
  () => import("@/components/sections/StrengthsBento"),
  { loading: () => <SectionFallback minHeight="28rem" /> }
);

const ContactSection = dynamic(
  () => import("@/components/sections/ContactSection"),
  { loading: () => <SectionFallback minHeight="32rem" /> }
);

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <div className="page-ambient" aria-hidden />

      <div className="relative z-[1]">
        <main>
          <div className="relative h-svh w-full overflow-hidden">
            <Navbar />
            <HeroSection />
          </div>
          <ServicesSection />
          <Suspense fallback={<SectionFallback minHeight="20rem" />}>
            <AboutSection />
          </Suspense>
          <Suspense fallback={<SectionFallback minHeight="28rem" />}>
            <StrengthsBento />
          </Suspense>
          <Suspense fallback={<SectionFallback minHeight="32rem" />}>
            <ContactSection />
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
}
