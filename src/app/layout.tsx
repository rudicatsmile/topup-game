import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://topupgame.id"),
  title: {
    template: "%s | TopUpGame — Platform Top-Up & Joki Rank #1 Indonesia",
    default: "TopUpGame — Top-Up Diamond Cepat & Layanan Joki Rank Termurah",
  },
  description:
    "Top-up diamond Mobile Legends, Free Fire, PUBG, Valorant instan hitungan detik via QRIS & E-Wallet. Layanan joki rank profesional, aman, dan bergaransi.",
  keywords: [
    "top up diamond murah",
    "top up mobile legends",
    "joki rank mlbb",
    "top up free fire",
    "top up valorant",
    "joki mythic murah",
  ],
  authors: [{ name: "TopUpGame Indonesia" }],
  creator: "TopUpGame",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://topupgame.id",
    siteName: "TopUpGame",
    title: "TopUpGame — Top-Up Diamond Cepat & Joki Rank Termurah",
    description:
      "Platform top-up game terpercaya di Indonesia. Proses instan 1-3 detik, pembayaran QRIS, E-Wallet, VA & transfer bank.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "TopUpGame Official Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TopUpGame — Top-Up Diamond Cepat & Joki Rank Termurah",
    description: "Proses otomatis hitungan detik, harga termurah, 100% legal dan amanah.",
    images: ["https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80"],
  },
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TopUpGame Indonesia",
  url: "https://topupgame.id",
  logo: "https://topupgame.id/logo.png",
  description: "Platform top-up diamond game dan layanan joki rank termurah di Indonesia.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+62-812-3456-7890",
    contactType: "Customer Service",
    areaServed: "ID",
    availableLanguage: ["Indonesian", "English"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body
        className={`${jakarta.variable} ${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-white`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
