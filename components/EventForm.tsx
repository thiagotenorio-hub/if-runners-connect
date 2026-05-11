"use client";

import { FormEvent, useState } from "react";
import { FormField } from "@/components/FormField";

type FormState = "idle" | "submitting" | "success" | "error";

const defaultPointsByType: Record<string, number> = {
  TRAINING: 30,
  WORKSHOP: 20,
  LECTURE: 20,
  OFFICIAL_RACE: 0
};

export function EventForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [eventType, setEventType] = useState("TRAINING");
  const [points, setPoints] = useState(defaultPointsByType.TRAINING);

  function handleTypeChange(value: string) {
    setEventType(value);
    setPoints(defaultPointsByType[value] ?? 0);
  }

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

    const response = await fetch("/api/admin/eventos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        type: formData.get("type"),
        date: formData.get("date"),
        time: formData.get("time"),
        location: formData.get("location"),
        description: formData.get("description"),
        points: Number(formData.get("points"))
      })
    });

    const data = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    if (!response.ok) {
      setState("error");
      setMessage(data?.message || "Não foi possível cadastrar o evento.");
      return;
    }

    form.reset();
    setEventType("TRAINING");
    setPoints(defaultPointsByType.TRAINING);
    setState("success");
    setMessage(data?.message || "Evento cadastrado com sucesso.");
  }

  return (
    <form
      className="grid gap-5 rounded border border-forest/10 bg-white p-6 shadow-sm"
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

      <FormField label="Título" name="title" required />

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-graphite">
            Tipo
          </span>
          <select
            className="w-full rounded border border-graphite/15 bg-white px-3 py-3 outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/10"
            name="type"
            onChange={(event) => handleTypeChange(event.target.value)}
            required
            value={eventType}
          >
            <option value="TRAINING">Treino em grupo</option>
            <option value="WORKSHOP">Oficina</option>
            <option value="LECTURE">Palestra</option>
            <option value="OFFICIAL_RACE">Corrida oficial</option>
          </select>
        </label>
        <FormField label="Data" name="date" type="date" required />
        <FormField label="Horário" name="time" type="time" required />
        <FormField label="Local" name="location" required />
        <FormField
          label="Pontuação associada"
          name="points"
          type="number"
          min="0"
          step="1"
          required
          value={String(points)}
          onChange={(value) => setPoints(Number(value))}
        />
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-graphite">
          Descrição
        </span>
        <textarea
          className="min-h-28 w-full rounded border border-graphite/15 bg-white px-3 py-3 outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/10"
          name="description"
        />
      </label>

      <button
        className="w-full rounded bg-forest px-5 py-3 font-black text-white shadow-sm transition hover:bg-forest/90 disabled:cursor-not-allowed disabled:bg-graphite/35 md:w-fit"
        disabled={state === "submitting"}
        type="submit"
      >
        {state === "submitting" ? "Salvando..." : "Cadastrar evento"}
      </button>
    </form>
  );
}
