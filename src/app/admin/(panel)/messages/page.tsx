import { connection } from "next/server";

import { MessageList } from "@/components/admin/message-list";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import type { ContactMessageDto } from "@/lib/types";

export default async function MessagesPage() {
  await connection();
  await requireAdmin();
  const rows = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  const messages: ContactMessageDto[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phone,
    message: row.message,
    isRead: row.isRead,
    createdAt: row.createdAt.toISOString(),
  }));

  return (
    <section>
      <h1 className="text-4xl">رسائل الموقع</h1>
      <p className="mt-2 text-sm text-muted">الرسائل المحفوظة من صفحة التواصل، مع رد جاهز على واتساب.</p>
      <div className="mt-6">
        <MessageList messages={messages} />
      </div>
    </section>
  );
}
