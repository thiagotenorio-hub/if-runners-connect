import Link from "next/link";
import { EventAttendanceConfirmationForm } from "@/components/EventAttendanceConfirmationForm";
import { PageShell } from "@/components/PageShell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function eventTypeLabel(type: string) {
  const labels: Record<string, string> = {
    TRAINING: "Treino em grupo",
    WORKSHOP: "Oficina",
    LECTURE: "Palestra",
    OFFICIAL_RACE: "Corrida oficial"
  };

  return labels[type] || type;
}

export default async function ConfirmarPresencaPage({
  params
}: {
  params: { token: string };
}) {
  const event = await prisma.event.findUnique({
    where: { qrToken: params.token }
  });

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-5 py-10">
        {!event ? (
          <div className="rounded border border-graphite/10 bg-white p-8 text-center">
            <h1 className="text-2xl font-black text-graphite">
              Evento nao encontrado
            </h1>
            <p className="mt-3 text-graphite/70">
              O QR Code escaneado nao corresponde a um evento cadastrado.
            </p>
            <Link
              className="mt-6 inline-flex rounded bg-forest px-5 py-3 font-bold text-white transition hover:bg-forest/90"
              href="/agenda"
            >
              Ver agenda
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="rounded border border-graphite/10 bg-white p-6">
              <p className="text-sm font-bold uppercase text-forest">
                Confirmacao de presenca
              </p>
              <h1 className="mt-2 text-3xl font-black text-graphite">
                {event.title}
              </h1>
              <div className="mt-4 grid gap-2 text-sm text-graphite/70">
                <p>
                  <strong className="text-graphite">Tipo:</strong>{" "}
                  {eventTypeLabel(event.type)}
                </p>
                <p>
                  <strong className="text-graphite">Data e horario:</strong>{" "}
                  {formatDateTime(event.startsAt)}
                </p>
                <p>
                  <strong className="text-graphite">Local:</strong>{" "}
                  {event.location}
                </p>
                <p>
                  <strong className="text-graphite">Pontuacao:</strong>{" "}
                  {event.points} pontos
                </p>
              </div>
              {event.description ? (
                <p className="mt-4 leading-7 text-graphite/70">
                  {event.description}
                </p>
              ) : null}
            </div>

            <EventAttendanceConfirmationForm token={params.token} />
          </div>
        )}
      </section>
    </PageShell>
  );
}
