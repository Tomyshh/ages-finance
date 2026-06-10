"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";
import type { DeliveryJob, DeliveryStatus } from "@agec/shared";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<DeliveryStatus, string> = {
  pending: "En file",
  processing: "En cours",
  sent: "Envoyé",
  error: "Erreur",
};

const STATUS_VARIANT: Record<DeliveryStatus, BadgeProps["variant"]> = {
  pending: "warning",
  processing: "info",
  sent: "success",
  error: "destructive",
};

export function DeliveriesHistory({ initial }: { initial: DeliveryJob[] }) {
  const [deliveries, setDeliveries] = useState<DeliveryJob[]>(initial);
  const [query, setQuery] = useState("");

  const refresh = useCallback(async () => {
    const res = await fetch("/api/deliveries", { cache: "no-store" });
    if (res.ok) {
      const body = (await res.json()) as { items: DeliveryJob[] };
      setDeliveries(body.items ?? []);
    }
  }, []);

  const hasActive = deliveries.some(
    (d) => d.status === "pending" || d.status === "processing",
  );

  useEffect(() => {
    if (!hasActive) return;
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [hasActive, refresh]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return deliveries;
    return deliveries.filter((d) =>
      [d.companyName, d.fiscalYearLabel, d.recipient]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [deliveries, query]);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50" />
          <Input
            placeholder="Rechercher une clôture…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <span className="text-[12px] font-medium text-muted">
          {filtered.length} clôture{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dossier</TableHead>
            <TableHead>Exercice</TableHead>
            <TableHead>Destinataire</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-12 text-center text-[13px] text-muted">
                Aucune clôture déclenchée pour le moment.
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium text-foreground">
                  {d.companyId ? (
                    <Link
                      href={`/dossiers/${d.companyId}`}
                      className="hover:text-accent"
                    >
                      {d.companyName ?? d.companyId}
                    </Link>
                  ) : (
                    (d.companyName ?? "—")
                  )}
                </TableCell>
                <TableCell className="text-muted">{d.fiscalYearLabel}</TableCell>
                <TableCell className="text-muted">{d.recipient}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[d.status]}>
                    {STATUS_LABEL[d.status]}
                  </Badge>
                  {d.status === "error" && d.error ? (
                    <div className="mt-1 text-[11px] text-red-500">{d.error}</div>
                  ) : null}
                  {d.status === "sent" && d.downloadUrl ? (
                    <a
                      href={d.downloadUrl}
                      className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent-light"
                    >
                      <ExternalLink className="h-3 w-3" /> Télécharger
                    </a>
                  ) : null}
                </TableCell>
                <TableCell className="text-muted">{formatDate(d.createdAt)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
