import { PromoTopBar } from "@/frontend/components/layout/PromoTopBar";
import { Header } from "@/frontend/components/layout/Header";
import { QuickNav } from "@/frontend/components/layout/QuickNav";
import { HeroBanner } from "@/frontend/components/home/HeroBanner";
import { BenefitsBar } from "@/frontend/components/home/BenefitsBar";
import { StoreInfoSection } from "@/frontend/components/home/StoreInfoSection";
import { CategoryGrid } from "@/frontend/components/home/CategoryGrid";
import { BrandGrid } from "@/frontend/components/home/BrandGrid";
import { FeaturedProducts } from "@/frontend/components/home/FeaturedProducts";
import { Footer } from "@/frontend/components/layout/Footer";
import { WhatsAppFloatingBtn } from "@/frontend/components/layout/WhatsAppFloatingBtn";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 1. Barra Superior (Announcement Bar) */}
      <PromoTopBar />

      {/* 2. Header Principal */}
      <Header />

      {/* 3. Menú de Navegación Rápida */}
      <QuickNav />
      
      {/* 4. Cuerpo Principal (Layout Vertical en estricto orden) */}
      <main className="flex-grow">
        {/* A. Carrusel / Banner Principal */}
        <HeroBanner />

        {/* B. Barra de Beneficios flotante sobre el banner */}
        <BenefitsBar />

        {/* C. Sección "Nuestra Tienda" */}
        <StoreInfoSection />

        {/* C. Grilla Horizontal de Categorías */}
        <CategoryGrid />

        {/* D. Grilla Horizontal de Marcas */}
        <BrandGrid />

        {/* E. Productos Destacados */}
        <FeaturedProducts />
      </main>

      {/* 5. Footer / Final de la Página (Sin modificaciones) */}
      <Footer />
      <WhatsAppFloatingBtn />
    </div>
  );
}

