import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { BookForm } from "@/components/book-form";
import { getDictionary, isLocale } from "@/content/dictionary";
import { localizedServices } from "@/content/services";
import { clinic } from "@/lib/clinic";
import { addDays, todayInAmman } from "@/lib/time";
import { clinicInquiryLink } from "@/lib/whatsapp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  return {
    title: dict.book.title,
    description: dict.book.lead,
    alternates: {
      canonical: `/${locale}/book`,
      languages: { ar: "/ar/book", en: "/en/book", "x-default": "/ar/book" },
    },
  };
}

async function Booking({
  locale,
  searchParams,
}: {
  locale: "ar" | "en";
  searchParams: Promise<{ service?: string }>;
}) {
  await connection();
  const requestedService = (await searchParams).service ?? "";
  const dict = getDictionary(locale);
  const today = todayInAmman();
  return (
    <BookForm
      locale={locale}
      copy={dict.book}
      errors={dict.errors}
      services={localizedServices(locale)}
      minDate={today}
      maxDate={addDays(today, clinic.bookingWindowDays)}
      initialService={requestedService}
    />
  );
}

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const dict = getDictionary(raw);

  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-14">
      <p className="font-latin text-sm tracking-[0.28em] text-gold-deep">{clinic.tagline}</p>
      <h1 className="mt-3 text-5xl leading-tight">{dict.book.title}</h1>
      <p className="mt-4 text-lg leading-8 text-muted">{dict.book.lead}</p>
      <div className="mt-8">
        <Suspense fallback={<div className="h-96 rounded-3xl border border-stone bg-paper" />}>
          <Booking locale={raw} searchParams={searchParams} />
        </Suspense>
      </div>
      <p className="mt-6 text-sm leading-7 text-muted">
        {dict.book.fallback}{" "}
        <a href={clinicInquiryLink(raw)} target="_blank" rel="noopener noreferrer" className="font-bold text-gold-deep">
          {dict.hero.whatsapp}
        </a>
      </p>
    </section>
  );
}
