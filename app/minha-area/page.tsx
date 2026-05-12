import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { ParticipantLogoutButton } from "@/components/ParticipantLogoutButton";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PARTICIPANT_COOKIE = "if_runners_participant";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
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

function statusLabel(value: string) {
  const labels: Record<string, string> = {
    PENDING: "Pendente",
    APPROVED: "Aprovada",
    REJECTED: "Recusada"
  };

  return labels[value] || value;
}

export default async function MinhaAreaPage() {
  const participantId = cookies().get(PARTICIPANT_COOKIE)?.value;

  if (!participantId) {
    redirect("/entrar");
  }

  const participant = await prisma.participant.findUnique({
    where: { id: participantId },
    include: {
      activities: {
        orderBy: { activityDate: "desc" }
      },
      attendances: {
        include: { event: true },
        orderBy: { confirmedAt: "desc" }
      },
      scores: {
        orderBy: { createdAt: "desc" }
      },
      rankings: {
        where: {
          scope: "GENERAL",
          category: "GERAL",
          period: "GENERAL"
        }
      }
    }
  });

  if (!participant) {
    redirect("/entrar");
  }

  const totalPoints = participant.scores.reduce(
    (total, score) => total + score.points,
    0
  );
  const approvedDistance = participant.activities
    .filter((activity) => activity.status === "APPROVED")
    .reduce((total, activity) => total + activity.distanceKm, 0);
  const position = participant.rankings[0]?.position;

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-forest">
              Área do participante
            </p>
            <h1 className="mt-2 text-3xl font-black text-graphite">
              Olá, {participant.fullName}
            </h1>
            <p className="mt-2 text-graphite/70">
              Acompanhe sua inscrição, atividades, presenças e pontuação.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/atividades"
              className="rounded bg-forest px-4 py-2 text-sm font-bold text-white transition hover:bg-forest/90"
            >
              Registrar atividade
            </Link>
            <ParticipantLogoutButton />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded border border-forest/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-graphite/60">
              Pontuação
            </p>
            <p className="mt-3 text-3xl font-black text-graphite">
              {totalPoints}
            </p>
          </div>
          <div className="rounded border border-forest/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-graphite/60">
              Ranking geral
            </p>
            <p className="mt-3 text-3xl font-black text-graphite">
              {position ? `${position}º` : "-"}
            </p>
          </div>
          <div className="rounded border border-forest/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-graphite/60">
              Km aprovados
            </p>
            <p className="mt-3 text-3xl font-black text-graphite">
              {approvedDistance.toLocaleString("pt-BR", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 2
              })}
            </p>
          </div>
          <div className="rounded border border-forest/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-graphite/60">
              Vínculo
            </p>
            <p className="mt-3 text-xl font-black text-graphite">
              {labelBond(participant.bond)}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded border border-forest/10 bg-white p-5 shadow-sm">
            <h2 className="font-black text-graphite">Minha inscrição</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div>
                <dt className="font-bold text-graphite">E-mail</dt>
                <dd className="text-graphite/70">{participant.email}</dd>
              </div>
              <div>
                <dt className="font-bold text-graphite">Turma/setor</dt>
                <dd className="text-graphite/70">{participant.classOrSector}</dd>
              </div>
              <div>
                <dt className="font-bold text-graphite">Objetivo</dt>
                <dd className="text-graphite/70">{participant.projectGoal}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded border border-forest/10 bg-white p-5 shadow-sm">
            <h2 className="font-black text-graphite">Minhas atividades</h2>
            <div className="mt-4 grid gap-3">
              {participant.activities.length === 0 ? (
                <p className="text-sm text-graphite/65">
                  Nenhuma atividade registrada ainda.
                </p>
              ) : (
                participant.activities.map((activity) => (
                  <div
                    className="rounded border border-forest/10 bg-track/50 p-3 text-sm"
                    key={activity.id}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-graphite">
                        {activity.type === "RUN" ? "Corrida" : "Caminhada"} -{" "}
                        {activity.distanceKm} km
                      </strong>
                      <span className="rounded bg-sun/35 px-2 py-1 text-xs font-bold text-graphite">
                        {statusLabel(activity.status)}
                      </span>
                    </div>
                    <p className="mt-1 text-graphite/65">
                      {formatDate(activity.activityDate)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded border border-forest/10 bg-white p-5 shadow-sm">
          <h2 className="font-black text-graphite">Presenças em eventos</h2>
          <div className="mt-4 grid gap-3">
            {participant.attendances.length === 0 ? (
              <p className="text-sm text-graphite/65">
                Nenhuma presença registrada ainda.
              </p>
            ) : (
              participant.attendances.map((attendance) => (
                <div
                  className="rounded border border-forest/10 bg-track/50 p-3 text-sm"
                  key={attendance.id}
                >
                  <strong className="text-graphite">
                    {attendance.event.title}
                  </strong>
                  <p className="mt-1 text-graphite/65">
                    {formatDate(attendance.confirmedAt)} -{" "}
                    {attendance.pointsGranted} pontos
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </section>
    </PageShell>
  );
}
