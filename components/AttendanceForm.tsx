"use client";

import { FormEvent, useState } from "react";

type Option = {
  id: string;
  label: string;
};

type AttendanceFormProps = {
  participants: Option[];
  events: Option[];
};

export function AttendanceForm({ participants, events }: AttendanceFormProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setMessage("");

    const response = await fetch("/api/admin/presencas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participantId: formData.get("participantId"),
        eventId: formData.get("eventId"),
        method: "ADMIN"
      })
    });

    const data = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    setIsSubmitting(false);
    setMessage(data?.message || "Registro processado.");

    if (response.ok) {
      form.reset();
    }
  }

  return (
    <form
      className="grid gap-5 rounded border border-graphite/10 bg-white p-6"
      onSubmit={handleSubmit}
    >
      {message ? (
        <div className="rounded border border-forest/20 bg-forest/10 px-4 py-3 text-sm font-semibold text-forest">
          {message}
        </div>
      ) : null}

      <label className="block">
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
              {participant.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-graphite">
          Evento
        </span>
        <select
          className="w-full rounded border border-graphite/15 bg-white px-3 py-3 outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/10"
          name="eventId"
          required
        >
          <option value="">Selecione</option>
          {events.map((eventOption) => (
            <option key={eventOption.id} value={eventOption.id}>
              {eventOption.label}
            </option>
          ))}
        </select>
      </label>

      <button
        className="w-full rounded bg-forest px-5 py-3 font-bold text-white transition hover:bg-forest/90 disabled:cursor-not-allowed disabled:bg-graphite/35 md:w-fit"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Registrando..." : "Registrar presenca"}
      </button>
    </form>
  );
}
