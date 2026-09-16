"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Flame,
  ArrowLeft,
  MessageSquare,
  Send,
  Paperclip,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  Image as ImageIcon,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DUMMY_JOKI_ORDERS, DUMMY_JOKI_WORKERS } from "@/lib/dummy-data";
import { formatRupiah, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { sendChatMessage } from "@/actions/chat";

interface ChatMsg {
  id: string;
  sender: "buyer" | "joki";
  name: string;
  time: string;
  text: string;
}

export default function UserJokiOrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const order = DUMMY_JOKI_ORDERS.find((o) => o.id === id) || DUMMY_JOKI_ORDERS[0];
  const worker = DUMMY_JOKI_WORKERS[0];

  // Chat State
  const [messages, setMessages] = React.useState<ChatMsg[]>([
    {
      id: "m-1",
      sender: "joki",
      name: 'Andika "ViperML"',
      time: "09:15",
      text: "Halo mas Rizky! Saya worker joki yang ditugaskan untuk order ini. Saya mulai push jam 10 ya, akun aman.",
    },
    {
      id: "m-2",
      sender: "buyer",
      name: "Rizky Aditya",
      time: "09:20",
      text: "Siap mas Andika. Tolong pakai hero Assassin/Mage ya mas, jangan pakai Tank.",
    },
    {
      id: "m-3",
      sender: "joki",
      name: 'Andika "ViperML"',
      time: "11:45",
      text: "Siap mas, sudah win streak 4x nih di Legend II. Ini saya upload screenshot match terbarunya ya.",
    },
  ]);
  const [inputMsg, setInputMsg] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const messageText = inputMsg.trim();
    const newMsg: ChatMsg = {
      id: `m-${Date.now()}`,
      sender: "buyer",
      name: "Rizky Aditya",
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: messageText,
    };

    // Optimistic update
    setMessages((prev) => [...prev, newMsg]);
    setInputMsg("");
    setIsSending(true);

    try {
      await sendChatMessage({
        orderJokiId: order.id,
        body: messageText,
      });
    } catch {
      // Keep optimistic message displayed
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/joki" className="flex items-center gap-1.5 text-xs">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Order Joki
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-muted-foreground">
            {order.invoiceId}
          </span>
          <Badge variant="accent" className="text-xs font-bold">
            {order.status === "ON_PROGRESS" ? "SEDANG DIKERJAKAN" : "SELESAI"}
          </Badge>
        </div>
      </div>

      {/* Progress & Overview Card */}
      <Card className="rounded-3xl border-accent/40 bg-card p-6 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <span className="text-xs text-muted-foreground block">
              {order.gameName}
            </span>
            <h1 className="text-2xl font-extrabold font-heading text-foreground mt-0.5">
              {order.startTierName} → {order.targetTierName}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Posisi Terkini: <strong className="text-accent">{order.currentTierName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">
                Total Biaya Joki
              </span>
              <span className="font-price font-extrabold text-xl text-accent">
                {formatRupiah(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Persentase Target Tercapai</span>
            <span className="text-accent font-price font-bold">
              {order.progressPercent}% Selesai
            </span>
          </div>
          <div className="h-3.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
              style={{ width: `${order.progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Awal: {order.startTierName}</span>
            <span>Target Akhir: {order.targetTierName}</span>
          </div>
        </div>

        {/* Worker Mini Card */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={worker.avatarUrl}
              alt={worker.displayName}
              className="h-12 w-12 rounded-xl object-cover ring-2 ring-accent"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-foreground">
                  {worker.displayName}
                </h4>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-500 font-bold px-2 py-0.2 rounded-full">
                  ONLINE
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-400 font-bold mt-0.5">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>{worker.ratingAvg} / 5.0 Rating Mitra</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
              <Lock className="h-3.5 w-3.5" />
              <span>Login Terenkripsi</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Two Column: Live Chat + Screenshot Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Chat Box */}
        <div className="lg:col-span-7">
          <Card className="rounded-2xl border-border bg-card flex flex-col h-[480px]">
            <CardHeader className="p-4 border-b border-border flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-accent" />
                <CardTitle className="text-sm">
                  Live Chat dengan Joki
                </CardTitle>
              </div>
              <span className="text-[11px] text-muted-foreground">
                Respon Cepat
              </span>
            </CardHeader>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {messages.map((m) => {
                const isMe = m.sender === "buyer";
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${
                      isMe ? "items-end" : "items-start"
                    }`}
                  >
                    <span className="text-[10px] text-muted-foreground mb-0.5 px-1">
                      {m.name} • {m.time}
                    </span>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                        isMe
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted text-foreground rounded-bl-none"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-border flex items-center gap-2"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground"
                onClick={() => toast.info("Fitur lampiran gambar aktif untuk format PNG/JPG.")}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Ketik pesan untuk joki..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
              <Button type="submit" size="sm" className="h-9 px-4 shadow-glow">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </Card>
        </div>

        {/* Right: Screenshot Match Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="rounded-2xl border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm">Bukti Kemenangan Match</h3>
              </div>
              <Badge variant="outline" className="text-[10px]">
                3 Screenshot
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl overflow-hidden border border-border bg-muted/30 p-2 space-y-1.5">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black/50">
                  <img
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60"
                    alt="Victory Match"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-bold">
                    VICTORY MVP
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground px-1">
                  <span>Match #4 — Skor: 12/1/8</span>
                  <span>1 jam lalu</span>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-border bg-muted/30 p-2 space-y-1.5">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black/50">
                  <img
                    src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=60"
                    alt="Victory Match"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-bold">
                    VICTORY GOLD
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground px-1">
                  <span>Match #3 — Naik Legend I</span>
                  <span>2 jam lalu</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
