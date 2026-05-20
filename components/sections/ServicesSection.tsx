"use client";

import { Features4 } from "@/components/ui/features-4";
import { SERVICES } from "@/lib/constants";

export default function ServicesSection() {
  return (
    <section id="services" className="relative py-16 sm:py-20">
      <Features4
        label="Nos services"
        title="Une expertise complète à votre service"
        description="De la comptabilité au conseil stratégique, nous vous accompagnons à chaque étape de la vie de votre entreprise."
        items={SERVICES}
      />
    </section>
  );
}
