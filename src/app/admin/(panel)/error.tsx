"use client";

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-3xl border border-stone bg-paper p-6">
      <h1 className="text-3xl">تعذر تحميل البيانات</h1>
      <p className="mt-3 leading-7 text-muted">تحققوا من اتصال قاعدة البيانات ثم أعيدوا المحاولة.</p>
      <button type="button" onClick={reset} className="mt-5 inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-bold text-ivory">
        إعادة المحاولة
      </button>
    </div>
  );
}
