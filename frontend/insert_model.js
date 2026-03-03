const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.instrumentModel.create({
    data: {
      id: 'train_1772500430490',
      name: 'Bolero_ADN_V1',
      description: 'Modelo Entrenado con mis Stems',
      tags: ['Bolero', 'Bachata'],
      baseModel: 'Dagraba-V1',
    }
  });
  console.log("Model inserted.");
}
main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); });
