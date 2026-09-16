"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, Search, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_FAQS } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

export default function FAQPage() {
  const [search, setSearch] = React.useState("");
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const [activeCategory, setActiveCategory] = React.useState("Semua");

  const categories = [
    "Semua",
    "Top-Up & Diamond",
    "Layanan Joki Rank",
    "Pembayaran & Garansi",
  ];

  const filteredFaqs = DUMMY_FAQS.filter((faq) => {
    const matchCat =
      activeCategory === "Semua" || faq.category === activeCategory;
    const matchSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="gaming" className="font-bold">
          PUSAT BANTUAN &amp; FAQ
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
          Pertanyaan yang Sering Diajukan
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Temukan jawaban cepat seputar cara top-up, keamanan akun saat joki rank, hingga alur klaim garansi.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Cari pertanyaan... (misal: joki, refund, pembayaran)"
          className="pl-12 h-12 rounded-2xl bg-card border-border shadow-sm text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            className="rounded-xl text-xs h-9"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <Card
              key={idx}
              className={cn(
                "rounded-2xl border-border bg-card transition-all overflow-hidden cursor-pointer",
                isOpen && "border-primary/50 shadow-sm"
              )}
              onClick={() => setOpenIndex(isOpen ? null : idx)}
            >
              <div className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 text-xs font-bold">
                    Q
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-foreground">
                    {faq.question}
                  </h3>
                </div>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200",
                    isOpen && "rotate-180 text-primary"
                  )}
                />
              </div>

              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-sm text-muted-foreground leading-relaxed pl-15">
                  <p className="border-t border-border/60 pt-3">
                    {faq.answer}
                  </p>
                </div>
              )}
            </Card>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Pertanyaan tidak ditemukan. Coba gunakan kata kunci yang berbeda.
          </div>
        )}
      </div>

      {/* Still need help banner */}
      <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-3">
        <h4 className="font-heading font-bold text-base">
          Masih Membutuhkan Bantuan Lebih Lanjut?
        </h4>
        <p className="text-xs text-muted-foreground">
          Customer Service kami siap membantu menyelesaikan transaksi Anda secara langsung.
        </p>
        <Button asChild variant="accent" size="sm" className="shadow-glow-accent">
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
          >
            <MessageSquare className="h-4 w-4 mr-1.5" />
            Chat CS WhatsApp 24 Jam
          </a>
        </Button>
      </div>
    </div>
  );
}
