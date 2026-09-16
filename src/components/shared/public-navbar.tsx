"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gamepad2,
  Flame,
  Search,
  Menu,
  X,
  ShieldCheck,
  Zap,
  User,
  ShoppingBag,
  Sparkles,
  SearchCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { href: "/top-up", label: "Top-Up Game", icon: Zap },
    { href: "/joki", label: "Joki Rank", icon: Flame, badge: "Termurah" },
    { href: "/promo", label: "Promo & Voucher", icon: Sparkles },
    { href: "/lacak", label: "Lacak Pesanan", icon: SearchCheck },
    { href: "/blog", label: "Tips & Berita", icon: null },
    { href: "/faq", label: "Bantuan", icon: null },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-accent shadow-glow transition-transform group-hover:scale-105">
            <Gamepad2 className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text">
              TopUp<span className="text-primary">Game</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-accent -mt-1">
              Instant & Trusted
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:text-primary hover:bg-muted/50",
                  isActive
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-muted-foreground"
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 rounded-full bg-accent/20 px-1.5 py-0.2 text-[10px] font-bold text-accent">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* User Account / Login Button */}
          <div className="hidden sm:flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="h-9">
              <Link href="/login">Masuk</Link>
            </Button>
            <Button asChild size="sm" className="h-9 shadow-glow">
              <Link href="/register">Daftar</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="h-9 text-xs font-semibold"
            >
              <Link href="/dashboard" title="Demo User Dashboard">
                <User className="h-3.5 w-3.5 mr-1" />
                Member Area
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Menu Navigasi</span>
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pt-2 pb-3 border-b border-border">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                Masuk
              </Link>
            </Button>
            <Button asChild size="sm" className="w-full shadow-glow">
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                Daftar Akun
              </Link>
            </Button>
          </div>

          <div className="flex flex-col space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {Icon && <Icon className="h-4 w-4 text-primary" />}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Direct Area Switchers for Testing */}
          <div className="pt-2 border-t border-border flex flex-col gap-1.5 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground px-2">Akses Cepat Area:</span>
            <div className="grid grid-cols-3 gap-1.5">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center p-2 rounded bg-muted/60 hover:bg-muted font-medium text-foreground"
              >
                User
              </Link>
              <Link
                href="/joki-panel"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center p-2 rounded bg-muted/60 hover:bg-muted font-medium text-foreground"
              >
                Joki Panel
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center p-2 rounded bg-primary/20 text-primary hover:bg-primary/30 font-bold"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
