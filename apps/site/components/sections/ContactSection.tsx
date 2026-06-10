"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { SITE } from "@/lib/constants";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = () => setSubmitted(true);

  const contactInfo = [
    { icon: MapPin, label: "Adresse", value: SITE.address },
    {
      icon: Phone,
      label: "Téléphone",
      value: SITE.phone,
      href: `tel:${SITE.phone.replace(/\s/g, "")}`,
    },
    { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: Clock, label: "Horaires", value: "Lun–Ven : 9h00 – 18h00" },
  ];

  const inputClass =
    "w-full px-4 py-3.5 squircle-md border border-border/60 bg-white/45 text-navy backdrop-blur-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm";

  return (
    <section id="contact" className="section-below-fold relative py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <SectionHeading
          label="Contact"
          title="Parlons de votre projet"
          description="Prenez rendez-vous pour un premier échange gratuit et sans engagement."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
          <ScrollReveal className="lg:col-span-3">
            {submitted ? (
              <div className="squircle-xl glass-panel p-14 text-center">
                <div className="w-16 h-16 squircle-lg bg-green-50 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="font-display text-2xl font-bold text-navy mb-3">
                  Message envoyé !
                </h3>
                <p className="text-muted">
                  Nous vous recontacterons dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="squircle-xl glass-panel space-y-5 p-8 sm:p-10"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-navy/80 mb-1.5">
                      Nom complet *
                    </label>
                    <input
                      {...register("name", { required: true })}
                      placeholder="Jean Dupont"
                      className={`${inputClass} ${errors.name ? "border-red-400" : ""}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy/80 mb-1.5">
                      Email *
                    </label>
                    <input
                      {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                      type="email"
                      placeholder="jean@exemple.fr"
                      className={`${inputClass} ${errors.email ? "border-red-400" : ""}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-navy/80 mb-1.5">
                      Téléphone
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="01 23 45 67 89"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy/80 mb-1.5">
                      Objet *
                    </label>
                    <select
                      {...register("subject", { required: true })}
                      className={`${inputClass} ${errors.subject ? "border-red-400" : ""}`}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Choisir un objet
                      </option>
                      <option value="comptabilite">Expertise comptable</option>
                      <option value="fiscal">Conseil fiscal</option>
                      <option value="social">Gestion sociale</option>
                      <option value="juridique">Mission juridique</option>
                      <option value="audit">Audit & Transaction</option>
                      <option value="creation">Création d&apos;entreprise</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy/80 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    {...register("message", { required: true })}
                    rows={5}
                    placeholder="Décrivez votre besoin..."
                    className={`${inputClass} resize-none ${errors.message ? "border-red-400" : ""}`}
                  />
                </div>

                <Button type="submit" size="lg">
                  <Send size={18} className="mr-2" />
                  Envoyer le message
                </Button>
              </form>
            )}
          </ScrollReveal>

          <ScrollReveal delayMs={150} className="lg:col-span-2 space-y-6">
            <div className="squircle-xl glass-panel space-y-6 p-8">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <div key={info.label} className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center squircle-sm bg-white/40">
                      <Icon size={18} className="text-accent" />
                    </div>
                    <div>
                      <div className="text-xs text-muted mb-0.5 uppercase tracking-wider">
                        {info.label}
                      </div>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-navy font-medium hover:text-accent transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <div className="text-navy font-medium">{info.value}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="squircle-xl glass-panel h-64 overflow-hidden p-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2623.8!2d2.4045!3d48.884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66d8b8e8e8e8e%3A0x0!2s3+Avenue+Faidherbe%2C+93310+Le+Pr%C3%A9-Saint-Gervais!5e0!3m2!1sfr!2sfr!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation AGEC Finances"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
