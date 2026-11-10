"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { formatDate, formatTime } from "@/lib/time";
import type { AppointmentDto, AppointmentStatus } from "@/lib/types";
import { cancellationMessage, confirmationMessage, whatsAppLink } from "@/lib/whatsapp";

const labels: Record<AppointmentStatus, string> = {
  PENDING: "بانتظار التأكيد",
  CONFIRMED: "مؤكد",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغى",
  NO_SHOW: "لم يحضر",
};

const tones: Record<AppointmentStatus, string> = {
  PENDING: "bg-amber-100 text-amber-950",
  CONFIRMED: "bg-emerald-100 text-emerald-950",
  COMPLETED: "bg-stone text-ink",
  CANCELLED: "bg-red-100 text-red-950",
  NO_SHOW: "bg-orange-100 text-orange-950",
};

export function AppointmentBoard({ appointments }: { appointments: AppointmentDto[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  async function update(id: string, body: { status?: AppointmentStatus; staffNote?: string }) {
    setPendingId(id);
    setError("");
    try {
      const response = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error === "SLOT_TAKEN" ? "هذا الوقت محجوز لموعد آخر." : "تعذر تحديث الموعد.");
        return;
      }
      router.refresh();
    } catch {
      setError("تعذر تحديث الموعد.");
    } finally {
      setPendingId("");
    }
  }

  if (appointments.length === 0) {
    return <p className="rounded-3xl border border-dashed border-stone bg-paper px-5 py-10 text-muted">لا توجد مواعيد في هذا العرض.</p>;
  }

  return (
    <div className="grid gap-4">
      {error ? <p role="alert" className="text-sm font-semibold text-red-800">{error}</p> : null}
      {appointments.map((item) => {
        const messageInput = {
          patientName: item.patientName,
          serviceName: item.serviceName,
          date: item.date,
          time: item.time,
        };
        const confirmHref = whatsAppLink(item.phone, confirmationMessage(messageInput));
        const cancelHref = whatsAppLink(item.phone, cancellationMessage(messageInput));
        const note = notes[item.id] ?? item.staffNote ?? "";
        const busy = pendingId === item.id;

        return (
          <article key={item.id} className="rounded-3xl border border-stone bg-paper p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-gold-deep" dir="ltr">{item.reference}</p>
                <h2 className="mt-1 text-2xl">{item.patientName}</h2>
                <p className="text-sm text-muted">{item.serviceName}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${tones[item.status]}`}>{labels[item.status]}</span>
            </div>
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted">التاريخ</dt>
                <dd className="font-semibold">{formatDate(item.date, "ar")}</dd>
              </div>
              <div>
                <dt className="text-muted">الوقت</dt>
                <dd className="font-semibold" dir="ltr">{formatTime(item.time, "ar")}</dd>
              </div>
              <div>
                <dt className="text-muted">الهاتف</dt>
                <dd>
                  <a className="font-semibold" dir="ltr" href={`tel:+962${item.phone.slice(1)}`}>{item.phone}</a>
                </dd>
              </div>
            </dl>
            {item.notes ? <p className="mt-3 rounded-2xl bg-ivory px-3 py-2 text-sm leading-6">ملاحظة المراجع: {item.notes}</p> : null}
            <label className="mt-4 grid gap-2 text-sm font-semibold">
              ملاحظة العيادة
              <textarea
                className="field min-h-20"
                value={note}
                maxLength={1000}
                onChange={(event) => setNotes((current) => ({ ...current, [item.id]: event.target.value }))}
              />
            </label>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" disabled={busy} onClick={() => update(item.id, { status: "CONFIRMED" })} className="min-h-10 rounded-full bg-emerald-800 px-4 text-sm font-bold text-white disabled:opacity-60">تأكيد</button>
              <a href={confirmHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center rounded-full bg-[#1f7a43] px-4 text-sm font-bold text-white">واتساب التأكيد</a>
              <button type="button" disabled={busy} onClick={() => update(item.id, { status: "COMPLETED" })} className="min-h-10 rounded-full bg-ink px-4 text-sm font-bold text-ivory disabled:opacity-60">مكتمل</button>
              <button type="button" disabled={busy} onClick={() => update(item.id, { status: "NO_SHOW" })} className="min-h-10 rounded-full border border-stone px-4 text-sm font-bold disabled:opacity-60">لم يحضر</button>
              <button type="button" disabled={busy} onClick={() => update(item.id, { status: "CANCELLED" })} className="min-h-10 rounded-full border border-red-200 px-4 text-sm font-bold text-red-900 disabled:opacity-60">إلغاء</button>
              <a href={cancelHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center rounded-full border border-stone px-4 text-sm font-bold">واتساب الاعتذار</a>
              <button type="button" disabled={busy} onClick={() => update(item.id, { staffNote: note })} className="min-h-10 rounded-full border border-gold px-4 text-sm font-bold text-gold-deep disabled:opacity-60">حفظ الملاحظة</button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
