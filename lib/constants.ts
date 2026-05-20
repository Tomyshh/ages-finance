import {
  Calculator,
  Users,
  Scale,
  FileText,
  Monitor,
  Search,
  Headphones,
  MessageSquare,
  Clock,
  Zap,
} from "lucide-react";

export const SITE = {
  name: "AGEC Finances",
  tagline: "Cabinet d'Experts-Comptables",
  description:
    "AGEC Finances, cabinet d'expertise comptable à Le Pré-Saint-Gervais. Comptabilité, conseil fiscal, social, juridique et accompagnement stratégique pour votre entreprise.",
  address: "3 Avenue Faidherbe, 93310 Le Pré-Saint-Gervais",
  phone: "01 43 60 50 00",
  email: "contact@agecfinances.com",
  url: "https://agecfinances.com",
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2623.5!2d2.4045!3d48.884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z3+Avenue+Faidherbe+93310+Le+Pr%C3%A9-Saint-Gervais!5e0!3m2!1sfr!2sfr!4v1",
};

export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "À propos", href: "#about" },
  { label: "Nos atouts", href: "#atouts" },
  { label: "Contact", href: "#contact" },
];

export const SERVICES = [
  {
    icon: Calculator,
    title: "Missions Comptables",
    description:
      "Tenue et révision comptable, établissement des comptes annuels, situations intermédiaires et tableaux de bord pour piloter votre activité.",
  },
  {
    icon: Users,
    title: "Missions Sociales",
    description:
      "Gestion de la paie, déclarations sociales, contrats de travail, conseil en droit social et optimisation des charges patronales.",
  },
  {
    icon: Scale,
    title: "Missions Juridiques",
    description:
      "Création, transformation et dissolution de sociétés, rédaction d'actes juridiques, assemblées générales et secrétariat juridique.",
  },
  {
    icon: FileText,
    title: "Missions Fiscales",
    description:
      "Déclarations fiscales, optimisation de l'impôt, conseil en stratégie fiscale, assistance lors de contrôles et contentieux fiscaux.",
  },
  {
    icon: Monitor,
    title: "Missions Informatiques",
    description:
      "Mise en place de logiciels comptables, dématérialisation des documents, télétransmission des données fiscales et comptables.",
  },
  {
    icon: Search,
    title: "Audit & Transaction Services",
    description:
      "Audit légal et contractuel, due diligence, évaluation d'entreprises, accompagnement dans les opérations de cession et d'acquisition.",
  },
];

export const STATS = [
  { value: 30, suffix: "+", label: "Années d'expérience" },
  { value: 500, suffix: "+", label: "Clients accompagnés" },
  { value: 15, suffix: "", label: "Collaborateurs" },
  { value: 98, suffix: "%", label: "Clients satisfaits" },
];

export const STRENGTHS = [
  {
    icon: Headphones,
    title: "Écoute",
    description:
      "Nous prenons le temps de comprendre votre activité, vos enjeux et vos objectifs pour proposer des solutions sur-mesure.",
  },
  {
    icon: MessageSquare,
    title: "Conseil",
    description:
      "Un accompagnement stratégique pour chaque décision importante : création, investissement, transmission ou optimisation.",
  },
  {
    icon: Clock,
    title: "Disponibilité",
    description:
      "Une équipe réactive et accessible, toujours prête à répondre à vos questions et à vous accompagner au quotidien.",
  },
  {
    icon: Zap,
    title: "Réactivité",
    description:
      "Des délais de réponse courts et une capacité d'adaptation rapide face aux évolutions réglementaires et fiscales.",
  },
];

export const PARTNERS = [
  "Avocats",
  "Juristes",
  "Notaires",
  "Banquiers",
  "Conseils en patrimoine",
  "Spécialistes en défiscalisation",
];
