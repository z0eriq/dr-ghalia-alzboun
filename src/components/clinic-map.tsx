import { clinic, mapsEmbedUrl } from "@/lib/clinic";
import type { Locale } from "@/lib/types";

export function ClinicMap({
  locale,
  title,
  className = "min-h-72",
}: {
  locale: Locale;
  title: string;
  className?: string;
}) {
  return (
    <a
      href={clinic.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={title}
      className="block overflow-hidden rounded-3xl border border-stone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
    >
      <iframe
        title={title}
        src={mapsEmbedUrl(locale)}
        className={`pointer-events-none w-full ${className}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        tabIndex={-1}
      />
    </a>
  );
}
