import { prisma } from "./prisma";

async function main() {
  const total = await prisma.universidade.count();
  const lista = await prisma.universidade.findMany({
    take: 3,
    select: { nome: true, cidade: true },
  });
  console.log("Universidades:", total);
  console.log(lista);
}

main().finally(() => prisma.$disconnect());