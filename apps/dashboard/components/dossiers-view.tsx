"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import type { FirmCompany } from "@agec/shared";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { initials } from "@/lib/utils";

export function DossiersView({ dossiers }: { dossiers: FirmCompany[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dossiers;
    return dossiers.filter((d) =>
      [d.name, d.billingName, d.siren, d.city, d.clientCode]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [dossiers, query]);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50" />
          <Input
            placeholder="Rechercher un dossier…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <span className="text-[12px] font-medium text-muted">
          {filtered.length} / {dossiers.length} dossier
          {dossiers.length > 1 ? "s" : ""}
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dossier</TableHead>
            <TableHead>SIREN</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Code client</TableHead>
            <TableHead className="text-right">Ouvrir</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-12 text-center text-[13px] text-muted">
                Aucun dossier trouvé.
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((d) => (
              <TableRow key={d.id} className="group">
                <TableCell>
                  <Link
                    href={`/dossiers/${d.id}`}
                    className="flex items-center gap-3"
                  >
                    <div className="squircle-xs flex h-8 w-8 shrink-0 items-center justify-center bg-accent/8 text-[11px] font-semibold text-accent">
                      {initials(d.name) || "?"}
                    </div>
                    <span className="font-medium text-foreground group-hover:text-accent">
                      {d.name}
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="text-muted">{d.siren ?? "—"}</TableCell>
                <TableCell className="text-muted">{d.city || "—"}</TableCell>
                <TableCell className="text-muted">{d.clientCode ?? "—"}</TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/dossiers/${d.id}`}
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-accent transition-colors hover:text-accent-light"
                  >
                    Voir <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
