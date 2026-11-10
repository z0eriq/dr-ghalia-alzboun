import type { Metadata, Viewport } from "next";

import { fontClassName } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "لوحة عيادة الدكتورة غالية الزبون",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#100e0c",
  width: "device-width",
  initialScale: 1,
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${fontClassName} h-full`}>
      <body className="min-h-full bg-ivory text-ink antialiased">{children}</body>
    </html>
  );
}
