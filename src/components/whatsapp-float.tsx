import { clinicInquiryLink } from "@/lib/whatsapp";
import type { Locale } from "@/lib/types";

export function WhatsAppFloat({ locale, label }: { locale: Locale; label: string }) {
  return (
    <a
      href={clinicInquiryLink(locale)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 left-5 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#1f7a43] px-4 text-sm font-bold text-white shadow-lg hover:bg-[#196538]"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
        <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2Zm5.76 13.95c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.14-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.24-.27.64-.4 1.02-.4.12 0 .23 0 .33.01.3.01.45.03.65.5.24.58.82 2 .89 2.15.07.14.12.32.02.51-.09.19-.14.31-.28.48-.14.16-.29.36-.41.48-.14.13-.28.28-.12.54.16.27.72 1.18 1.54 1.91 1.06.94 1.95 1.23 2.22 1.37.27.14.43.12.59-.07.16-.19.68-.79.86-1.06.18-.27.36-.22.6-.13.24.09 1.54.73 1.8.86.27.13.44.2.51.31.06.11.06.64-.18 1.32Z" />
      </svg>
      <span className="hidden sm:inline">{label}</span>
      <span className="sr-only sm:hidden">{label}</span>
    </a>
  );
}
