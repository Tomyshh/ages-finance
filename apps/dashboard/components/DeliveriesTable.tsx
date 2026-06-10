"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Send, RotateCw, ExternalLink, Download } from "lucide-react";
import type { DeliveryJob, DeliveryStatus, FiscalYear } from "@agec/shared";
import { Card } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  companyId: string;
  initialFiscalYears: FiscalYear[];
  initialDeliveries: DeliveryJob[];
}

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

export function DeliveriesTable({
  companyId,
  initialFiscalYears,
  initialDeliveries,
}: Props) {
  const [deliveries, setDeliveries] = useState<DeliveryJob[]>(initialDeliveries);
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});

  const latestByLabel = useMemo(() => {
    const map = new Map<string, DeliveryJob>();
    for (const job of deliveries) {
      const existing = map.get(job.fiscalYearLabel);
      if (!existing || job.createdAt > existing.createdAt) {
        map.set(job.fiscalYearLabel, job);
      }
    }
    return map;
  }, [deliveries]);

  const refresh = useCallback(async () => {
    const res = await fetch(`/api/deliveries?companyId=${encodeURIComponent(companyId)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const body = (await res.json()) as { items: DeliveryJob[] };
      setDeliveries(body.items ?? []);
    }
  }, [companyId]);

  const hasActive = deliveries.some(
    (d) => d.status === "pending" || d.status === "processing",
  );

  useEffect(() => {
    if (!hasActive) return;
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [hasActive, refresh]);

  const trigger = useCallback(
    async (fy: FiscalYear) => {
      setBusy((b) => ({ ...b, [fy.label]: true }));
      try {
        const res = await fetch("/api/deliveries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyId, fiscalYearId: fy.id }),
        });
        if (res.ok) {
          const body = (await res.json()) as { job: DeliveryJob };
          setDeliveries((prev) => [body.job, ...prev]);
        }
      } finally {
        setBusy((b) => ({ ...b, [fy.label]: false }));
      }
    },
    [companyId],
  );

  const download = useCallback(
    async (fy: FiscalYear) => {
      setDownloading((d) => ({ ...d, [fy.label]: true }));
      try {
        const res = await fetch(
          `/api/dossiers/${encodeURIComponent(companyId)}/cloture?fiscalYearId=${encodeURIComponent(
            fy.id,
          )}`,
          { cache: "no-store" },
        );
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { error?: string } | null;
          alert(`Échec du téléchargement : ${body?.error ?? res.status}`);
          return;
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cloture_${fy.label}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (err) {
        alert(`Échec du téléchargement : ${err instanceof Error ? err.message : err}`);
      } finally {
        setDownloading((d) => ({ ...d, [fy.label]: false }));
      }
    },
    [companyId],
  );

  if (initialFiscalYears.length === 0) {
    return (
      <Card className="py-12 text-center text-[13px] text-muted">
        Aucun exercice fiscal renvoyé par Pennylane.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Exercice</TableHead>
            <TableHead>Période</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialFiscalYears.map((fy) => {
            const job = latestByLabel.get(fy.label);
            const isBusy =
              busy[fy.label] ||
              job?.status === "pending" ||
              job?.status === "processing";
            const sent = job?.status === "sent";
            const isDownloading = downloading[fy.label] ?? false;

            return (
              <TableRow key={fy.id}>
                <TableCell className="font-semibold text-foreground">
                  {fy.label}
                </TableCell>
                <TableCell className="text-muted">
                  {fy.start} → {fy.end}
                </TableCell>
                <TableCell>
                  {job ? (
                    <Badge variant={STATUS_VARIANT[job.status]}>
                      {STATUS_LABEL[job.status]}
                    </Badge>
                  ) : (
                    <span className="text-muted/60">—</span>
                  )}
                  {job?.status === "error" && job.error ? (
                    <div className="mt-1 text-[11px] text-red-500">{job.error}</div>
                  ) : null}
                  {job?.status === "sent" && job.downloadUrl ? (
                    <a
                      href={job.downloadUrl}
                      className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent-light"
                    >
                      <ExternalLink className="h-3 w-3" /> Télécharger
                    </a>
                  ) : null}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isDownloading}
                      onClick={() => download(fy)}
                    >
                      {isDownloading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Download className="h-3.5 w-3.5" />
                      )}
                      {isDownloading ? "Préparation…" : "Télécharger"}
                    </Button>
                    <Button
                      size="sm"
                      variant={sent ? "outline" : "default"}
                      disabled={isBusy}
                      onClick={() => trigger(fy)}
                    >
                      {isBusy ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : sent ? (
                        <RotateCw className="h-3.5 w-3.5" />
                      ) : (
                        <Send className="h-3.5 w-3.5" />
                      )}
                      {isBusy ? "Envoi…" : sent ? "Renvoyer" : "Envoyer"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
