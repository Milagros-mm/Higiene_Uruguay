# Guía de Imágenes y Banners

Este documento detalla los tamaños recomendados y las ubicaciones para las imágenes del proyecto.

## 1. Hero Banners (`/public/banners/`)
Las imágenes principales que aparecen en el carrusel de inicio.
- **Tamaño recomendado**: 1920x700 píxeles.
- **Formato**: JPG o WebP.
- **Nombres sugeridos**: `hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg`.
- **Uso**: El componente `HeroBanner` lee estas imágenes desde un array `HERO_SLIDES`.

## 2. Showroom / Local (`/public/showroom/`)
Las imágenes que muestran el local físico.
- **Tamaño recomendado**: 1200x1000 píxeles (relación de aspecto 4:3 aprox).
- **Formato**: JPG o WebP.
- **Nombres sugeridos**: `local.jpg` (es la que actualmente lee el componente `StoreInfoSection`).

## 3. Productos
Las fotos individuales de los productos.
- **Tamaño recomendado**: 1000x1000 píxeles (relación de aspecto 1:1, cuadradas).
- **Formato**: PNG (con fondo transparente) o JPG (con fondo blanco puro).
- **Nota**: Si un producto no tiene imagen, el sistema mostrará automáticamente un placeholder gris con un ícono, gracias a los ajustes realizados en `ProductCard`.

## 4. Marcas (`/public/brands/`)
Los logos de las marcas oficiales.
- **Formato**: SVG (monocromo y fondo transparente).
- **Nota**: El color se gestiona mediante clases de Tailwind (grises, brillo y opacidad), por lo que es importante que el SVG sea limpio y sin colores duros embebidos que dificulten el efecto.
