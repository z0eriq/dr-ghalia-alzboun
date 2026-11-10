import Link from "next/link";

import { fontClassName } from "@/lib/fonts";

export default function GlobalNotFound() {
  return (
    <html lang="ar" dir="rtl" className={fontClassName}>
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#f6f1e7", color: "#100e0c", textAlign: "center", padding: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>الصفحة غير موجودة</h1>
          <p>Page not found</p>
          <Link href="/ar" style={{ display: "inline-block", marginTop: "1.5rem", background: "#c6a15a", color: "#100e0c", borderRadius: "999px", padding: "0.75rem 1.25rem", fontWeight: 700, textDecoration: "none" }}>
            الرئيسية
          </Link>
        </div>
      </body>
    </html>
  );
}
