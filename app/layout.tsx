import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Higiene Uruguay | E-commerce Profesional",
  description: "Productos de limpieza y desinfección profesional de máxima calidad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${plusJakarta.variable} antialiased`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-brand-cyan selection:text-white">
        {children}
      </body>
    </html>
  );
}
