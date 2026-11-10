import Link from "next/link";

import { getDictionary, isLocale, localePath } from "@/content/dictionary";

export default async function NotFound({ params }: { params?: Promise<{ locale?: string }> }) {
  const resolved = params ? await params : undefined;
  const locale = resolved?.locale && isLocale(resolved.locale) ? resolved.locale : "ar";
  const dict = getDictionary(locale);

  return (
    <section className="mx-auto w-full max-w-xl px-5 py-24 text-center">
      <h1 className="text-5xl">{dict.notFound.title}</h1>
      <p className="mt-4 text-lg leading-8 text-muted">{dict.notFound.lead}</p>
      <Link href={localePath(locale)} className="mt-6 inline-flex min-h-12 items-center rounded-full bg-gold px-6 text-sm font-bold text-ink">
        {dict.notFound.home}
      </Link>
    </section>
  );
}
