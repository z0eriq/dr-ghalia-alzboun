import Image from "next/image";
import Link from "next/link";

import { localePath, type Dictionary } from "@/content/dictionary";
import { clinic } from "@/lib/clinic";
import type { Locale } from "@/lib/types";

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const links = [
    { href: localePath(locale), label: dict.nav.home },
    { href: localePath(locale, "/services"), label: dict.nav.services },
    { href: localePath(locale, "/about"), label: dict.nav.about },
    { href: localePath(locale, "/contact"), label: dict.nav.contact },
    { href: localePath(locale, "/book"), label: dict.nav.book },
  ];

  return (
    <footer className="mt-auto bg-ink text-ivory">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.3fr_0.7fr_1fr]">
        <div>
          <Image
            src="/brand/logo.png"
            alt={locale === "ar" ? clinic.nameAr : clinic.nameEn}
            width={961}
            height={682}
            className="h-36 w-auto sm:h-40"
            style={{ width: "auto", height: "9rem" }}
          />
          <a
            href={clinic.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block max-w-sm text-sm leading-7 text-ivory/75 underline-offset-4 hover:text-ivory hover:underline"
          >
            {locale === "ar" ? clinic.addressAr : clinic.addressEn}
          </a>
        </div>
        <nav aria-label={dict.footer.nav}>
          <h2 className="font-latin text-sm tracking-[0.22em] text-gold-bright">{dict.footer.nav}</h2>
          <ul className="mt-4 grid gap-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-ivory/80 hover:text-ivory">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="font-latin text-sm tracking-[0.22em] text-gold-bright">{dict.footer.visit}</h2>
          <ul className="mt-4 grid gap-2 text-sm text-ivory/80">
            <li>{locale === "ar" ? clinic.hoursAr : clinic.hoursEn}</li>
            <li>
              <a href={`tel:${clinic.phoneE164}`} className="hover:text-ivory">
                {clinic.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={clinic.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-ivory">
                {clinic.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 text-xs text-ivory/60">
          <p>{dict.footer.rights}</p>
          <Link href="/admin/login" className="hover:text-ivory">
            {dict.footer.staff}
          </Link>
        </div>
      </div>
    </footer>
  );
}
