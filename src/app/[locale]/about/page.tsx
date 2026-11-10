import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, localePath } from "@/content/dictionary";
import { clinic } from "@/lib/clinic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  return {
    title: dict.aboutPage.title,
    description: dict.aboutPage.lead,
    alternates: {
      canonical: `/${locale}/about`,
      languages: { ar: "/ar/about", en: "/en/about", "x-default": "/ar/about" },
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const dict = getDictionary(raw);

  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-14">
      <p className="font-latin text-sm tracking-[0.28em] text-gold-deep">{clinic.tagline}</p>
      <h1 className="mt-3 text-5xl leading-tight">{dict.aboutPage.title}</h1>
      <p className="mt-5 text-lg leading-9">{dict.aboutPage.lead}</p>
      <h2 className="mt-12 text-3xl">{dict.aboutPage.expectTitle}</h2>
      <ul className="mt-5 grid gap-4">
        {dict.aboutPage.expect.map((item) => (
          <li key={item} className="rounded-3xl border border-stone bg-paper px-5 py-4 leading-8">
            {item}
          </li>
        ))}
      </ul>
      <dl className="mt-10 grid gap-4 sm:grid-cols-3">
        <Fact label={dict.hero.hoursLabel} value={raw === "ar" ? clinic.hoursAr : clinic.hoursEn} />
        <Fact label={dict.hero.placeLabel} value={raw === "ar" ? clinic.addressAr : clinic.addressEn} href={clinic.mapsUrl} />
        <Fact label={dict.hero.phoneLabel} value={clinic.phoneDisplay} />
      </dl>
      <Link href={localePath(raw, "/book")} className="mt-8 inline-flex min-h-12 items-center rounded-full bg-gold px-6 text-sm font-bold text-ink">
        {dict.nav.book}
      </Link>
    </section>
  );
}

function Fact({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="rounded-3xl bg-ink px-4 py-5 text-ivory">
      <dt className="text-xs font-bold text-gold-bright">{label}</dt>
      <dd className="mt-2 text-sm font-semibold leading-6">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-gold-bright hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
