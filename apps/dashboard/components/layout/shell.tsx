"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

export function Shell({ header, children }: { header: ReactNode; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="relative min-h-dvh">
      {/* Ambient background glow */}
      <div className="page-ambient" />

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      <div
        className={cn(
          "relative z-10 flex min-h-dvh flex-col transition-[margin-left] duration-300",
          collapsed ? "ml-[84px]" : "ml-[232px]",
        )}
      >
        {header}
        <main className="flex-1 p-5 md:p-6">{children}</main>
      </div>
    </div>
  );
}
