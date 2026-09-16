"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Zap,
  ShoppingBag,
  Flame,
  MessageSquare,
  Ticket,
  User,
  Bell,
  LogOut,
  ChevronRight,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const userNavItems = [
  { href: "/dashboard", label: "Dasbor Saya", icon: LayoutDashboard },
  { href: "/dashboard/topup", label: "Top-Up Cepat", icon: Zap },
  { href: "/dashboard/orders", label: "Riwayat Top-Up", icon: ShoppingBag },
  { href: "/dashboard/joki", label: "Order Joki Rank", icon: Flame },
  { href: "/dashboard/chat", label: "Chat Center", icon: MessageSquare },
  { href: "/dashboard/vouchers", label: "Voucher Saya", icon: Ticket },
  { href: "/dashboard/profile", label: "Profil Akun", icon: User },
  { href: "/dashboard/notifications", label: "Notifikasi", icon: Bell },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card/40 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* User Mini Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-base">
            RA
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold truncate">Rizky Aditya</h4>
            <p className="text-xs text-muted-foreground truncate">
              rizky.aditya@example.com
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-lg bg-primary/10 px-3 py-1.5 text-xs text-primary font-semibold">
          <span>Poin Reward:</span>
          <span className="font-price font-bold">1.250 Poin</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {userNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-glow"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Switch to public / logout */}
      <div className="p-3 border-t border-border space-y-1.5 text-xs">
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
          <span>Keluar Akun</span>
        </Link>
      </div>
    </aside>
  );
}
