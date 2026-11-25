import { NextResponse } from 'next/server';
import { prisma } from '@/backend/db/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body?.email;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Por favor, ingresá un correo electrónico válido.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Consultar si el correo existe en la base de datos
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No encontramos ninguna cuenta registrada con este correo electrónico.' },
        { status: 404 }
      );
    }

    // Aquí se generaría el token temporal y el envío del correo electrónico.
    return NextResponse.json({
      success: true,
      message: 'Te enviamos un correo electrónico con las instrucciones para restablecer tu contraseña.',
    });
  } catch (error) {
    console.error('Error en recuperación de contraseña:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar la solicitud. Por favor, intentá nuevamente.' },
      { status: 500 }
    );
  }
}
