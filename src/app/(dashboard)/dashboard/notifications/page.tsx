"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, CheckCircle2, MessageSquare, Zap, Flame, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function UserNotificationsPage() {
  const notifications = [
    {
      id: "notif-1",
      title: "Top-Up Berhasil Dikirim! ⚡",
      body: "Pesanan Mobile Legends (172 Diamonds) untuk User ID 84729104 telah sukses dikirimkan. Terima kasih telah berbelanja di TopUpGame!",
      link: "/dashboard/orders/ord-1",
      time: "2 jam yang lalu",
      channel: "WhatsApp & In-App",
      isRead: false,
    },
    {
      id: "notif-2",
      title: "Progres Joki Diperbarui: Legend I 🎯",
      body: "Worker Andika 'ViperML' baru saja menyelesaikan match dengan kemenangan. Progres rank Anda sekarang 85% selesai.",
      link: "/dashboard/joki/jki-1",
      time: "5 jam yang lalu",
      channel: "WhatsApp & In-App",
      isRead: false,
    },
    {
      id: "notif-3",
      title: "Voucher Baru Tersedia: HEMAT20 🎉",
      body: "Klaim diskon 20% untuk transaksi top-up berikutnya. Kuota terbatas untuk 500 pengguna pertama!",
      link: "/promo",
      time: "1 hari yang lalu",
      channel: "In-App",
      isRead: true,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">
            Notifikasi Transaksi
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Riwayat pembaruan status pesanan, pesan joki, dan promo eksklusif
          </p>
        </div>
        <Button variant="ghost" size="sm" className="text-xs">
          Tandai Semua Dibaca
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <Card
            key={notif.id}
            className={`rounded-2xl border-border bg-card p-5 transition-all hover:border-primary/50 ${
              !notif.isRead ? "border-l-4 border-l-primary bg-primary/5" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Bell className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground">
                      {notif.title}
                    </h3>
                    <Badge variant="outline" className="text-[10px]">
                      {notif.channel}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {notif.body}
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                    <span>{notif.time}</span>
                    <Link
                      href={notif.link}
                      className="font-bold text-primary hover:underline"
                    >
                      Buka Rincian &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
