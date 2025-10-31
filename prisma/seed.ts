import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.project.createMany({
    data: [
      { name: "CRM Dashboard" },
      { name: "POS Tester" },
      { name: "Analytics Tool" },
    ],
  });
}

main().then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
