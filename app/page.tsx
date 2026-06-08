import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { HeroSection } from "@/components/marketing/HeroSection";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { PricingSection } from "@/components/marketing/PricingSection";
import { CtaSection } from "@/components/marketing/CtaSection";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "PipeFlow — CRM para times de vendas",
  description:
    "Pipeline Kanban com drag-and-drop, gestão de leads e dashboard de métricas em tempo real. Comece grátis, sem cartão de crédito.",
  openGraph: {
    title: "PipeFlow — CRM para times de vendas",
    description:
      "Do primeiro contato ao fechamento, tudo em um só lugar. Pipeline Kanban, gestão de leads e métricas em tempo real.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <MarketingNav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <CtaSection />
      </main>
      <MarketingFooter />
    </>
  );
}
