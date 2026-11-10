import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE, verifyAdminToken, type AdminSession } from "@/lib/jwt";

export async function readAdminSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await readAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
