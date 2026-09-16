import Link from "next/link";
import { Gamepad2, ShieldAlert } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AdminSidebar } from "@/components/shared/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 sm:px-6 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-accent text-white shadow-glow">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <span className="font-heading font-extrabold text-lg">
              TopUp<span className="text-primary">Game</span>
            </span>
          </Link>
          <span className="text-xs bg-primary/20 text-primary px-2.5 py-0.5 rounded-full font-bold ml-2">
            Console Administrasi
          </span>
          <span className="hidden sm:inline text-[10px] bg-emerald-500/20 text-emerald-500 font-bold px-2 py-0.5 rounded">
            LIVE ENV: STAGING
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="flex items-center gap-2 pl-2 border-l border-border">
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-glow">
              DK
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold leading-tight">
                Dwi Kartika Sari
              </span>
              <span className="text-[10px] text-accent font-semibold">
                Super Admin
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1">
        <div className="hidden md:block">
          <AdminSidebar />
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
