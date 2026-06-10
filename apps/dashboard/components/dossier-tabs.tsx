"use client";

import { useState } from "react";
import { Users, Building2, Send } from "lucide-react";
import type { Customer, DeliveryJob, FiscalYear, Supplier } from "@agec/shared";
import { cn } from "@/lib/utils";
import { ClientsView } from "@/components/clients-view";
import { SuppliersView } from "@/components/suppliers-view";
import { DeliveriesTable } from "@/components/DeliveriesTable";

type TabId = "clients" | "fournisseurs" | "clotures";

interface Props {
  companyId: string;
  customers: Customer[];
  suppliers: Supplier[];
  fiscalYears: FiscalYear[];
  deliveries: DeliveryJob[];
}

export function DossierTabs({
  companyId,
  customers,
  suppliers,
  fiscalYears,
  deliveries,
}: Props) {
  const [tab, setTab] = useState<TabId>("clients");

  const tabs: { id: TabId; label: string; icon: typeof Users; count: number }[] = [
    { id: "clients", label: "Clients", icon: Users, count: customers.length },
    { id: "fournisseurs", label: "Fournisseurs", icon: Building2, count: suppliers.length },
    { id: "clotures", label: "Clôtures", icon: Send, count: fiscalYears.length },
  ];

  return (
    <div>
      <div className="mb-4 inline-flex gap-1 rounded-[14px] bg-card/60 p-1 shadow-[inset_0_0_0_1px_var(--border)]">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "squircle-sm flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium transition-all duration-200",
              tab === t.id
                ? "bg-accent text-white shadow-[var(--shadow-card)]"
                : "text-muted hover:text-foreground",
            )}
          >
            <t.icon className="h-[15px] w-[15px]" />
            {t.label}
            <span
              className={cn(
                "rounded-full px-1.5 text-[11px] font-semibold",
                tab === t.id ? "bg-white/20 text-white" : "bg-foreground/8 text-muted",
              )}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {tab === "clients" && <ClientsView customers={customers} />}
      {tab === "fournisseurs" && <SuppliersView suppliers={suppliers} />}
      {tab === "clotures" && (
        <DeliveriesTable
          companyId={companyId}
          initialFiscalYears={fiscalYears}
          initialDeliveries={deliveries}
        />
      )}
    </div>
  );
}
