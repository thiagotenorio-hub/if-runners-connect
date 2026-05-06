import { PageShell } from "@/components/PageShell";
import { AppIcon } from "@/components/AppIcon";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
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

export default async function AgendaPage() {
  const events = await prisma.event.findMany({
    where: {
      startsAt: {
        gte: new Date()
      }
    },
    orderBy: { startsAt: "asc" }
  });

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-8 rounded border border-forest/10 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded bg-forest/10 text-forest">
              <AppIcon className="h-7 w-7" name="calendar" />
            </span>
            <div>
              <p className="text-sm font-bold uppercase text-forest">
                Proximos encontros
              </p>
              <h1 className="mt-2 text-3xl font-black text-graphite">
                Agenda IF RUNNERS
              </h1>
              <p className="mt-2 max-w-3xl text-graphite/70">
                Confira os treinos, oficinas, palestras e corridas oficiais
                programadas pelo projeto.
              </p>
            </div>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="rounded border border-graphite/10 bg-white p-8 text-center text-graphite/70">
            Ainda nao ha proximos eventos cadastrados.
          </div>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <article
                key={event.id}
                className="rounded border border-forest/10 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded bg-forest/10 px-2 py-1 text-xs font-bold text-forest">
                        {eventTypeLabel(event.type)}
                      </span>
                      <span className="rounded bg-sun/35 px-2 py-1 text-xs font-bold text-graphite">
                        {event.points} pontos
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-graphite">
                      {event.title}
                    </h2>
                    {event.description ? (
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-graphite/70">
                        {event.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="rounded border border-forest/10 bg-track p-4 text-sm md:min-w-56">
                    <p className="font-bold text-graphite">
                      {formatDate(event.startsAt)}
                    </p>
                    <p className="mt-1 text-graphite/70">
                      {formatTime(event.startsAt)}
                    </p>
                    <p className="mt-3 font-semibold text-graphite">
                      {event.location}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
