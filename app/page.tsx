import Navbar from "@/components/ui/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import AboutSection from "@/components/sections/AboutSection";
import StrengthsBento from "@/components/sections/StrengthsBento";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/ui/Footer";

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
          <AboutSection />
          <StrengthsBento />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
