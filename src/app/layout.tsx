import type { Metadata, Viewport } from "next";
require("./globals.css");
import { PwaRegister } from "@/components/PwaRegister";

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Pencatatan Distribusi Penjualan",
  description:
    "Aplikasi pencatatan distribusi atau penitipan jualan ke berbagai lapak harian dengan rekapitulasi otomatis dan pengiriman WhatsApp.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Catat Jualan",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-slate-100/60 font-sans text-slate-800 antialiased">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
