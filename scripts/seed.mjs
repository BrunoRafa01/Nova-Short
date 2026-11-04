import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || "admin@novaruntime.com";
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || "admin_change_me_123";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      name: "Administrador Geral",
      passwordHash,
      role: "admin",
    },
  });

  console.log(`✔ Administrador inicial verificado: ${admin.email}`);

  // Criar link de exemplo caso banco esteja vazio
  const sampleSlug = "nova-runtime";
  const sample = await prisma.shortLink.upsert({
    where: { slug: sampleSlug },
    update: {},
    create: {
      slug: sampleSlug,
      originalUrl: "https://github.com/BrunoRafa01",
      title: "GitHub Oficial NOVA RUNTIME",
      clicksCount: 42,
    },
  });

  console.log(`✔ Link de exemplo criado: /s/${sample.slug} -> ${sample.originalUrl}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
