import Link from "next/link";
import { ArrowLeft, Users, Building2, CalendarRange, MailCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DossierTabs } from "@/components/dossier-tabs";
import {
  getDeliveries,
  getDossierCompany,
  getDossierCustomers,
  getDossierFiscalYears,
  getDossierStats,
  getDossierSuppliers,
} from "@/lib/data";

export const dynamic = "force-dynamic";

const iconBox = "squircle-xs flex h-10 w-10 items-center justify-center";

export default async function DossierDetailPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;

  const [
    { company },
    { stats },
    { items: customers },
    { items: suppliers },
    { items: fiscalYears },
    { items: deliveries },
  ] = await Promise.all([
    getDossierCompany(companyId),
    getDossierStats(companyId),
    getDossierCustomers(companyId),
    getDossierSuppliers(companyId),
    getDossierFiscalYears(companyId),
    getDeliveries(companyId),
  ]);

  const cards = [
    { label: "Clients", value: stats?.customers ?? customers.length, icon: Users, color: "bg-accent/8 text-accent" },
    { label: "Fournisseurs", value: stats?.suppliers ?? suppliers.length, icon: Building2, color: "bg-gold/8 text-gold" },
    { label: "Exercices", value: stats?.fiscalYears ?? fiscalYears.length, icon: CalendarRange, color: "bg-navy/8 text-navy" },
    { label: "Clôtures envoyées", value: stats?.deliveriesSent ?? 0, icon: MailCheck, color: "bg-emerald-500/8 text-emerald-600" },
  ];

  return (
    <div>
      <Link
        href="/dossiers"
        className="mb-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Tous les dossiers
      </Link>

      <div className="mb-5">
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
          {company?.name ?? `Dossier ${companyId}`}
        </h1>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          {company?.regNo ? `SIREN ${company.regNo} · ` : ""}
          Données synchronisées depuis Pennylane (Firm API).
        </p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
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
        ))}
      </div>

      <DossierTabs
        companyId={companyId}
        customers={customers}
        suppliers={suppliers}
        fiscalYears={fiscalYears}
        deliveries={deliveries}
      />
    </div>
  );
}
