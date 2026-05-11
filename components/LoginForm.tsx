"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormField } from "@/components/FormField";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setMessage("");
    setIsSubmitting(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password")
      })
    });

    const data = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(data?.message || "Não foi possível entrar.");
      return;
    }

    router.push(searchParams.get("redirect") || "/admin");
    router.refresh();
  }

  return (
    <form
      className="grid gap-5 rounded border border-forest/10 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit}
    >
      {message ? (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {message}
        </div>
      ) : null}
      <div className="rounded border border-forest/10 bg-forest/5 px-4 py-3 text-sm text-graphite/75">
        <strong className="text-forest">Acesso de teste:</strong>{" "}
        admin@ifrunners.local / admin123
      </div>
      <FormField
        label="E-mail administrativo"
        name="email"
        type="email"
        placeholder="admin@ifrunners.local"
        required
      />
      <FormField label="Senha" name="password" type="password" required />
      <button
        type="submit"
        className="rounded bg-forest px-5 py-3 font-black text-white shadow-sm transition hover:bg-forest/90 disabled:cursor-not-allowed disabled:bg-graphite/35"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Entrando..." : "Entrar no painel"}
      </button>
    </form>
  );
}
