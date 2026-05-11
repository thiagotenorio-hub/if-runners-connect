import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

export default async function InscritosPage() {
  const participants = await prisma.participant.findMany({
    orderBy: { registeredAt: "desc" }
  });

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-forest">
              Administração
            </p>
            <h1 className="mt-2 text-3xl font-black text-graphite">
              Inscritos
            </h1>
            <p className="mt-2 text-graphite/70">
              {participants.length} participante
              {participants.length === 1 ? "" : "s"} cadastrado
              {participants.length === 1 ? "" : "s"}.
            </p>
          </div>
          <Link
            href="/admin"
            className="rounded border border-forest/25 px-4 py-2 text-sm font-bold text-forest transition hover:bg-forest/10"
          >
            Voltar ao painel
          </Link>
        </div>

        <div className="overflow-hidden rounded border border-graphite/10 bg-white">
          {participants.length === 0 ? (
            <div className="p-8 text-center text-graphite/70">
              Ainda não há participantes inscritos.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
                <thead className="bg-forest/10 text-xs uppercase text-graphite/65">
                  <tr>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">E-mail</th>
                    <th className="px-4 py-3">Telefone</th>
                    <th className="px-4 py-3">Idade</th>
                    <th className="px-4 py-3">Sexo</th>
                    <th className="px-4 py-3">Vínculo</th>
                    <th className="px-4 py-3">Turma/setor</th>
                    <th className="px-4 py-3">Objetivo</th>
                    <th className="px-4 py-3">Inscrição</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant) => (
                    <tr
                      key={participant.id}
                      className="border-t border-graphite/10 align-top"
                    >
                      <td className="px-4 py-3 font-semibold text-graphite">
                        {participant.fullName}
                      </td>
                      <td className="px-4 py-3 text-graphite/70">
                        {participant.email}
                      </td>
                      <td className="px-4 py-3 text-graphite/70">
                        {participant.phone}
                      </td>
                      <td className="px-4 py-3 text-graphite/70">
                        {participant.age}
                      </td>
                      <td className="px-4 py-3 text-graphite/70">
                        {participant.sex}
                      </td>
                      <td className="px-4 py-3 text-graphite/70">
                        {participant.bond}
                      </td>
                      <td className="px-4 py-3 text-graphite/70">
                        {participant.classOrSector}
                      </td>
                      <td className="max-w-xs px-4 py-3 text-graphite/70">
                        {participant.projectGoal}
                      </td>
                      <td className="px-4 py-3 text-graphite/70">
                        {formatDate(participant.registeredAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
