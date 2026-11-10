"use client";

export default function PublicError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="mx-auto w-full max-w-lg px-5 py-24 text-center">
      <h1 className="text-4xl">حدث خطأ غير متوقع</h1>
      <p className="mt-3 text-muted">Something went wrong. Please try again.</p>
      <button type="button" onClick={reset} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-gold px-5 text-sm font-bold text-ink">
        إعادة المحاولة
      </button>
    </section>
  );
}
