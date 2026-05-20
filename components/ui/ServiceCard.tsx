"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export default function ServiceCard({ icon: Icon, title, description, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="card-glow group relative bg-white rounded-2xl p-8 border border-gray-100/80 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-500"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-2xl pointer-events-none" />

      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 flex items-center justify-center mb-6 group-hover:from-blue-600 group-hover:to-blue-500 group-hover:scale-110 transition-all duration-500">
        <Icon
          size={26}
          className="text-accent group-hover:text-white transition-colors duration-500"
        />
      </div>
      <h3 className="font-display text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-muted leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}
