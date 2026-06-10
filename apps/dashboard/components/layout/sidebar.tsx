"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Vue d'ensemble", icon: LayoutDashboard, path: "/overview" },
  { title: "Dossiers", icon: FolderOpen, path: "/dossiers" },
  { title: "Clôtures", icon: Send, path: "/clotures" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col transition-all duration-300",
        collapsed ? "w-[84px]" : "w-[232px]",
      )}
      style={{ background: "var(--navy)" }}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex shrink-0 items-center gap-3",
          collapsed ? "h-16 justify-center px-3" : "h-16 px-5",
        )}
      >
        <div className="squircle-sm flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden bg-white">
          <Image
            src="/images/af-logo-circle.png"
            alt="AGEC Finances"
            width={36}
            height={36}
            className="h-full w-full object-cover"
            priority
          />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="font-display text-[13px] font-semibold text-white">
              AGEC Finances
            </span>
            <span className="text-[10px] font-medium text-white/40">CRM Clôture</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav
        className={cn(
          "flex flex-1 flex-col gap-0.5 overflow-y-auto py-3",
          collapsed ? "px-2" : "px-3",
        )}
      >
        {menuItems.map((item) => {
          const isActive =
            pathname === item.path || pathname.startsWith(item.path + "/");

          if (collapsed) {
            return (
              <Link
                key={item.path}
                href={item.path}
                title={item.title}
                className={cn(
                  "sidebar-rail-link",
                  isActive && "sidebar-rail-link-active",
                )}
              >
                <item.icon className="h-[18px] w-[18px]" />
                <span className="mt-0.5 block w-full truncate text-center">
                  {item.title.split(" ")[0]}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "squircle-sm flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                isActive
                  ? "bg-white/12 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                  : "text-white/55 hover:bg-white/8 hover:text-white/90",
              )}
            >
              <item.icon className="h-[16px] w-[16px] shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Toggle */}
      <div className={cn("shrink-0 border-t border-white/8 p-3", collapsed && "px-2")}>
        <button
          type="button"
          onClick={onToggle}
          className="squircle-sm flex h-9 w-full items-center justify-center gap-2 text-[12px] font-medium text-white/45 transition-colors hover:bg-white/8 hover:text-white/80"
          aria-label={collapsed ? "Ouvrir le menu" : "Réduire le menu"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Réduire</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
