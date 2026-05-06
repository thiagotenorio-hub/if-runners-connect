import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function sumScoresBySource(
  scores: Array<{
    source: string;
    points: number;
  }>,
  source: string
) {
  return scores
    .filter((score) => score.source === source)
    .reduce((total, score) => total + score.points, 0);
}

export default async function PontuacaoPage() {
  const participants = await prisma.participant.findMany({
    include: {
      scores: true,
      rankings: {
        where: {
          scope: "GENERAL",
          category: "GERAL",
          period: "GENERAL"
        }
      }
    }
  });

  const rows = participants
    .map((participant) => {
      const totalPoints = participant.scores.reduce(
        (total, score) => total + score.points,
        0
      );

      return {
        id: participant.id,
        fullName: participant.fullName,
        bond: participant.bond,
        totalPoints,
        activityPoints: sumScoresBySource(participant.scores, "ACTIVITY"),
        eventPoints: sumScoresBySource(participant.scores, "EVENT_ATTENDANCE"),
        position: participant.rankings[0]?.position
      };
    })
    .sort((first, second) => {
      if (first.position && second.position) {
        return first.position - second.position;
      }

      return second.totalPoints - first.totalPoints;
    });

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-forest">
              Gamificacao
            </p>
            <h1 className="mt-2 text-3xl font-black text-graphite">
              Pontuacao geral
            </h1>
            <p className="mt-2 max-w-3xl text-graphite/70">
              Total de pontos por participante considerando atividades
              aprovadas e presencas em eventos.
            </p>
          </div>
          <Link
            href="/admin"
            className="rounded border border-forest/25 px-4 py-2 text-sm font-bold text-forest transition hover:bg-forest/10"
          >
            Painel administrativo
          </Link>
        </div>

        <div className="overflow-hidden rounded border border-graphite/10 bg-white">
          {rows.length === 0 ? (
            <div className="p-8 text-center text-graphite/70">
              Ainda nao ha participantes cadastrados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left text-sm">
                <thead className="bg-forest/10 text-xs uppercase text-graphite/65">
                  <tr>
                    <th className="px-4 py-3">Posicao</th>
                    <th className="px-4 py-3">Participante</th>
                    <th className="px-4 py-3">Vinculo</th>
                    <th className="px-4 py-3">Atividades</th>
                    <th className="px-4 py-3">Eventos</th>
                    <th className="px-4 py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.id} className="border-t border-graphite/10">
                      <td className="px-4 py-4 font-black text-forest">
                        {row.position || index + 1}
                      </td>
                      <td className="px-4 py-4 font-semibold text-graphite">
                        {row.fullName}
                      </td>
                      <td className="px-4 py-4 text-graphite/70">{row.bond}</td>
                      <td className="px-4 py-4 text-graphite/70">
                        {row.activityPoints}
                      </td>
                      <td className="px-4 py-4 text-graphite/70">
                        {row.eventPoints}
                      </td>
                      <td className="px-4 py-4 text-lg font-black text-graphite">
                        {row.totalPoints}
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
