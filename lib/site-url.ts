/** URL publique du site (partage réseaux sociaux, Open Graph). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://agec-finances.web.app";

export const OG_IMAGE = {
  path: "/images/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "AGEC Finances — Experts-Comptables",
} as const;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
