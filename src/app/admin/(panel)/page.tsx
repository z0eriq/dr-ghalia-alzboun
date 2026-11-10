import Link from "next/link";
import { connection } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { formatTime, todayInAmman } from "@/lib/time";

const statusLabel = {
  PENDING: "بانتظار التأكيد",
  CONFIRMED: "مؤكد",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغى",
  NO_SHOW: "لم يحضر",
} as const;

export default async function AdminHomePage() {
  await connection();
  await requireAdmin();
  const today = todayInAmman();
  const [pending, todayCount, confirmed, todayRows, unread] = await Promise.all([
    prisma.appointment.count({ where: { status: "PENDING" } }),
    prisma.appointment.count({ where: { date: today, status: { not: "CANCELLED" } } }),
    prisma.appointment.count({ where: { date: { gte: today }, status: "CONFIRMED" } }),
    prisma.appointment.findMany({
      where: { date: today, status: { not: "CANCELLED" } },
      orderBy: { time: "asc" },
    }),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);

  return (
    <section>
      <h1 className="text-4xl">مواعيد اليوم</h1>
      <p className="mt-2 text-sm text-muted">الطلبات الجديدة تبقى بانتظار التأكيد حتى ترد العيادة على واتساب.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="بانتظار التأكيد" value={pending} href="/admin/appointments?view=pending" />
        <Stat label="مواعيد اليوم" value={todayCount} href="/admin/appointments?view=today" />
        <Stat label="مؤكدة قادمة" value={confirmed} href="/admin/appointments?view=upcoming" />
        <Stat label="رسائل غير مقروءة" value={unread} href="/admin/messages" />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl">جدول اليوم</h2>
        {todayRows.length === 0 ? (
          <p className="mt-4 rounded-3xl border border-dashed border-stone bg-paper px-5 py-8 text-muted">لا توجد مواعيد محفوظة لهذا اليوم.</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {todayRows.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-stone bg-paper px-4 py-4">
                <div>
                  <p className="font-bold">{row.patientName}</p>
                  <p className="text-sm text-muted">{row.serviceName}</p>
                </div>
                <p className="font-bold" dir="ltr">{formatTime(row.time, "ar")}</p>
                <p className="text-sm font-semibold">{statusLabel[row.status]}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="rounded-3xl border border-stone bg-paper p-5 hover:border-gold">
      <p className="text-sm font-semibold text-muted">{label}</p>
      <p className="mt-2 text-4xl font-bold">{value}</p>
    </Link>
  );
}
