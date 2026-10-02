import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando script de Seed...');
  
  // Aquí habíamos dejado los comentarios y la lógica para el archivo excel
  // y para popular datos base de prueba.

  console.log('✅ Seeding completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
