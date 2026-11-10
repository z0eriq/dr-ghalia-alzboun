import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localePath } from "@/content/dictionary";
import { localizedServices } from "@/content/services";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  return {
    title: dict.servicesPage.title,
    description: dict.servicesPage.lead,
    alternates: {
      canonical: `/${locale}/services`,
      languages: { ar: "/ar/services", en: "/en/services", "x-default": "/ar/services" },
    },
  };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const dict = getDictionary(raw);
  const services = localizedServices(raw);

  return (
    <section className="mx-auto w-full max-w-4xl px-5 py-14">
      <p className="font-latin text-sm tracking-[0.28em] text-gold-deep">{dict.servicesSection.eyebrow}</p>
      <h1 className="mt-3 text-5xl leading-tight">{dict.servicesPage.title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{dict.servicesPage.lead}</p>
      <div className="mt-12 grid gap-8">
        {services.map((service, index) => (
          <article key={service.slug} id={service.slug} className="scroll-mt-28 rounded-3xl border border-stone bg-paper p-6 sm:p-8">
            <p className="font-latin text-sm text-gold-deep">{String(index + 1).padStart(2, "0")}</p>
            <h2 className="mt-2 text-3xl">{service.title}</h2>
            <p className="mt-4 leading-8">{service.summary}</p>
            <p className="mt-3 leading-8 text-muted">{service.detail}</p>
            <Link href={`${localePath(raw, "/book")}?service=${service.slug}`} className="mt-5 inline-flex min-h-11 items-center font-bold text-gold-deep">
              {dict.servicesSection.book}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
