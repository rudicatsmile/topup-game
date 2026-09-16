"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Flame,
  CreditCard,
  Gamepad2,
  Boxes,
  SlidersHorizontal,
  Ticket,
  Truck,
  Layers,
  Users,
  BarChart3,
  UserCheck,
  MessageSquare,
  ShieldCheck,
  Settings,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminNavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  highlight?: boolean;
}

interface AdminNavGroup {
  title: string;
  items: AdminNavItem[];
}

const adminGroups: AdminNavGroup[] = [
  {
    title: "Operasional",
    items: [
      { href: "/admin", label: "Dasbor Ringkasan", icon: LayoutDashboard },
      { href: "/admin/orders/topup", label: "Order Top-Up", icon: ShoppingBag },
      { href: "/admin/orders/joki", label: "Order Joki Rank", icon: Flame },
      {
        href: "/admin/payments",
        label: "Verifikasi Manual",
        icon: CreditCard,
        badge: "4",
      },
    ],
  },
  {
    title: "Katalog & Harga",
    items: [
      { href: "/admin/games", label: "Daftar Game", icon: Gamepad2 },
      { href: "/admin/products", label: "Nominal & Diamond", icon: Boxes },
      { href: "/admin/pricing", label: "Markup & Margin", icon: SlidersHorizontal },
      { href: "/admin/vouchers", label: "Voucher Diskon", icon: Ticket },
    ],
  },
  {
    title: "Logistik & Mitra",
    items: [
      { href: "/admin/suppliers", label: "Koneksi Supplier", icon: Truck },
      { href: "/admin/stock", label: "Mutasi & Stok", icon: Layers },
      { href: "/admin/joki", label: "Kelola Mitra Joki", icon: UserCheck },
    ],
  },
  {
    title: "Sistem & Keuangan",
    items: [
      { href: "/admin/reports", label: "Laporan Keuangan", icon: BarChart3 },
      { href: "/admin/users", label: "Kelola Pengguna", icon: Users },
      { href: "/admin/notifications", label: "WhatsApp Gateway", icon: MessageSquare },
      {
        href: "/admin/audit-logs",
        label: "Audit Log (Wajib)",
        icon: ShieldCheck,
        highlight: true,
      },
      { href: "/admin/settings", label: "Pengaturan Toko", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card/60 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Admin Profile */}
      <div className="p-4 border-b border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-glow">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold truncate">Dwi Kartika Sari</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Super Admin
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
        {adminGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <h5 className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              {group.title}
            </h5>
            <div className="space-y-0.5 mt-1.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground font-bold shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      item.highlight && !isActive && "text-accent font-semibold"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded-full bg-warning px-1.5 py-0.2 text-[10px] font-bold text-warning-foreground">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Switcher */}
      <div className="p-3 border-t border-border space-y-1 text-xs">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Lihat Website Publik</span>
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 font-medium transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Keluar Sesi Admin</span>
        </Link>
      </div>
    </aside>
  );
}
