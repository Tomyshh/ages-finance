"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { STATS } from "@/lib/constants";

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden py-14 sm:py-18">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <span className="mb-5 inline-block text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              À propos
            </span>
            <h2 className="font-display max-w-xl text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-navy sm:text-4xl lg:text-[2.85rem]">
              Un cabinet de taille humaine, à vos côtés.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-[1.75] text-muted sm:text-lg">
              Au Pré-Saint-Gervais, à deux pas de Paris, nous accompagnons les dirigeants
              avec une expertise comptable, fiscale et sociale de proximité — de la création
              à la transmission de votre entreprise.
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted/80">
              Cabinet agréé centre relais, votre interlocuteur unique pour une gestion
              sereine et conforme.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-border/70 pt-10 sm:gap-x-10 sm:gap-y-12 lg:pt-12">
              {STATS.map((stat, i) => (
                <AnimatedCounter
                  key={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  align="left"
                  delay={i * 0.05}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
