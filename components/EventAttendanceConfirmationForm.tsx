"use client";

import { FormEvent, useState } from "react";
import { FormField } from "@/components/FormField";

type EventAttendanceConfirmationFormProps = {
  token: string;
};

type FormState = "idle" | "submitting" | "success" | "error";

export function EventAttendanceConfirmationForm({
  token
}: EventAttendanceConfirmationFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [points, setPoints] = useState<number | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    setState("submitting");
    setMessage("");
    setPoints(null);

    const response = await fetch(`/api/eventos/${token}/presenca`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email")
      })
    });

    const data = (await response.json().catch(() => null)) as {
      message?: string;
      points?: number;
    } | null;

    if (!response.ok) {
      setState("error");
      setMessage(data?.message || "Não foi possível confirmar a presença.");
      return;
    }

    form.reset();
    setState("success");
    setMessage(data?.message || "Presença confirmada.");
    setPoints(typeof data?.points === "number" ? data.points : null);
  }

  return (
    <form
      className="grid gap-5 rounded border border-graphite/10 bg-white p-6"
      onSubmit={handleSubmit}
    >
      {message ? (
        <div
          className={
            state === "success"
              ? "rounded border border-forest/20 bg-forest/10 px-4 py-3 text-sm font-semibold text-forest"
              : "rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          }
          role="status"
        >
          {message}
          {points !== null ? (
            <span className="mt-1 block">Pontuação adicionada: {points}</span>
          ) : null}
        </div>
      ) : null}

      <FormField label="E-mail usado na inscrição" name="email" type="email" required />

      <button
        className="w-full rounded bg-forest px-5 py-3 font-bold text-white transition hover:bg-forest/90 disabled:cursor-not-allowed disabled:bg-graphite/35 md:w-fit"
        disabled={state === "submitting"}
        type="submit"
      >
        {state === "submitting" ? "Confirmando..." : "Confirmar presença"}
      </button>
    </form>
  );
}
