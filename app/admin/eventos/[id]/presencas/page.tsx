import Link from "next/link";
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

export default async function EventAttendanceListPage({
  params
}: {
  params: { id: string };
}) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      attendances: {
        orderBy: { confirmedAt: "asc" },
        include: {
          participant: true
        }
      }
    }
  });

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-5 py-10">
        {!event ? (
          <div className="rounded border border-graphite/10 bg-white p-8 text-center">
            <h1 className="text-2xl font-black text-graphite">
              Evento nao encontrado
            </h1>
            <Link
              className="mt-6 inline-flex rounded bg-forest px-5 py-3 font-bold text-white transition hover:bg-forest/90"
              href="/admin/agenda"
            >
              Voltar para agenda
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase text-forest">
                  Lista de presenca
                </p>
                <h1 className="mt-2 text-3xl font-black text-graphite">
                  {event.title}
                </h1>
                <p className="mt-2 text-graphite/70">
                  {eventTypeLabel(event.type)} em {formatDateTime(event.startsAt)}.
                </p>
              </div>
              <Link
                href="/admin/agenda"
                className="rounded border border-forest/25 px-4 py-2 text-sm font-bold text-forest transition hover:bg-forest/10"
              >
                Voltar para agenda
              </Link>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-3">
              <div className="rounded border border-graphite/10 bg-white p-4">
                <p className="text-xs font-bold uppercase text-graphite/60">
                  Confirmados
                </p>
                <p className="mt-2 text-2xl font-black text-graphite">
                  {event.attendances.length}
                </p>
              </div>
              <div className="rounded border border-graphite/10 bg-white p-4">
                <p className="text-xs font-bold uppercase text-graphite/60">
                  Pontos por presenca
                </p>
                <p className="mt-2 text-2xl font-black text-graphite">
                  {event.points}
                </p>
              </div>
              <div className="rounded border border-graphite/10 bg-white p-4">
                <p className="text-xs font-bold uppercase text-graphite/60">
                  Local
                </p>
                <p className="mt-2 text-sm font-semibold text-graphite">
                  {event.location}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded border border-graphite/10 bg-white">
              {event.attendances.length === 0 ? (
                <div className="p-8 text-center text-graphite/70">
                  Ainda nao ha presencas registradas para este evento.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                    <thead className="bg-forest/10 text-xs uppercase text-graphite/65">
                      <tr>
                        <th className="px-4 py-3">Participante</th>
                        <th className="px-4 py-3">E-mail</th>
                        <th className="px-4 py-3">Vinculo</th>
                        <th className="px-4 py-3">Turma/setor</th>
                        <th className="px-4 py-3">Confirmacao</th>
                        <th className="px-4 py-3">Metodo</th>
                        <th className="px-4 py-3">Pontos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {event.attendances.map((attendance) => (
                        <tr
                          key={attendance.id}
                          className="border-t border-graphite/10"
                        >
                          <td className="px-4 py-4 font-semibold text-graphite">
                            {attendance.participant.fullName}
                          </td>
                          <td className="px-4 py-4 text-graphite/70">
                            {attendance.participant.email}
                          </td>
                          <td className="px-4 py-4 text-graphite/70">
                            {attendance.participant.bond}
                          </td>
                          <td className="px-4 py-4 text-graphite/70">
                            {attendance.participant.classOrSector}
                          </td>
                          <td className="px-4 py-4 text-graphite/70">
                            {formatDateTime(attendance.confirmedAt)}
                          </td>
                          <td className="px-4 py-4 text-graphite/70">
                            {attendance.method}
                          </td>
                          <td className="px-4 py-4 font-bold text-graphite">
                            {attendance.pointsGranted}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </PageShell>
  );
}
