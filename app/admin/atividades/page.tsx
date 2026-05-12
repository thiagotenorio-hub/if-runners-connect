import Link from "next/link";
import { ActivityReviewActions } from "@/components/ActivityReviewActions";
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

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: "Pendente",
    APPROVED: "Aprovada",
    REJECTED: "Recusada"
  };

  return labels[status] || status;
}

function statusClassName(status: string) {
  if (status === "APPROVED") {
    return "bg-forest/10 text-forest";
  }

  if (status === "REJECTED") {
    return "bg-red-50 text-red-700";
  }

  return "bg-sun/35 text-graphite";
}

export default async function AdminAtividadesPage() {
  const activitiesFromDatabase = await prisma.activity.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      participant: {
        select: {
          fullName: true,
          email: true
        }
      },
      scores: true
    }
  });

  const activities = activitiesFromDatabase.sort((first, second) => {
    if (first.status === second.status) {
      return second.createdAt.getTime() - first.createdAt.getTime();
    }

    if (first.status === "PENDING") {
      return -1;
    }

    if (second.status === "PENDING") {
      return 1;
    }

    return first.status.localeCompare(second.status);
  });

  const pendingCount = activities.filter(
    (activity) => activity.status === "PENDING"
  ).length;

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-forest">
              Administração
            </p>
            <h1 className="mt-2 text-3xl font-black text-graphite">
              Atividades físicas
            </h1>
            <p className="mt-2 text-graphite/70">
              {activities.length} atividade
              {activities.length === 1 ? "" : "s"} cadastrada
              {activities.length === 1 ? "" : "s"}, com {pendingCount} pendente
              {pendingCount === 1 ? "" : "s"}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/atividades"
              className="rounded bg-forest px-4 py-2 text-sm font-bold text-white transition hover:bg-forest/90"
            >
              Nova atividade
            </Link>
            <Link
              href="/admin"
              className="rounded border border-forest/25 px-4 py-2 text-sm font-bold text-forest transition hover:bg-forest/10"
            >
              Voltar ao painel
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {activities.length === 0 ? (
            <div className="rounded border border-graphite/10 bg-white p-8 text-center text-graphite/70">
              Ainda não há atividades cadastradas.
            </div>
          ) : (
            activities.map((activity) => {
              const points = activity.scores
                .filter((score) => score.source === "ACTIVITY")
                .reduce((total, score) => total + score.points, 0);

              return (
                <article
                  key={activity.id}
                  className="rounded border border-graphite/10 bg-white p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded px-2 py-1 text-xs font-bold ${statusClassName(
                            activity.status
                          )}`}
                        >
                          {statusLabel(activity.status)}
                        </span>
                        <span className="text-sm font-bold text-graphite">
                          {activity.type === "RUN" ? "Corrida" : "Caminhada"}
                        </span>
                      </div>
                      <h2 className="text-xl font-black text-graphite">
                        {activity.participant.fullName}
                      </h2>
                      <p className="mt-1 text-sm text-graphite/65">
                        {activity.participant.email}
                      </p>
                    </div>
                    <ActivityReviewActions
                      activityId={activity.id}
                      status={activity.status}
                    />
                  </div>

                  <dl className="mt-5 grid gap-3 text-sm md:grid-cols-4">
                    <div>
                      <dt className="font-bold text-graphite">Distância</dt>
                      <dd className="text-graphite/70">{activity.distanceKm} km</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-graphite">Tempo</dt>
                      <dd className="text-graphite/70">
                        {activity.durationMinutes} min
                      </dd>
                    </div>
                    <div>
                      <dt className="font-bold text-graphite">Data</dt>
                      <dd className="text-graphite/70">
                        {formatDate(activity.activityDate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-bold text-graphite">Pontos</dt>
                      <dd className="text-graphite/70">
                        {activity.status === "APPROVED" ? points : 0}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
                    <div>
                      <h3 className="font-bold text-graphite">Comprovação</h3>
                      <div className="mt-2 grid gap-1">
                        {activity.gpsLink ? (
                          <a
                            className="font-semibold text-forest"
                            href={activity.gpsLink}
                            rel="noreferrer"
                            target="_blank"
                          >
                            Abrir link GPS
                          </a>
                        ) : null}
                        {activity.proofUploadPath ? (
                          <a
                            className="font-semibold text-forest"
                            href={`/api/admin/comprovantes?activityId=${activity.id}`}
                            rel="noreferrer"
                            target="_blank"
                          >
                            Abrir comprovante
                          </a>
                        ) : null}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-graphite">Observações</h3>
                      <p className="mt-2 text-graphite/70">
                        {activity.observation ||
                          activity.reviewNote ||
                          "Sem observação."}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </PageShell>
  );
}
