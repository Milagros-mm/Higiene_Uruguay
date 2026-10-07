import { PromoTopBar } from "@/frontend/components/layout/PromoTopBar";
import { Header } from "@/frontend/components/layout/Header";
import { QuickNav } from "@/frontend/components/layout/QuickNav";
import { HeroBanner } from "@/frontend/components/home/HeroBanner";
import { CategoryGrid } from "@/frontend/components/home/CategoryGrid";
import { FeaturedProducts } from "@/frontend/components/home/FeaturedProducts";
import { BrandGrid } from "@/frontend/components/home/BrandGrid";
import { StoreInfoSection } from "@/frontend/components/home/StoreInfoSection";
import { Footer } from "@/frontend/components/layout/Footer";
import { WhatsAppFloatingBtn } from "@/frontend/components/layout/WhatsAppFloatingBtn";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 1. Barra Superior Promocional */}
      <PromoTopBar />

      {/* 2. Header Principal con Buscador y Carrito */}
      <Header />

      {/* 3. Menú de Navegación Rápida con Categorías Desplegable */}
      <QuickNav />
      
      {/* 4. Cuerpo Principal */}
      <main className="flex-grow">
        {/* A. Recuadro Fijo Hero (con beneficios transparentes y foto de la tienda) */}
        <HeroBanner />

        {/* B. Grilla / Carrusel de Categorías */}
        <CategoryGrid />

        {/* C. Matriz de Productos Destacados + Botón Ver Más */}
        <FeaturedProducts />

        {/* D. Marcas Oficiales (ubicadas debajo de los productos destacados) */}
        <BrandGrid />

        {/* E. Sección Nuestra Tienda (ubicada al final de la página) */}
        <StoreInfoSection />
      </main>

      {/* 5. Footer y Botón Flotante */}
      <Footer />
      <WhatsAppFloatingBtn />
    </div>
  );
}
