"use client";

import { useState } from "react";

import { clinicInquiryLink } from "@/lib/whatsapp";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/lib/types";

type Copy = Dictionary["contact"];
type Errors = Dictionary["errors"];

export function ContactForm({
  locale,
  copy,
  errors,
}: {
  locale: Locale;
  copy: Copy;
  errors: Errors;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState<{ whatsappUrl: string } | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, message, websiteUrl }),
      });
      const body = (await response.json()) as { ok?: boolean; error?: string; whatsappUrl?: string };
      if (!response.ok || !body.ok || !body.whatsappUrl) {
        setError(errors[mapError(body.error)] ?? errors.server);
        return;
      }
      setSent({ whatsappUrl: body.whatsappUrl });
    } catch {
      setError(errors.server);
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-3xl border border-stone bg-paper p-6" role="status">
        <p className="text-lg font-bold">{copy.success}</p>
        <a
          href={sent.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#1f7a43] px-5 text-sm font-bold text-white"
        >
          {copy.whatsapp}
        </a>
        <button
          type="button"
          className="mt-4 block text-sm font-semibold text-gold-deep"
          onClick={() => {
            setSent(null);
            setMessage("");
          }}
        >
          {copy.another}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative grid gap-4 rounded-3xl border border-stone bg-paper p-5 sm:p-6" noValidate>
      <label className="grid gap-2 text-sm font-semibold">
        {copy.name}
        <input className="field" name="name" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        {copy.phone}
        <input className="field" name="tel" type="tel" dir="ltr" autoComplete="tel" required value={phone} onChange={(event) => setPhone(event.target.value)} />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        {copy.message}
        <textarea className="field min-h-32 resize-y" name="message" required value={message} onChange={(event) => setMessage(event.target.value)} />
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
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-5 text-sm font-bold text-ivory disabled:opacity-60"
      >
        {pending ? copy.sending : copy.submit}
      </button>
      <a href={clinicInquiryLink(locale)} className="text-sm font-semibold text-gold-deep" target="_blank" rel="noopener noreferrer">
        {copy.whatsapp}
      </a>
    </form>
  );
}

function mapError(code: string | undefined): keyof Errors {
  if (code === "INVALID_INPUT") return "invalid";
  if (code === "RATE_LIMITED") return "rate";
  return "server";
}
