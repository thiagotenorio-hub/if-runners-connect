"use client";

import { FormEvent, useState } from "react";
import { FormField } from "@/components/FormField";

type ParticipantOption = {
  id: string;
  fullName: string;
  email: string;
};

type ActivityFormProps = {
  participants: ParticipantOption[];
};

type FormState = "idle" | "submitting" | "success" | "error";

export function ActivityForm({ participants }: ActivityFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

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

    const response = await fetch("/api/atividades", {
      method: "POST",
      body: formData
    });

    const data = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    if (!response.ok) {
      setState("error");
      setMessage(data?.message || "Não foi possível registrar a atividade.");
      return;
    }

    form.reset();
    setState("success");
    setMessage(data?.message || "Atividade registrada como pendente.");
  }

  return (
    <form
      className="grid gap-5 rounded border border-forest/10 bg-white p-6 shadow-sm"
      encType="multipart/form-data"
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
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-graphite">
            Participante
          </span>
          <select
            className="w-full rounded border border-graphite/15 bg-white px-3 py-3 outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/10"
            name="participantId"
            required
          >
            <option value="">Selecione</option>
            {participants.map((participant) => (
              <option key={participant.id} value={participant.id}>
                {participant.fullName} - {participant.email}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-graphite">
            Tipo de atividade
          </span>
          <select
            className="w-full rounded border border-graphite/15 bg-white px-3 py-3 outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/10"
            name="type"
            required
          >
            <option value="">Selecione</option>
            <option value="RUN">Corrida</option>
            <option value="WALK">Caminhada</option>
          </select>
        </label>
        <FormField
          label="Distância em km"
          name="distanceKm"
          type="number"
          min="0.1"
          step="0.01"
          required
        />
        <FormField
          label="Tempo em minutos"
          name="durationMinutes"
          type="number"
          min="1"
          step="1"
          required
        />
        <FormField label="Data" name="activityDate" type="date" required />
        <FormField label="Link do GPS" name="gpsLink" type="url" />
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-graphite">
          Print/comprovante
        </span>
        <input
          accept="image/png,image/jpeg,image/webp,application/pdf"
          className="w-full rounded border border-graphite/15 bg-white px-3 py-3 text-sm outline-none transition file:mr-4 file:rounded file:border-0 file:bg-forest file:px-3 file:py-2 file:font-bold file:text-white focus:border-forest focus:ring-4 focus:ring-forest/10"
          name="proof"
          type="file"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-graphite">
          Observação
        </span>
        <textarea
          className="min-h-28 w-full rounded border border-graphite/15 bg-white px-3 py-3 outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/10"
          name="observation"
        />
      </label>

      <button
        type="submit"
        className="w-full rounded bg-forest px-5 py-3 font-black text-white shadow-sm transition hover:bg-forest/90 disabled:cursor-not-allowed disabled:bg-graphite/35 md:w-fit"
        disabled={state === "submitting"}
      >
        {state === "submitting" ? "Enviando..." : "Registrar atividade"}
      </button>
    </form>
  );
}
