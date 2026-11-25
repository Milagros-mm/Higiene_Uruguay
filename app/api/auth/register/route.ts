import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/backend/db/prisma';

const registerSchema = z
  .object({
    name: z.string().min(2, 'El nombre y apellido debe tener al menos 2 caracteres'),
    email: z.string().email('Ingresá un correo electrónico válido'),
    phone: z.string().optional(),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmá tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      const errorMsg = result.error.issues[0]?.message || 'Datos inválidos';
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { name, email, phone, password } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Comprobar si ya existe una cuenta con este email
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta registrada con este correo electrónico.' },
        { status: 409 }
      );
    }

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone?.trim() || null,
        password: hashedPassword,
        role: 'CUSTOMER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: '¡Cuenta creada con éxito!',
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registrando usuario:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar el registro. Por favor, intentá nuevamente.' },
      { status: 500 }
    );
  }
}
