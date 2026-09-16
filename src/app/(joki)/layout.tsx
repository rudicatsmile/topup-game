import Link from "next/link";
import { Gamepad2, Flame } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { JokiSidebar } from "@/components/shared/joki-sidebar";

export default function JokiLayout({
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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold shadow-glow-accent">
              <Flame className="h-5 w-5" />
            </div>
            <span className="font-heading font-extrabold text-lg">
              TopUp<span className="text-primary">Game</span>
            </span>
          </Link>
          <span className="text-xs bg-accent/20 text-accent px-2.5 py-0.5 rounded-full font-bold ml-2">
            Worker Joki Panel
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="flex items-center gap-2 pl-2 border-l border-border">
            <div className="h-8 w-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xs ring-1 ring-accent">
              VM
            </div>
            <span className="text-xs font-semibold hidden sm:inline">
              ViperML
            </span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1">
        <div className="hidden md:block">
          <JokiSidebar />
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
