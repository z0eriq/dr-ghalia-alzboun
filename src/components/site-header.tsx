"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { localePath, switchLocale, type Dictionary } from "@/content/dictionary";
import { clinic } from "@/lib/clinic";
import type { Locale } from "@/lib/types";

function isCurrent(pathname: string, href: string, locale: Locale) {
  if (href === `/${locale}`) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const links = [
    { href: localePath(locale), label: dict.nav.home },
    { href: localePath(locale, "/services"), label: dict.nav.services },
    { href: localePath(locale, "/about"), label: dict.nav.about },
    { href: localePath(locale, "/contact"), label: dict.nav.contact },
  ];

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPath(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-ink/95 text-ivory backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-2">
        <Link href={localePath(locale)} className="shrink-0 leading-tight">
          <span className="block font-display text-xl text-gold-bright sm:text-2xl">
            {locale === "ar" ? "د. غالية الزبون" : clinic.nameEn}
          </span>
          <span className="font-latin text-[0.68rem] tracking-[0.28em] text-ivory/70">{clinic.tagline}</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label={dict.footer.nav}>
          {links.map((link) => {
            const current = isCurrent(pathname, link.href, locale);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`text-sm font-semibold ${current ? "text-gold-bright" : "text-ivory/80 hover:text-ivory"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={switchLocale(pathname, locale === "ar" ? "en" : "ar")}
            hrefLang={locale === "ar" ? "en" : "ar"}
            className="hidden rounded-full border border-gold/40 px-3 py-2 text-sm font-semibold text-gold-bright sm:inline-flex"
          >
            {dict.nav.language}
          </Link>
          <Link
            href={localePath(locale, "/book")}
            className="inline-flex min-h-11 items-center rounded-full bg-gold px-4 text-sm font-bold text-ink hover:bg-gold-bright"
          >
            {dict.nav.book}
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-gold/40 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpenPath(open ? null : pathname)}
          >
            <span className="sr-only">{open ? dict.nav.closeMenu : dict.nav.openMenu}</span>
            <span aria-hidden="true" className="flex w-5 flex-col gap-1.5">
              <span className="h-0.5 bg-gold-bright" />
              <span className="h-0.5 bg-gold-bright" />
              <span className="h-0.5 bg-gold-bright" />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" className="border-t border-gold/20 px-5 py-4 lg:hidden" aria-label={dict.footer.nav}>
          <ul className="grid gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="block rounded-2xl px-3 py-3 text-lg font-semibold hover:bg-white/5">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={switchLocale(pathname, locale === "ar" ? "en" : "ar")} className="block rounded-2xl px-3 py-3 text-lg font-semibold text-gold-bright">
                {dict.nav.language}
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
