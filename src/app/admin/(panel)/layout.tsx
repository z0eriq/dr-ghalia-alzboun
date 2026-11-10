import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

import { LogoutButton } from "@/components/admin/logout-button";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

const links = [
  { href: "/admin", label: "اليوم" },
  { href: "/admin/appointments", label: "المواعيد" },
  { href: "/admin/messages", label: "الرسائل" },
];

async function UnreadBadge() {
  await connection();
  await requireAdmin();
  const count = await prisma.contactMessage.count({ where: { isRead: false } });
  if (count === 0) return null;
  return <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-ink">{count}</span>;
}

export const instant = false;

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory md:grid md:grid-cols-[250px_1fr]">
      <aside className="bg-ink text-ivory">
        <div className="px-5 py-5">
          <p className="font-latin text-xs tracking-[0.28em] text-gold-bright">DENTAL CLINIC</p>
          <p className="mt-2 text-lg font-bold">د. غالية الزبون</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-3 pb-4 md:grid md:px-3" aria-label="لوحة العيادة">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="flex items-center gap-2 whitespace-nowrap rounded-2xl px-3 py-3 text-sm font-semibold hover:bg-white/5">
              {link.label}
              {link.href === "/admin/messages" ? (
                <Suspense fallback={null}>
                  <UnreadBadge />
                </Suspense>
              ) : null}
            </Link>
          ))}
          <Link href="/ar" className="whitespace-nowrap rounded-2xl px-3 py-3 text-sm font-semibold text-ivory/70 hover:bg-white/5">
            عرض الموقع
          </Link>
        </nav>
        <div className="px-4 pb-5 md:mt-6">
          <LogoutButton />
        </div>
      </aside>
      <div className="px-4 py-6 md:px-8">{children}</div>
    </div>
  );
}
