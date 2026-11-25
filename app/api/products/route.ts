import { NextRequest, NextResponse } from 'next/server';
import { getBackendCatalog } from '@/backend/services/catalogService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Soporta tanto la nomenclatura interna como parámetros visibles de consulta
    const rubroSlug = searchParams.get('rubro') || searchParams.get('categoria') || undefined;
    const subrubroSlug = searchParams.get('subrubro') || searchParams.get('subcategoria') || undefined;
    
    // Marcas múltiples: ?marca=Spartan,Ecolab o ?marcas=Spartan&marcas=Ecolab
    const marcasParam = searchParams.get('marcas') || searchParams.get('marca') || undefined;
    const marcas = marcasParam ? marcasParam.split(',').map((m) => m.trim()).filter(Boolean) : undefined;

    const precioMin = searchParams.get('precio_min') ? Number(searchParams.get('precio_min')) : undefined;
    const precioMax = searchParams.get('precio_max') ? Number(searchParams.get('precio_max')) : undefined;
    const q = searchParams.get('q') || undefined;
    const orden = (searchParams.get('orden') as any) || undefined;
    const pagina = searchParams.get('pagina') ? Number(searchParams.get('pagina')) : 1;
    const limite = searchParams.get('limite') ? Number(searchParams.get('limite')) : 12;

    const data = await getBackendCatalog({
      rubroSlug,
      subrubroSlug,
      marcas,
      precioMin,
      precioMax,
      q,
      orden,
      pagina,
      limite,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en API /api/products:', error);
    return NextResponse.json(
      { error: 'Error al consultar catálogo' },
      { status: 500 }
    );
  }
}
