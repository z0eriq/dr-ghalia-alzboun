"use client";

import { useEffect, useState } from "react";

import type { Dictionary } from "@/content/dictionary";
import { formatDate, formatTime } from "@/lib/time";
import type { Locale } from "@/lib/types";

type Copy = Dictionary["book"];
type Errors = Dictionary["errors"];
type ServiceOption = { slug: string; title: string; summary: string };
type Slot = { time: string; available: boolean };
type Success = {
  reference: string;
  serviceName: string;
  date: string;
  time: string;
  whatsappUrl: string;
};

export function BookForm({
  locale,
  copy,
  errors,
  services,
  minDate,
  maxDate,
  initialService,
}: {
  locale: Locale;
  copy: Copy;
  errors: Errors;
  services: ServiceOption[];
  minDate: string;
  maxDate: string;
  initialService: string;
}) {
  const startingService = services.some((service) => service.slug === initialService)
    ? initialService
    : (services[0]?.slug ?? "");

  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceSlug, setServiceSlug] = useState(startingService);
  const [trackedService, setTrackedService] = useState(startingService);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [slotResult, setSlotResult] = useState<{ date: string; slots: Slot[]; failed: boolean } | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<Success | null>(null);

  if (startingService !== trackedService) {
    setTrackedService(startingService);
    setServiceSlug(startingService);
  }

  useEffect(() => {
    if (!date) return;
    const controller = new AbortController();

    fetch(`/api/appointments/slots?date=${encodeURIComponent(date)}`, { signal: controller.signal })
      .then(async (response) => {
        const body = (await response.json()) as { ok?: boolean; slots?: Slot[] };
        if (!response.ok || !body.ok || !body.slots) throw new Error("slots");
        setSlotResult({ date, slots: body.slots, failed: false });
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setSlotResult({ date, slots: [], failed: true });
      });

    return () => controller.abort();
  }, [date]);

  const slots = slotResult?.date === date ? slotResult.slots : [];
  const slotsStatus = !date ? "idle" : slotResult?.date === date ? (slotResult.failed ? "error" : "ready") : "loading";

  const selected = services.find((service) => service.slug === serviceSlug);
  const openSlots = slots.filter((slot) => slot.available);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName,
          phone,
          serviceSlug,
          date,
          time,
          notes,
          locale,
          websiteUrl,
        }),
      });
      const body = (await response.json()) as {
        ok?: boolean;
        error?: string;
        ignored?: boolean;
        whatsappUrl?: string;
        appointment?: { reference: string; serviceName: string; date: string; time: string };
      };

      if (body.ignored) {
        setSuccess({
          reference: "",
          serviceName: selected?.title ?? "",
          date,
          time,
          whatsappUrl: body.whatsappUrl ?? "",
        });
        return;
      }

      if (!response.ok || !body.ok || !body.appointment || !body.whatsappUrl) {
        setError(errors[mapError(body.error)]);
        return;
      }

      setSuccess({
        reference: body.appointment.reference,
        serviceName: body.appointment.serviceName,
        date: body.appointment.date,
        time: body.appointment.time,
        whatsappUrl: body.whatsappUrl,
      });
    } catch {
      setError(errors.server);
    } finally {
      setPending(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-3xl border border-gold/40 bg-paper p-6 sm:p-8" role="status">
        <h2 className="text-3xl">{copy.successTitle}</h2>
        <p className="mt-3 leading-8 text-muted">{copy.successLead}</p>
        {success.reference ? (
          <dl className="mt-6 grid gap-3 rounded-2xl bg-ivory p-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">{copy.reference}</dt>
              <dd className="font-bold" dir="ltr">{success.reference}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">{copy.service}</dt>
              <dd className="font-bold">{success.serviceName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">{copy.date}</dt>
              <dd className="font-bold">{formatDate(success.date, locale)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">{copy.time}</dt>
              <dd className="font-bold" dir="ltr">{formatTime(success.time, locale)}</dd>
            </div>
          </dl>
        ) : null}
        {success.whatsappUrl ? (
          <a
            href={success.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#1f7a43] px-5 text-sm font-bold text-white sm:w-auto"
          >
            {copy.sendWhatsapp}
          </a>
        ) : null}
        <p className="mt-3 text-sm leading-6 text-muted">{copy.whatsappHint}</p>
        <button
          type="button"
          className="mt-5 text-sm font-bold text-gold-deep"
          onClick={() => setSuccess(null)}
        >
          {copy.another}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative grid gap-5 rounded-3xl border border-stone bg-paper p-5 sm:p-7" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          {copy.name}
          <input className="field" name="name" autoComplete="name" required maxLength={80} value={patientName} onChange={(event) => setPatientName(event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          {copy.phone}
          <input className="field" name="tel" type="tel" inputMode="tel" dir="ltr" autoComplete="tel" required value={phone} onChange={(event) => setPhone(event.target.value)} />
          <span className="text-xs font-medium text-muted">{copy.phoneHint}</span>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-semibold">
        {copy.service}
        <select className="field" name="service" required value={serviceSlug} onChange={(event) => setServiceSlug(event.target.value)}>
          {services.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.title}
            </option>
          ))}
        </select>
        {selected ? <span className="text-xs font-medium leading-6 text-muted">{selected.summary}</span> : null}
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          {copy.date}
          <input
            className="field"
            type="date"
            name="date"
            dir="ltr"
            required
            min={minDate}
            max={maxDate}
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setTime("");
            }}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          {copy.time}
          <select className="field" name="time" dir="ltr" required value={time} disabled={!date || slotsStatus !== "ready" || openSlots.length === 0} onChange={(event) => setTime(event.target.value)}>
            <option value="">{slotsStatus === "loading" ? copy.loadingSlots : copy.timePlaceholder}</option>
            {openSlots.map((slot) => (
              <option key={slot.time} value={slot.time}>
                {formatTime(slot.time, locale)}
              </option>
            ))}
          </select>
          {slotsStatus === "ready" && openSlots.length === 0 ? <span className="text-xs font-medium text-red-800">{copy.noSlots}</span> : null}
          {!date ? <span className="text-xs font-medium text-muted">{copy.chooseDate}</span> : null}
          {slotsStatus === "error" ? <span className="text-xs font-medium text-red-800">{errors.server}</span> : null}
        </label>
      </div>

      <label className="grid gap-2 text-sm font-semibold">
        {copy.notes}
        <textarea className="field min-h-28 resize-y" name="notes" maxLength={500} placeholder={copy.notesPlaceholder} value={notes} onChange={(event) => setNotes(event.target.value)} />
      </label>

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={websiteUrl} onChange={(event) => setWebsiteUrl(event.target.value)} />
        </label>
      </div>

      {error ? (
        <p role="alert" className="text-sm font-semibold text-red-800">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || !time}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-gold px-6 text-sm font-bold text-ink hover:bg-gold-bright disabled:opacity-60"
      >
        {pending ? copy.sending : copy.submit}
      </button>
    </form>
  );
}

function mapError(code: string | undefined): keyof Errors {
  if (code === "INVALID_INPUT") return "invalid";
  if (code === "SLOT_TAKEN") return "taken";
  if (code === "SLOT_CLOSED") return "closed";
  if (code === "RATE_LIMITED") return "rate";
  return "server";
}
