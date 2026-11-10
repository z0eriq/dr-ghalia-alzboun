import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";

loadEnvConfig(process.cwd());

async function main() {
  const { prisma } = await import("../src/lib/prisma");

  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME?.trim() || "د. غالية الزبون";

    if (!email || !password || password.length < 10) {
      throw new Error("Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 10 characters.");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.admin.upsert({
      where: { email },
      update: { passwordHash, name },
      create: { email, passwordHash, name },
    });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
