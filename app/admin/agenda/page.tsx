import Link from "next/link";
import { EventForm } from "@/components/EventForm";
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

function eventConfirmationPath(token: string | null) {
  return token ? `/eventos/${token}/confirmar-presenca` : "#";
}

export default async function AdminAgendaPage() {
  const events = await prisma.event.findMany({
    orderBy: { startsAt: "desc" }
  });

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-forest">
              Administração
            </p>
            <h1 className="mt-2 text-3xl font-black text-graphite">
              Agenda de eventos
            </h1>
            <p className="mt-2 text-graphite/70">
              Cadastre treinos, oficinas, palestras e corridas oficiais.
            </p>
          </div>
          <Link
            href="/admin"
            className="rounded border border-forest/25 px-4 py-2 text-sm font-bold text-forest transition hover:bg-forest/10"
          >
            Voltar ao painel
          </Link>
        </div>

        <div className="grid gap-8">
          <EventForm />

          <section className="overflow-hidden rounded border border-graphite/10 bg-white">
            <div className="border-b border-graphite/10 p-5">
              <h2 className="text-xl font-black text-graphite">
                Eventos cadastrados
              </h2>
            </div>
            {events.length === 0 ? (
              <div className="p-6 text-sm text-graphite/70">
                Ainda não há eventos cadastrados.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                  <thead className="bg-forest/10 text-xs uppercase text-graphite/65">
                    <tr>
                      <th className="px-4 py-3">Evento</th>
                      <th className="px-4 py-3">Tipo</th>
                      <th className="px-4 py-3">Data e horário</th>
                      <th className="px-4 py-3">Local</th>
                      <th className="px-4 py-3">Pontos</th>
                      <th className="px-4 py-3">QR Code</th>
                      <th className="px-4 py-3">Presenças</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event.id} className="border-t border-graphite/10">
                        <td className="px-4 py-4 font-semibold text-graphite">
                          {event.title}
                        </td>
                        <td className="px-4 py-4 text-graphite/70">
                          {eventTypeLabel(event.type)}
                        </td>
                        <td className="px-4 py-4 text-graphite/70">
                          {formatDateTime(event.startsAt)}
                        </td>
                        <td className="px-4 py-4 text-graphite/70">
                          {event.location}
                        </td>
                        <td className="px-4 py-4 font-bold text-graphite">
                          {event.points}
                        </td>
                        <td className="px-4 py-4">
                          {event.qrToken ? (
                            <div className="flex flex-wrap gap-2">
                              <a
                                className="rounded bg-forest px-3 py-2 text-xs font-bold text-white transition hover:bg-forest/90"
                                href={`/api/admin/qrcodes/eventos/${event.qrToken}?format=png&download=1`}
                              >
                                PNG
                              </a>
                              <a
                                className="rounded border border-forest/25 px-3 py-2 text-xs font-bold text-forest transition hover:bg-forest/10"
                                href={`/api/admin/qrcodes/eventos/${event.qrToken}?format=svg&download=1`}
                              >
                                SVG
                              </a>
                              <Link
                                className="rounded border border-graphite/15 px-3 py-2 text-xs font-bold text-graphite transition hover:bg-graphite/5"
                                href={eventConfirmationPath(event.qrToken)}
                              >
                                Abrir
                              </Link>
                            </div>
                          ) : (
                            <span className="text-graphite/50">Sem token</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <Link
                            className="rounded border border-forest/25 px-3 py-2 text-xs font-bold text-forest transition hover:bg-forest/10"
                            href={`/admin/eventos/${event.id}/presencas`}
                          >
                            Ver lista
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </section>
    </PageShell>
  );
}
