import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ClinicMap } from "@/components/clinic-map";
import { GoldRule } from "@/components/gold-rule";
import { getDictionary, isLocale, localePath } from "@/content/dictionary";
import { localizedServices } from "@/content/services";
import { clinic, mapsSearchUrl } from "@/lib/clinic";
import { clinicInquiryLink } from "@/lib/whatsapp";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const dict = getDictionary(raw);
  const services = localizedServices(raw);
  const hours = raw === "ar" ? clinic.hoursAr : clinic.hoursEn;
  const place = raw === "ar" ? clinic.addressAr : clinic.addressEn;

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-ivory">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(198,161,90,0.28),transparent_58%)]" />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24">
          <div>
            <p className="font-latin text-sm tracking-[0.35em] text-gold-bright">{dict.hero.eyebrow}</p>
            <GoldRule light />
            <h1 className="mt-5 max-w-xl text-5xl leading-[1.25] sm:text-6xl">{dict.hero.title}</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ivory/80">{dict.hero.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={localePath(raw, "/book")} className="inline-flex min-h-12 items-center rounded-full bg-gold px-6 text-sm font-bold text-ink hover:bg-gold-bright">
                {dict.hero.book}
              </Link>
              <a href={clinicInquiryLink(raw)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-full border border-gold/60 px-6 text-sm font-bold text-gold-bright hover:bg-white/5">
                {dict.hero.whatsapp}
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle,rgba(198,161,90,0.35),transparent_68%)] blur-2xl" />
            <Image
              src="/brand/logo.png"
              alt=""
              width={961}
              height={682}
              priority
              className="relative mx-auto w-full max-w-xs sm:max-w-md"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-8 w-full max-w-6xl px-5" aria-label={dict.visit.eyebrow}>
        <dl className="grid overflow-hidden rounded-3xl border border-stone bg-paper shadow-sm md:grid-cols-3">
          <InfoItem label={dict.hero.hoursLabel} value={hours} />
          <InfoItem label={dict.hero.placeLabel} value={place} href={clinic.mapsUrl} external />
          <InfoItem label={dict.hero.phoneLabel} value={clinic.phoneDisplay} href={`tel:${clinic.phoneE164}`} />
        </dl>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <div className="max-w-2xl">
          <p className="font-latin text-sm tracking-[0.28em] text-gold-deep">{dict.servicesSection.eyebrow}</p>
          <h2 className="mt-3 text-4xl leading-tight">{dict.servicesSection.title}</h2>
          <p className="mt-4 text-lg leading-8 text-muted">{dict.servicesSection.lead}</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {services.map((service, index) => (
            <article key={service.slug} className="rounded-3xl border border-stone bg-paper p-6">
              <p className="font-latin text-sm text-gold-deep">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 text-2xl">{service.title}</h3>
              <p className="mt-3 leading-7 text-muted">{service.summary}</p>
              <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold">
                <Link href={`${localePath(raw, "/services")}#${service.slug}`} className="text-gold-deep">
                  {dict.servicesSection.more}
                </Link>
                <Link href={`${localePath(raw, "/book")}?service=${service.slug}`} className="text-ink">
                  {dict.servicesSection.book}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-ink text-ivory">
        <div className="mx-auto w-full max-w-6xl px-5 py-16">
          <p className="font-latin text-sm tracking-[0.28em] text-gold-bright">{dict.approach.eyebrow}</p>
          <h2 className="mt-3 max-w-xl text-4xl leading-tight">{dict.approach.title}</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {dict.approach.items.map((item, index) => (
              <li key={item.title} className="border-t border-gold/30 pt-5">
                <p className="font-latin text-gold-bright">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-2xl">{item.title}</h3>
                <p className="mt-3 leading-7 text-ivory/75">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-20 md:grid-cols-2">
        <div>
          <p className="font-latin text-sm tracking-[0.28em] text-gold-deep">{dict.visit.eyebrow}</p>
          <h2 className="mt-3 text-4xl leading-tight">{dict.visit.title}</h2>
          <p className="mt-4 text-lg leading-8 text-muted">{dict.visit.lead}</p>
          <a href={mapsSearchUrl()} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center font-bold text-gold-deep">
            {dict.visit.directions}
          </a>
        </div>
        <ClinicMap locale={raw} title={dict.visit.map} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-24">
        <div className="rounded-[2rem] border border-gold/40 bg-paper px-6 py-10 text-center sm:px-12">
          <h2 className="text-4xl">{dict.cta.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-muted">{dict.cta.lead}</p>
          <Link href={localePath(raw, "/book")} className="mt-6 inline-flex min-h-12 items-center rounded-full bg-ink px-6 text-sm font-bold text-ivory">
            {dict.cta.book}
          </Link>
        </div>
      </section>
    </>
  );
}

function InfoItem({
  label,
  value,
  href,
  external = false,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  return (
    <div className="border-b border-stone px-5 py-5 last:border-b-0 md:border-b-0 md:border-e">
      <dt className="text-xs font-bold tracking-wide text-gold-deep">{label}</dt>
      <dd className="mt-2 text-base font-semibold leading-7">
        {href ? (
          <a
            href={href}
            dir={external ? undefined : "ltr"}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="inline-block underline-offset-4 hover:text-gold-deep hover:underline"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
