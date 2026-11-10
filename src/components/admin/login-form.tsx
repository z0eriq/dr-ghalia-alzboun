"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        setError(response.status === 429 ? "محاولات كثيرة. انتظروا قليلًا ثم أعيدوا المحاولة." : "بيانات الدخول غير صحيحة.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("تعذر الاتصال. حاولوا مرة أخرى.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-4 rounded-3xl bg-paper p-6 text-ink">
      <label className="grid gap-2 text-sm font-semibold">
        البريد
        <input className="field" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} dir="ltr" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        كلمة المرور
        <input className="field" type="password" autoComplete="current-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} dir="ltr" />
      </label>
      {error ? (
        <p role="alert" className="text-sm font-semibold text-red-800">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center rounded-full bg-gold text-sm font-bold text-ink disabled:opacity-60">
        {pending ? "جارٍ الدخول…" : "دخول"}
      </button>
    </form>
  );
}
