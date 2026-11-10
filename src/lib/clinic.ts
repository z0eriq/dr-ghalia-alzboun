export const clinic = {
  nameAr: "عيادة الدكتورة غالية الزبون",
  nameEn: "Dr. Ghalia Alzboun",
  tagline: "DENTAL CLINIC",
  phoneLocal: "0791853391",
  phoneDisplay: "0791 853 391",
  phoneE164: "+962791853391",
  whatsappDigits: "962791853391",
  instagram: "https://www.instagram.com/dr.ghaliaalzboon/",
  instagramHandle: "@dr.ghaliaalzboon",
  addressAr: "الضليل / بجانب صيدلية مزبار",
  addressEn: "Al-Dulail, next to Mazbar Pharmacy",
  localityAr: "الضليل",
  localityEn: "Al-Dulail",
  country: "JO",
  mapsUrl: "https://maps.app.goo.gl/zWVXnQ3yvrCA9dGN7?g_st=ic",
  latitude: 32.1107118,
  longitude: 36.2568992,
  hoursAr: "يوميًا من 10:00 صباحًا حتى 8:00 مساءً",
  hoursEn: "Daily, 10:00 AM to 8:00 PM",
  openLabel: "10:00",
  closeLabel: "20:00",
  timezone: "Asia/Amman",
  bookingWindowDays: 60,
  slotMinutes: 30,
} as const;

export function mapsSearchUrl() {
  return clinic.mapsUrl;
}

export function mapsEmbedUrl(locale: "ar" | "en") {
  const language = locale === "ar" ? "ar" : "en";
  const place = "عيادة الدكتوره غاليه الزبون, Dhlail, Jordan";
  return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&hl=${language}&z=17&output=embed`;
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
