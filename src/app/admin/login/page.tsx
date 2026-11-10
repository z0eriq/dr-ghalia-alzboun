import type { Metadata } from "next";

import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "دخول الموظفين",
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-5 py-12 text-ivory">
      <div className="w-full max-w-md">
        <p className="font-latin text-sm tracking-[0.32em] text-gold-bright">DENTAL CLINIC</p>
        <h1 className="mt-3 text-4xl text-ivory">دخول الموظفين</h1>
        <p className="mt-3 text-sm leading-7 text-ivory/70">
          لوحة تنظيم مواعيد عيادة الدكتورة غالية الزبون.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
