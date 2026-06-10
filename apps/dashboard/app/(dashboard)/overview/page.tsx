import Link from "next/link";
import { FolderOpen, MailCheck, Send, ArrowUpRight, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { initials } from "@/lib/utils";
import { getDossiers, getFirmStats } from "@/lib/data";

export const dynamic = "force-dynamic";

const iconBox = "squircle-xs flex h-10 w-10 items-center justify-center";

export default async function OverviewPage() {
  const [{ stats }, { items: dossiers }] = await Promise.all([
    getFirmStats(),
    getDossiers(),
  ]);

  const cards = [
    {
      label: "Dossiers",
      value: stats?.dossiers ?? dossiers.length,
      icon: FolderOpen,
      href: "/dossiers",
      color: "bg-accent/8 text-accent",
    },
    {
      label: "Clôtures envoyées",
      value: stats?.deliveriesSent ?? 0,
      icon: MailCheck,
      href: "/clotures",
      color: "bg-emerald-500/8 text-emerald-600",
    },
    {
      label: "Clôtures totales",
      value: stats?.deliveriesTotal ?? 0,
      icon: Send,
      href: "/clotures",
      color: "bg-navy/8 text-navy",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Vue d'ensemble"
        description="Portefeuille AGEC Finances : tous les dossiers clients gérés via la Firm API Pennylane."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="group">
            <Card className="transition-shadow duration-200 hover:shadow-[var(--shadow-card)]">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-wider text-muted">
                    {card.label}
                  </p>
                  <p className="font-display mt-1.5 text-2xl font-bold tracking-tight text-foreground">
                    {card.value}
                  </p>
                </div>
                <div className={`${iconBox} ${card.color}`}>
                  <card.icon className="h-[18px] w-[18px]" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Dossiers récents
            <Link
              href="/dossiers"
              className="inline-flex items-center gap-1 text-[12px] font-medium text-accent transition-colors hover:text-accent-light"
            >
              Tous les dossiers <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dossiers.length === 0 ? (
            <p className="text-[13px] text-muted">Aucun dossier renvoyé par Pennylane.</p>
          ) : (
            <ul className="space-y-0">
              {dossiers.slice(0, 8).map((d) => (
                <li key={d.id} className="border-b border-border/40 last:border-0">
                  <Link
                    href={`/dossiers/${d.id}`}
                    className="group flex items-center justify-between gap-3 py-2.5"
                  >
                    <span className="flex items-center gap-3">
                      <span className="squircle-xs flex h-8 w-8 shrink-0 items-center justify-center bg-accent/8 text-[11px] font-semibold text-accent">
                        {initials(d.name) || "?"}
                      </span>
                      <span className="text-[13px] font-semibold text-foreground group-hover:text-accent">
                        {d.name}
                      </span>
                    </span>
                    <span className="flex items-center gap-3 text-[12px] text-muted">
                      {d.city || d.siren || ""}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
