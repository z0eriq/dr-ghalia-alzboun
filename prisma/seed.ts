import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

loadEnvConfig(process.cwd());

async function main() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "د. غالية الزبون";

  if (!accountId || !databaseId || !token) {
    throw new Error("Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, and CLOUDFLARE_API_TOKEN.");
  }
  if (!email || !password || password.length < 10) {
    throw new Error("Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 10 characters.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const now = new Date().toISOString();
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql: `INSERT INTO Admin (id, email, passwordHash, name, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, ?, ?)
              ON CONFLICT(email) DO UPDATE SET
                passwordHash = excluded.passwordHash,
                name = excluded.name,
                updatedAt = excluded.updatedAt`,
        params: [randomUUID(), email, passwordHash, name, now, now],
      }),
    },
  );
  const body = (await response.json()) as { success?: boolean; errors?: Array<{ message?: string }> };
  if (!response.ok || body.success === false) {
    throw new Error(body.errors?.map((error) => error.message).filter(Boolean).join("; ") || "Could not save the admin.");
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Seed failed.");
  process.exit(1);
});
