import { NextResponse } from 'next/server';
import { getAllCategories } from '@/backend/services/productService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error en API /api/categories:', error);
    return NextResponse.json(
      { error: 'Error al consultar categorías' },
      { status: 500 }
    );
  }
}
