"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  CheckCircle2,
  Wallet,
  Star,
  LogOut,
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import * as React from "react";

const jokiNavItems = [
  { href: "/joki-panel", label: "Dasbor Joki", icon: Flame },
  { href: "/joki-panel/orders", label: "Order Ditugaskan", icon: CheckCircle2, badge: "2 Aktif" },
  { href: "/joki-panel/earnings", label: "Pendapatan & Komisi", icon: Wallet },
];

export function JokiSidebar() {
  const pathname = usePathname();
  const [isOnline, setIsOnline] = React.useState(true);

  return (
    <aside className="w-64 border-r border-border bg-card/40 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Joki Worker Mini Profile */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-sm ring-1 ring-accent">
            VM
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold truncate">Andika "ViperML"</h4>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
              <span>4.95 / 5.0 (143 order)</span>
            </div>
          </div>
        </div>

        {/* Online Status Switcher */}
        <div className="flex items-center justify-between rounded-xl bg-muted/60 p-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                isOnline ? "bg-emerald-500 animate-pulse" : "bg-zinc-500"
              )}
            />
            <span className="font-semibold">
              Status: {isOnline ? "Siap Terima Order" : "Istirahat"}
            </span>
          </div>
          <Switch checked={isOnline} onCheckedChange={setIsOnline} />
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1">
        {jokiNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-bold shadow-glow-accent"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="rounded-full bg-primary/20 text-primary px-2 py-0.5 text-[10px] font-bold">
                  {item.badge}
                </span>
              )}
              {isActive && !item.badge && <ChevronRight className="h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Switchers */}
      <div className="p-3 border-t border-border space-y-1 text-xs">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Website</span>
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 font-medium transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Keluar Akun Joki</span>
        </Link>
      </div>
    </aside>
  );
}
