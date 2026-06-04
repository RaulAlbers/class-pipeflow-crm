import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "PipeFlow CRM", template: "%s · PipeFlow" },
  description: "Gestão de pipeline de vendas simples e eficiente.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} dark h-full`}>
      <body className="h-full bg-bg text-text antialiased">{children}</body>
    </html>
  );
}
