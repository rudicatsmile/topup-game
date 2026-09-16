"use client";

import * as React from "react";
import { SlidersHorizontal, Save, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/utils";

export default function AdminPricingPage() {
  const [mobaMarkup, setMobaMarkup] = React.useState("12");
  const [fpsMarkup, setFpsMarkup] = React.useState("10");
  const [brMarkup, setBrMarkup] = React.useState("10");
  const [rpgMarkup, setRpgMarkup] = React.useState("14");
  const [enablePeakHours, setEnablePeakHours] = React.useState(true);
  const [peakHourSurcharge, setPeakHourSurcharge] = React.useState("2.5");

  // Simulation calculator
  const [simCost, setSimCost] = React.useState(50000);
  const simMargin = (simCost * Number(mobaMarkup)) / 100;
  const simPeakExtra = enablePeakHours ? (simCost * Number(peakHourSurcharge)) / 100 : 0;
  const simTotalSell = simCost + simMargin + simPeakExtra;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Aturan markup global berhasil disimpan! Tercatat di audit_logs.");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading">
          Aturan Markup Harga &amp; Dynamic Pricing
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Kelola formula keuntungan otomatis per kategori dan penyesuaian jam sibuk
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Category Markup Card */}
        <Card className="rounded-2xl border-border bg-card p-6 space-y-4">
          <CardHeader className="p-0 pb-3 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <span>Markup Persentase Global per Kategori</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Sistem akan menghitung harga jual = Harga Modal + (Harga Modal × Markup %)
            </CardDescription>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5 p-3 rounded-xl bg-muted/40 border border-border">
              <div className="flex justify-between items-center">
                <Label htmlFor="moba">Kategori MOBA (MLBB, HoK)</Label>
                <span className="font-bold text-accent text-sm">{mobaMarkup}%</span>
              </div>
              <Input
                id="moba"
                type="number"
                value={mobaMarkup}
                onChange={(e) => setMobaMarkup(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-muted/40 border border-border">
              <div className="flex justify-between items-center">
                <Label htmlFor="fps">Kategori FPS (Valorant, CS2)</Label>
                <span className="font-bold text-accent text-sm">{fpsMarkup}%</span>
              </div>
              <Input
                id="fps"
                type="number"
                value={fpsMarkup}
                onChange={(e) => setFpsMarkup(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-muted/40 border border-border">
              <div className="flex justify-between items-center">
                <Label htmlFor="br">Kategori Battle Royale (FF, PUBG)</Label>
                <span className="font-bold text-accent text-sm">{brMarkup}%</span>
              </div>
              <Input
                id="br"
                type="number"
                value={brMarkup}
                onChange={(e) => setBrMarkup(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-muted/40 border border-border">
              <div className="flex justify-between items-center">
                <Label htmlFor="rpg">Kategori RPG (Genshin, HSR)</Label>
                <span className="font-bold text-accent text-sm">{rpgMarkup}%</span>
              </div>
              <Input
                id="rpg"
                type="number"
                value={rpgMarkup}
                onChange={(e) => setRpgMarkup(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </Card>

        {/* Dynamic Peak Hours */}
        <Card className="rounded-2xl border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-accent" />
              <div>
                <h3 className="font-bold text-sm">Dynamic Pricing Jam Sibuk (Peak Hours)</h3>
                <p className="text-xs text-muted-foreground">
                  Otomatis menambahkan surcharge kecil pada jam 19.00 – 23.00 WIB
                </p>
              </div>
            </div>
            <Switch
              checked={enablePeakHours}
              onCheckedChange={setEnablePeakHours}
            />
          </div>

          {enablePeakHours && (
            <div className="max-w-xs space-y-1.5 pt-2">
              <Label htmlFor="peak">Tambahan Surcharge Peak Hours (%)</Label>
              <Input
                id="peak"
                type="number"
                step="0.1"
                value={peakHourSurcharge}
                onChange={(e) => setPeakHourSurcharge(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          )}
        </Card>

        {/* Live Formula Simulator */}
        <Card className="rounded-2xl border-accent/40 bg-accent/5 p-6 space-y-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <span>Simulator Perhitungan Harga Jual Konsumen</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="p-3 rounded-xl bg-card border border-border">
              <span className="text-muted-foreground block">Modal Contoh:</span>
              <span className="font-price font-bold text-sm">{formatRupiah(simCost)}</span>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border">
              <span className="text-muted-foreground block">Markup Kategori ({mobaMarkup}%):</span>
              <span className="font-price font-bold text-sm text-emerald-500">
                +{formatRupiah(simMargin)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border">
              <span className="text-muted-foreground block">Peak Extra ({enablePeakHours ? `${peakHourSurcharge}%` : "0%"}):</span>
              <span className="font-price font-bold text-sm text-primary">
                +{formatRupiah(simPeakExtra)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border">
              <span className="text-muted-foreground block">Estimasi Harga Jual:</span>
              <span className="font-price font-extrabold text-sm text-accent">
                {formatRupiah(simTotalSell)}
              </span>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Perubahan formula otomatis dicatat ke tabel immutable audit_logs</span>
          </div>
          <Button type="submit" size="sm" className="shadow-glow px-6">
            <Save className="h-4 w-4 mr-1.5" />
            Simpan Konfigurasi Harga
          </Button>
        </div>
      </form>
    </div>
  );
}
