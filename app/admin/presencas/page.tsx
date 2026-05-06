import Link from "next/link";
import { AttendanceForm } from "@/components/AttendanceForm";
import { PageShell } from "@/components/PageShell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PresencasPage() {
  const [participants, events] = await Promise.all([
    prisma.participant.findMany({
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true, email: true }
    }),
    prisma.event.findMany({
      orderBy: { startsAt: "desc" },
      select: { id: true, title: true, type: true, points: true }
    })
  ]);

  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-5 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-forest">
              Administracao
            </p>
            <h1 className="mt-2 text-3xl font-black text-graphite">
              Registrar presenca
            </h1>
            <p className="mt-2 text-graphite/70">
              A presenca usa a pontuacao associada ao evento na agenda.
            </p>
          </div>
          <Link
            href="/admin"
            className="rounded border border-forest/25 px-4 py-2 text-sm font-bold text-forest transition hover:bg-forest/10"
          >
            Voltar ao painel
          </Link>
        </div>

        <AttendanceForm
          events={events.map((eventOption) => ({
            id: eventOption.id,
            label: `${eventOption.title} - ${eventOption.type} - ${eventOption.points} pontos`
          }))}
          participants={participants.map((participant) => ({
            id: participant.id,
            label: `${participant.fullName} - ${participant.email}`
          }))}
        />
      </section>
    </PageShell>
  );
}
