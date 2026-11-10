import type { Metadata, Viewport } from "next";

import "../globals.css";
import { ClinicJsonLd } from "@/components/clinic-jsonld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { getDictionary, isLocale } from "@/content/dictionary";
import { clinic, siteUrl } from "@/lib/clinic";
import { fontClassName } from "@/lib/fonts";

export const viewport: Viewport = {
  themeColor: "#100e0c",
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const url = siteUrl();

  return {
    metadataBase: new URL(url),
    title: { default: dict.meta.title, template: `%s | ${dict.meta.short}` },
    description: dict.meta.description,
    applicationName: clinic.nameEn,
    alternates: {
      canonical: `/${locale}`,
      languages: { ar: "/ar", en: "/en", "x-default": "/ar" },
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_JO" : "en_US",
      url: `/${locale}`,
      title: dict.meta.title,
      description: dict.meta.description,
      siteName: clinic.nameAr,
      images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: clinic.nameAr }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/brand/og.png"],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    return (
      <html lang="ar" dir="rtl" className={fontClassName}>
        <body className="grid min-h-full place-items-center bg-ivory p-8 text-center">
          <p className="text-2xl">الصفحة غير موجودة</p>
        </body>
      </html>
    );
  }

  const dict = getDictionary(raw);

  return (
    <html lang={raw} dir={raw === "ar" ? "rtl" : "ltr"} className={`${fontClassName} h-full`}>
      <body className={`locale-${raw} flex min-h-full flex-col bg-ivory pb-24 text-ink antialiased`}>
        <a className="skip-link" href="#content">
          {dict.skip}
        </a>
        <SiteHeader locale={raw} dict={dict} />
        <main id="content" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={raw} dict={dict} />
        <WhatsAppFloat locale={raw} label={dict.whatsappFloat} />
        <ClinicJsonLd />
      </body>
    </html>
  );
}
