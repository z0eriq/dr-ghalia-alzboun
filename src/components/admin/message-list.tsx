"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { formatDateTime } from "@/lib/time";
import type { ContactMessageDto } from "@/lib/types";
import { whatsAppLink } from "@/lib/whatsapp";

export function MessageList({ messages }: { messages: ContactMessageDto[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState("");

  async function mark(id: string, isRead: boolean) {
    setPendingId(id);
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead }),
    });
    setPendingId("");
    router.refresh();
  }

  if (messages.length === 0) {
    return <p className="rounded-3xl border border-dashed border-stone bg-paper px-5 py-10 text-muted">لا توجد رسائل.</p>;
  }

  return (
    <ul className="grid gap-4">
      {messages.map((message) => (
        <li key={message.id} className="rounded-3xl border border-stone bg-paper p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl">{message.name}</h2>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${message.isRead ? "bg-stone" : "bg-gold"}`}>
              {message.isRead ? "مقروءة" : "جديدة"}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted" dir="ltr">{message.phone}</p>
          <p className="mt-1 text-xs text-muted">{formatDateTime(new Date(message.createdAt))}</p>
          <p className="mt-4 leading-8">{message.message}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={whatsAppLink(message.phone, `السلام عليكم ${message.name}، معكم عيادة الدكتورة غالية الزبون بخصوص رسالتكم.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center rounded-full bg-[#1f7a43] px-4 text-sm font-bold text-white"
            >
              رد عبر واتساب
            </a>
            <button
              type="button"
              disabled={pendingId === message.id}
              onClick={() => mark(message.id, !message.isRead)}
              className="min-h-10 rounded-full border border-stone px-4 text-sm font-bold disabled:opacity-60"
            >
              {message.isRead ? "تعليم كجديدة" : "تعليم كمقروءة"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
