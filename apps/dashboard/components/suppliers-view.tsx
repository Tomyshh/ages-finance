"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Supplier } from "@agec/shared";
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
import { formatDate, initials } from "@/lib/utils";

export function SuppliersView({ suppliers }: { suppliers: Supplier[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter((s) =>
      [s.name, s.email, s.regNo, s.vatNumber, s.address?.city]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [suppliers, query]);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50" />
          <Input
            placeholder="Rechercher un fournisseur…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <span className="text-[12px] font-medium text-muted">
          {filtered.length} / {suppliers.length} fournisseur
          {suppliers.length > 1 ? "s" : ""}
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>SIREN</TableHead>
            <TableHead>N° TVA</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Créé le</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-12 text-center text-[13px] text-muted"
              >
                Aucun fournisseur trouvé.
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="squircle-xs flex h-8 w-8 shrink-0 items-center justify-center bg-gold/8 text-[11px] font-semibold text-gold">
                      {initials(s.name) || "?"}
                    </div>
                    <span className="font-medium text-foreground">{s.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted">{s.email ?? "—"}</TableCell>
                <TableCell className="text-muted">{s.regNo ?? "—"}</TableCell>
                <TableCell className="text-muted">{s.vatNumber ?? "—"}</TableCell>
                <TableCell className="text-muted">{s.address?.city || "—"}</TableCell>
                <TableCell className="text-muted">{formatDate(s.createdAt)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
