import { clinic, siteUrl } from "@/lib/clinic";

export function ClinicJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: clinic.nameAr,
    alternateName: `${clinic.nameEn} Dental Clinic`,
    url: siteUrl(),
    telephone: clinic.phoneE164,
    image: `${siteUrl()}/brand/og.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "بجانب صيدلية مزبار",
      addressLocality: clinic.localityAr,
      addressCountry: clinic.country,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "10:00",
      closes: "20:00",
    },
    sameAs: [clinic.instagram],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
