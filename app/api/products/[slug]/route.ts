import { NextRequest, NextResponse } from 'next/server';
import { getBackendProductBySlug, getBackendRelatedProducts } from '@/backend/services/catalogService';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const producto = await getBackendProductBySlug(slug);

    if (!producto) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    const relacionados = await getBackendRelatedProducts(producto.id, 4);

    return NextResponse.json({
      producto,
      relacionados,
    });
  } catch (error) {
    console.error('Error en API /api/products/[slug]:', error);
    return NextResponse.json(
      { error: 'Error al consultar el producto' },
      { status: 500 }
    );
  }
}
