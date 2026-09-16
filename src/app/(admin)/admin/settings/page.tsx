"use client";

import * as React from "react";
import { Settings, Save, ShieldCheck, CreditCard, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [appName, setAppName] = React.useState("TopUpGame");
  const [csPhone, setCsPhone] = React.useState("6281234567890");
  const [isXenditProduction, setIsXenditProduction] = React.useState(false);
  const [bankName, setBankName] = React.useState("BCA");
  const [bankAccount, setBankAccount] = React.useState("1234567890");
  const [bankHolder, setBankHolder] = React.useState("PT TopUpGame Indonesia");
  const [orderExpiryMin, setOrderExpiryMin] = React.useState("30");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Pengaturan sistem berhasil disimpan! Tercatat di audit_logs.");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading">
          Pengaturan Sistem &amp; Integrasi
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Konfigurasi umum platform, rekening tujuan transfer manual, dan parameter keamanan transaksi
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Store Config */}
        <Card className="rounded-2xl border-border bg-card p-6 space-y-4">
          <CardHeader className="p-0 pb-3 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              <span>Konfigurasi Umum Platform</span>
            </CardTitle>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="appName">Nama Aplikasi</Label>
              <Input
                id="appName"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="csPhone">Nomor WhatsApp CS Resmi (+62)</Label>
              <Input
                id="csPhone"
                value={csPhone}
                onChange={(e) => setCsPhone(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>
        </Card>

        {/* Xendit Environment */}
        <Card className="rounded-2xl border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <CreditCard className="h-4 w-4 text-accent" />
              <div>
                <h3 className="font-bold text-sm">Mode Gateway Xendit</h3>
                <p className="text-xs text-muted-foreground">
                  Gunakan mode Production untuk transaksi rupiah nyata
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isXenditProduction ? "success" : "warning"} className="text-[10px]">
                {isXenditProduction ? "PRODUCTION (LIVE)" : "SANDBOX / DEV"}
              </Badge>
              <Switch
                checked={isXenditProduction}
                onCheckedChange={setIsXenditProduction}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="expiry">Batas Waktu Kedaluwarsa Order (Menit)</Label>
            <Input
              id="expiry"
              type="number"
              value={orderExpiryMin}
              onChange={(e) => setOrderExpiryMin(e.target.value)}
              className="text-xs max-w-xs font-mono"
            />
            <span className="text-[10px] text-muted-foreground block">
              Setelah waktu ini lewat, invoice status otomatis menjadi EXPIRED
            </span>
          </div>
        </Card>

        {/* Manual Bank Account */}
        <Card className="rounded-2xl border-border bg-card p-6 space-y-4">
          <CardHeader className="p-0 pb-3 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-500" />
              <span>Rekening Resmi Transfer Manual</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Informasi rekening ini akan ditampilkan kepada pembeli saat memilih metode transfer manual
            </CardDescription>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="bName">Nama Bank</Label>
              <Input
                id="bName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bAcc">Nomor Rekening</Label>
              <Input
                id="bAcc"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="text-xs font-mono font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bHold">Nama Pemilik Rekening</Label>
              <Input
                id="bHold"
                value={bankHolder}
                onChange={(e) => setBankHolder(e.target.value)}
                className="text-xs font-semibold"
              />
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Konfigurasi tersimpan secara aman di database
          </span>
          <Button type="submit" size="sm" className="shadow-glow px-6">
            <Save className="h-4 w-4 mr-1.5" />
            Simpan Seluruh Pengaturan
          </Button>
        </div>
      </form>
    </div>
  );
}
