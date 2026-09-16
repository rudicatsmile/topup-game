"use client";

import * as React from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Paperclip,
  Send,
  Star,
  Flame,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DUMMY_JOKI_ORDERS } from "@/lib/dummy-data";

export default function UserChatCenterPage() {
  const [selectedRoom, setSelectedRoom] = React.useState("jki-1");
  const [msgInput, setMsgInput] = React.useState("");

  const rooms = [
    {
      id: "jki-1",
      name: 'Andika "ViperML"',
      role: "Mitra Joki (Order MLBB)",
      orderInvoice: "TUG-JKI-2025-000112",
      lastMsg: "Siap mas, sudah win streak 4x nih di Legend II.",
      time: "11:45",
      unread: 1,
      isOnline: true,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60",
    },
    {
      id: "cs-support",
      name: "Customer Support TopUpGame",
      role: "Layanan Bantuan Resmi",
      orderInvoice: "Bantuan Umum",
      lastMsg: "Ada yang bisa kami bantu terkait pesanan Anda?",
      time: "Kemarin",
      unread: 0,
      isOnline: true,
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60",
    },
  ];

  const currentRoom = rooms.find((r) => r.id === selectedRoom) || rooms[0];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold font-heading">
          Pusat Percakapan (Chat Center)
        </h1>
        <p className="text-xs text-muted-foreground">
          Berkomunikasi langsung dengan worker joki dan tim customer support kami
        </p>
      </div>

      <Card className="rounded-3xl border-border bg-card overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[600px]">
        {/* Left: Rooms List */}
        <div className="md:col-span-4 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border space-y-2">
            <h3 className="font-bold text-sm">Daftar Percakapan</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Cari obrolan..."
                className="pl-8 h-9 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {rooms.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedRoom(r.id)}
                className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${
                  selectedRoom === r.id
                    ? "bg-primary/10 border-l-4 border-primary"
                    : "hover:bg-muted/40"
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  {r.isOnline && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs truncate text-foreground">
                      {r.name}
                    </h4>
                    <span className="text-[10px] text-muted-foreground">
                      {r.time}
                    </span>
                  </div>
                  <span className="text-[10px] text-accent block font-medium">
                    {r.orderInvoice}
                  </span>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {r.lastMsg}
                  </p>
                </div>

                {r.unread > 0 && (
                  <span className="h-4 w-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                    {r.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Chat Room */}
        <div className="md:col-span-8 flex flex-col bg-muted/10">
          {/* Header */}
          <div className="p-4 border-b border-border bg-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentRoom.avatar}
                alt={currentRoom.name}
                className="h-9 w-9 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-foreground">
                  {currentRoom.name}
                </h4>
                <span className="text-[10px] text-muted-foreground block">
                  {currentRoom.role} • {currentRoom.orderInvoice}
                </span>
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="h-8 text-xs">
              <Link href="/dashboard/joki/jki-1">Lihat Order</Link>
            </Button>
          </div>

          {/* Messages Mockup */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            <div className="text-center my-2">
              <span className="px-2.5 py-1 rounded-full bg-muted text-[10px] text-muted-foreground font-semibold">
                Percakapan dimulai untuk pesanan {currentRoom.orderInvoice}
              </span>
            </div>

            <div className="flex flex-col items-start">
              <span className="text-[10px] text-muted-foreground mb-0.5">
                {currentRoom.name} • 09:15
              </span>
              <div className="max-w-[75%] rounded-2xl rounded-bl-none bg-card border border-border p-3 shadow-sm text-foreground">
                Halo mas Rizky! Saya worker joki yang ditugaskan untuk order ini. Saya mulai push jam 10 ya, akun aman.
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] text-muted-foreground mb-0.5">
                Anda • 09:20
              </span>
              <div className="max-w-[75%] rounded-2xl rounded-br-none bg-primary text-primary-foreground p-3 shadow-sm">
                Siap mas Andika. Tolong pakai hero Assassin/Mage ya mas, jangan pakai Tank.
              </div>
            </div>

            <div className="flex flex-col items-start">
              <span className="text-[10px] text-muted-foreground mb-0.5">
                {currentRoom.name} • 11:45
              </span>
              <div className="max-w-[75%] rounded-2xl rounded-bl-none bg-card border border-border p-3 shadow-sm text-foreground">
                Siap mas, sudah win streak 4x nih di Legend II. Posisi sekarang Legend I bintang 4 ya!
              </div>
            </div>
          </div>

          {/* Chat Bar */}
          <div className="p-3 border-t border-border bg-card flex items-center gap-2">
            <Input
              placeholder="Tulis balasan pesan..."
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              className="h-10 text-xs rounded-xl"
            />
            <Button size="sm" className="h-10 px-5 shadow-glow">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
