import { PageShell } from "@/components/PageShell";
import { RankingTable } from "@/components/RankingTable";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ParticipantWithData = Awaited<
  ReturnType<typeof getParticipantsWithRankingData>
>[number];

function formatKm(value: number) {
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  })} km`;
}

function labelBond(value: string) {
  const labels: Record<string, string> = {
    ESTUDANTE: "Estudante",
    SERVIDOR: "Servidor",
    TERCEIRIZADO: "Terceirizado",
    COMUNIDADE_EXTERNA: "Comunidade externa"
  };

  return labels[value] || value;
}

async function getParticipantsWithRankingData() {
  const participants = await prisma.participant.findMany({
    include: {
      scores: true,
      activities: {
        where: { status: "APPROVED" }
      }
    }
  });

  return participants.map((participant) => {
    const totalPoints = participant.scores.reduce(
      (total, score) => total + score.points,
      0
    );
    const runKm = participant.activities
      .filter((activity) => activity.type === "RUN")
      .reduce((total, activity) => total + activity.distanceKm, 0);
    const walkKm = participant.activities
      .filter((activity) => activity.type === "WALK")
      .reduce((total, activity) => total + activity.distanceKm, 0);

    return {
      id: participant.id,
      fullName: participant.fullName,
      bond: participant.bond,
      classOrSector: participant.classOrSector,
      totalPoints,
      runKm,
      walkKm,
      totalKm: runKm + walkKm
    };
  });
}

function positionRows<T extends ParticipantWithData>(
  rows: T[],
  getCategory: (row: T) => string,
  getMainData: (row: T) => string
) {
  return rows.map((row, index) => ({
    id: `${row.id}-${index}`,
    position: index + 1,
    name: row.fullName,
    category: getCategory(row),
    points: row.totalPoints,
    mainData: getMainData(row)
  }));
}

function sortByPoints(rows: ParticipantWithData[]) {
  return [...rows].sort((first, second) => {
    if (second.totalPoints !== first.totalPoints) {
      return second.totalPoints - first.totalPoints;
    }

    return second.totalKm - first.totalKm;
  });
}

function sortByRunKm(rows: ParticipantWithData[]) {
  return [...rows]
    .filter((row) => row.runKm > 0)
    .sort((first, second) => {
      if (second.runKm !== first.runKm) {
        return second.runKm - first.runKm;
      }

      return second.totalPoints - first.totalPoints;
    });
}

function sortByWalkKm(rows: ParticipantWithData[]) {
  return [...rows]
    .filter((row) => row.walkKm > 0)
    .sort((first, second) => {
      if (second.walkKm !== first.walkKm) {
        return second.walkKm - first.walkKm;
      }

      return second.totalPoints - first.totalPoints;
    });
}

function groupRankingRows(
  participants: ParticipantWithData[],
  groupKey: "bond" | "classOrSector"
) {
  const groups = new Map<string, ParticipantWithData[]>();

  participants.forEach((participant) => {
    const key = participant[groupKey] || "Nao informado";
    groups.set(key, [...(groups.get(key) || []), participant]);
  });

  return Array.from(groups.entries())
    .map(([category, members]) => {
      const totalPoints = members.reduce(
        (total, member) => total + member.totalPoints,
        0
      );
      const totalKm = members.reduce((total, member) => total + member.totalKm, 0);

      return {
        id: category,
        name: groupKey === "bond" ? labelBond(category) : category,
        category: groupKey === "bond" ? "Vinculo" : "Turma/setor",
        totalPoints,
        totalKm,
        membersCount: members.length
      };
    })
    .sort((first, second) => {
      if (second.totalPoints !== first.totalPoints) {
        return second.totalPoints - first.totalPoints;
      }

      return second.totalKm - first.totalKm;
    })
    .map((row, index) => ({
      id: row.id,
      position: index + 1,
      name: row.name,
      category: row.category,
      points: row.totalPoints,
      mainData: `${row.membersCount} participante${row.membersCount === 1 ? "" : "s"}; ${formatKm(row.totalKm)}`
    }));
}

export default async function RankingsPage() {
  const participants = await getParticipantsWithRankingData();

  const generalRows = positionRows(
    sortByPoints(participants),
    (row) => labelBond(row.bond),
    (row) =>
      `${formatKm(row.totalKm)} totais; corrida ${formatKm(row.runKm)}; caminhada ${formatKm(row.walkKm)}`
  );

  const runRows = positionRows(
    sortByRunKm(participants),
    (row) => labelBond(row.bond),
    (row) => `${formatKm(row.runKm)} corridos`
  );

  const walkRows = positionRows(
    sortByWalkKm(participants),
    (row) => labelBond(row.bond),
    (row) => `${formatKm(row.walkKm)} caminhados`
  );

  const bondRows = groupRankingRows(participants, "bond");
  const classOrSectorRows = groupRankingRows(participants, "classOrSector");

  return (
    <PageShell>
      <section className="border-b border-white/10 bg-sprint text-white">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <p className="text-sm font-bold uppercase text-sun">
            Classificacoes
          </p>
          <h1 className="mt-2 text-3xl font-black text-white">
            Rankings IF RUNNERS
          </h1>
          <p className="mt-2 max-w-3xl text-white/75">
            Tabelas calculadas com atividades aprovadas, presencas e pontuacao
            atual dos participantes.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">

        <div className="grid gap-6">
          <RankingTable
            description="Classificacao individual pela pontuacao total acumulada."
            rows={generalRows}
            title="Ranking geral por pontuacao"
          />
          <RankingTable
            description="Classificacao individual por quilometragem de corrida aprovada."
            rows={runRows}
            title="Ranking por maior quilometragem corrida"
          />
          <RankingTable
            description="Classificacao individual por quilometragem de caminhada aprovada."
            rows={walkRows}
            title="Ranking por maior quilometragem caminhada"
          />
          <RankingTable
            description="Classificacao agrupada por estudante, servidor, terceirizado e comunidade externa."
            rows={bondRows}
            title="Ranking por vinculo"
          />
          <RankingTable
            description="Classificacao agrupada por turma ou setor informado na inscricao."
            rows={classOrSectorRows}
            title="Ranking por turma/setor"
          />
        </div>
      </section>
    </PageShell>
  );
}
