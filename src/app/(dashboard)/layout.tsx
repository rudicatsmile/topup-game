import Link from "next/link";
import { Gamepad2, Bell, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardSidebar } from "@/components/shared/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background/90 px-4 sm:px-6 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-glow">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <span className="font-heading font-extrabold text-lg">
              TopUp<span className="text-primary">Game</span>
            </span>
          </Link>
          <span className="text-xs bg-muted px-2 py-0.5 rounded font-semibold text-muted-foreground ml-2">
            Member Area
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/notifications"
            className="relative h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
          </Link>
          <ThemeToggle />
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 pl-2 border-l border-border"
          >
            <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
              RA
            </div>
            <span className="text-xs font-semibold hidden sm:inline">
              Rizky A.
            </span>
          </Link>
        </div>
      </header>

      {/* Main Body with Persistent Sidebar */}
      <div className="flex flex-1">
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
