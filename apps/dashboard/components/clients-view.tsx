"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Customer } from "@agec/shared";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, initials } from "@/lib/utils";

export function ClientsView({ customers }: { customers: Customer[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      [c.name, c.email, c.regNo, c.vatNumber, c.address?.city]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [customers, query]);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50" />
          <Input
            placeholder="Rechercher un client…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <span className="text-[12px] font-medium text-muted">
          {filtered.length} / {customers.length} client
          {customers.length > 1 ? "s" : ""}
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
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
                colSpan={7}
                className="py-12 text-center text-[13px] text-muted"
              >
                Aucun client trouvé.
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="squircle-xs flex h-8 w-8 shrink-0 items-center justify-center bg-accent/8 text-[11px] font-semibold text-accent">
                      {initials(c.name) || "?"}
                    </div>
                    <span className="font-medium text-foreground">{c.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={c.type === "company" ? "info" : "secondary"}>
                    {c.type === "company" ? "Société" : "Particulier"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted">{c.email ?? "—"}</TableCell>
                <TableCell className="text-muted">{c.regNo ?? "—"}</TableCell>
                <TableCell className="text-muted">{c.vatNumber ?? "—"}</TableCell>
                <TableCell className="text-muted">{c.address?.city || "—"}</TableCell>
                <TableCell className="text-muted">{formatDate(c.createdAt)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
