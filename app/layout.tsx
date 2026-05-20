import type { Metadata } from "next";
import { Inter } from "next/font/google";
import FirebaseAnalytics from "@/components/analytics/FirebaseAnalytics";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "AGEC Finances — Cabinet d'Experts-Comptables",
  description:
    "AGEC Finances, cabinet d'expertise comptable à Le Pré-Saint-Gervais près de Paris. Comptabilité, conseil fiscal, social, juridique et accompagnement stratégique.",
  keywords: [
    "expert-comptable",
    "cabinet comptable",
    "Le Pré-Saint-Gervais",
    "Paris",
    "comptabilité",
    "fiscalité",
    "paie",
    "audit",
    "conseil",
  ],
  authors: [{ name: "AGEC Finances" }],
  openGraph: {
    title: "AGEC Finances — Cabinet d'Experts-Comptables",
    description:
      "Nous traduisons vos chiffres en stratégie. Cabinet d'expertise comptable à proximité de Paris.",
    url: "https://agecfinances.com",
    siteName: "AGEC Finances",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AGEC Finances — Cabinet d'Experts-Comptables",
    description:
      "Nous traduisons vos chiffres en stratégie. Cabinet d'expertise comptable à proximité de Paris.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    shortcut: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AccountingService",
  name: "AGEC Finances",
  description:
    "Cabinet d'expertise comptable situé au Pré-Saint-Gervais, à proximité de Paris.",
  url: "https://agecfinances.com",
  telephone: "+33143605000",
  email: "contact@agecfinances.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "3 Avenue Faidherbe",
    addressLocality: "Le Pré-Saint-Gervais",
    postalCode: "93310",
    addressCountry: "FR",
  },
  priceRange: "$$",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} antialiased`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        {children}
        <FirebaseAnalytics />
      </body>
    </html>
  );
}
