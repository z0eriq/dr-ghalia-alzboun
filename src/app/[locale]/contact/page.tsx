import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClinicMap } from "@/components/clinic-map";
import { ContactForm } from "@/components/contact-form";
import { getDictionary, isLocale } from "@/content/dictionary";
import { clinic, mapsSearchUrl } from "@/lib/clinic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  return {
    title: dict.contactPage.title,
    description: dict.contactPage.lead,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { ar: "/ar/contact", en: "/en/contact", "x-default": "/ar/contact" },
    },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const dict = getDictionary(raw);

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="font-latin text-sm tracking-[0.28em] text-gold-deep">{clinic.tagline}</p>
        <h1 className="mt-3 text-5xl leading-tight">{dict.contactPage.title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted">{dict.contactPage.lead}</p>
        <ul className="mt-8 grid gap-3 text-base font-semibold">
          <li>{raw === "ar" ? clinic.hoursAr : clinic.hoursEn}</li>
          <li>
            <a href={clinic.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-gold-deep underline-offset-4 hover:underline">
              {raw === "ar" ? clinic.addressAr : clinic.addressEn}
            </a>
          </li>
          <li>
            <a href={`tel:${clinic.phoneE164}`} dir="ltr" className="inline-block text-gold-deep">
              {clinic.phoneDisplay}
            </a>
          </li>
          <li>
            <a href={clinic.instagram} target="_blank" rel="noopener noreferrer" className="text-gold-deep">
              {clinic.instagramHandle}
            </a>
          </li>
        </ul>
        <a href={mapsSearchUrl()} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex font-bold text-ink">
          {dict.visit.directions}
        </a>
        <div className="mt-6">
          <ClinicMap locale={raw} title={dict.visit.map} className="min-h-64" />
        </div>
      </div>
      <ContactForm locale={raw} copy={dict.contact} errors={dict.errors} />
    </section>
  );
}
