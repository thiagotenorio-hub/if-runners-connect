import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const moduleCards = [
  {
    title: "Participantes",
    description: "Ver inscritos no projeto.",
    href: "/admin/inscritos"
  },
  {
    title: "Atividades pendentes",
    description: "Validar corridas e caminhadas enviadas.",
    href: "/admin/atividades"
  },
  {
    title: "Agenda",
    description: "Organizar treinos, oficinas, palestras e corrida oficial.",
    href: "/admin/agenda"
  },
  {
    title: "Presencas",
    description: "Acompanhar confirmacoes em eventos.",
    href: "/admin/presencas"
  },
  {
    title: "Ranking",
    description: "Consultar pontuacoes e classificacoes.",
    href: "/rankings"
  },
  {
    title: "QR Codes",
    description: "Baixar QR Code da inscricao.",
    href: "/admin/qrcodes"
  }
];

const exportLinks = [
  { label: "Participantes", href: "/api/admin/export/participantes" },
  { label: "Atividades", href: "/api/admin/export/atividades" },
  { label: "Eventos", href: "/api/admin/export/eventos" },
  { label: "Presencas", href: "/api/admin/export/presencas" },
  { label: "Pontuacoes", href: "/api/admin/export/pontuacoes" }
];

function formatKm(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  });
}

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function weekKey(date: Date) {
  const firstDay = new Date(Date.UTC(date.getFullYear(), 0, 1));
  const currentDay = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayOffset = Math.floor(
    (currentDay.getTime() - firstDay.getTime()) / 86400000
  );
  const week = Math.ceil((dayOffset + firstDay.getUTCDay() + 1) / 7);

  return `${date.getFullYear()}-S${String(week).padStart(2, "0")}`;
}

function bondLabel(value: string) {
  const labels: Record<string, string> = {
    ESTUDANTE: "Estudante",
    SERVIDOR: "Servidor",
    TERCEIRIZADO: "Terceirizado",
    COMUNIDADE_EXTERNA: "Comunidade externa"
  };

  return labels[value] || value;
}

function pushSum(map: Map<string, number>, key: string, value: number) {
  map.set(key, (map.get(key) || 0) + value);
}

function makeChartRows(map: Map<string, number>) {
  return Array.from(map.entries()).map(([label, value]) => ({
    label,
    value
  }));
}

function BarChart({
  title,
  rows,
  valueSuffix = ""
}: {
  title: string;
  rows: Array<{ label: string; value: number }>;
  valueSuffix?: string;
}) {
  const maxValue = Math.max(...rows.map((row) => row.value), 1);

  return (
    <section className="rounded border border-forest/10 bg-white p-5 shadow-sm">
      <h2 className="font-black text-graphite">{title}</h2>
      <div className="mt-5 grid gap-3">
        {rows.length === 0 ? (
          <p className="text-sm text-graphite/65">Sem dados para exibir.</p>
        ) : (
          rows.map((row) => (
            <div key={row.label}>
              <div className="mb-1 flex items-center justify-between gap-3 text-xs font-semibold text-graphite/70">
                <span>{row.label}</span>
                <span>
                  {row.value.toLocaleString("pt-BR")}
                  {valueSuffix}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded bg-graphite/10">
                <div
                  className="h-full rounded bg-forest"
                  style={{ width: `${Math.max((row.value / maxValue) * 100, 4)}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-forest/10 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase text-graphite/60">{label}</p>
      <p className="mt-3 text-3xl font-black text-graphite">{value}</p>
    </div>
  );
}

export default async function AdminPage() {
  const now = new Date();
  const [participants, activities, events] = await Promise.all([
    prisma.participant.findMany({
      orderBy: { registeredAt: "asc" },
      include: { scores: true }
    }),
    prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      include: { participant: true }
    }),
    prisma.event.findMany({
      orderBy: { startsAt: "desc" },
      include: { attendances: true }
    })
  ]);

  const approvedActivities = activities.filter(
    (activity) => activity.status === "APPROVED"
  );
  const pendingActivities = activities.filter(
    (activity) => activity.status === "PENDING"
  );
  const totalRunKm = approvedActivities
    .filter((activity) => activity.type === "RUN")
    .reduce((total, activity) => total + activity.distanceKm, 0);
  const totalWalkKm = approvedActivities
    .filter((activity) => activity.type === "WALK")
    .reduce((total, activity) => total + activity.distanceKm, 0);
  const completedEvents = events.filter((event) => event.startsAt < now);
  const topParticipants = participants
    .map((participant) => ({
      id: participant.id,
      name: participant.fullName,
      bond: participant.bond,
      points: participant.scores.reduce((total, score) => total + score.points, 0)
    }))
    .sort((first, second) => second.points - first.points)
    .slice(0, 5);

  const registrationsByDay = new Map<string, number>();
  participants.forEach((participant) => {
    pushSum(registrationsByDay, dayKey(participant.registeredAt), 1);
  });

  const kmByWeek = new Map<string, number>();
  approvedActivities.forEach((activity) => {
    pushSum(kmByWeek, weekKey(activity.activityDate), activity.distanceKm);
  });

  const bonds = new Map<string, number>();
  participants.forEach((participant) => {
    pushSum(bonds, bondLabel(participant.bond), 1);
  });

  const activityDistribution = new Map<string, number>();
  approvedActivities.forEach((activity) => {
    pushSum(
      activityDistribution,
      activity.type === "RUN" ? "Corrida" : "Caminhada",
      activity.distanceKm
    );
  });

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-graphite">
            Painel administrativo
          </h1>
          <p className="mt-2 text-graphite/70">
            Acompanhamento geral do IF RUNNERS Connect.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Total de inscritos" value={participants.length} />
          <StatCard
            label="Atividades registradas"
            value={activities.length}
          />
          <StatCard label="Km corridos" value={formatKm(totalRunKm)} />
          <StatCard label="Km caminhados" value={formatKm(totalWalkKm)} />
          <StatCard
            label="Eventos realizados"
            value={completedEvents.length}
          />
          <StatCard
            label="Atividades pendentes"
            value={pendingActivities.length}
          />
          <StatCard
            label="Presencas registradas"
            value={events.reduce(
              (total, event) => total + event.attendances.length,
              0
            )}
          />
          <StatCard
            label="Km totais aprovados"
            value={formatKm(totalRunKm + totalWalkKm)}
          />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <BarChart
            rows={makeChartRows(registrationsByDay)}
            title="Evolucao das inscricoes"
          />
          <BarChart
            rows={makeChartRows(kmByWeek)}
            title="Quilometragem por semana"
            valueSuffix=" km"
          />
          <BarChart
            rows={makeChartRows(bonds)}
            title="Participacao por tipo de vinculo"
          />
          <BarChart
            rows={makeChartRows(activityDistribution)}
            title="Distribuicao corrida x caminhada"
            valueSuffix=" km"
          />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <section className="rounded border border-forest/10 bg-white p-5 shadow-sm">
            <h2 className="font-black text-graphite">
              Participantes mais pontuados
            </h2>
            <div className="mt-4 grid gap-3">
              {topParticipants.length === 0 ? (
                <p className="text-sm text-graphite/65">
                  Ainda nao ha pontuacao registrada.
                </p>
              ) : (
                topParticipants.map((participant, index) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between gap-3 rounded border border-forest/10 bg-track/50 p-3"
                  >
                    <div>
                      <p className="font-bold text-graphite">
                        {index + 1}. {participant.name}
                      </p>
                      <p className="text-xs text-graphite/60">
                        {bondLabel(participant.bond)}
                      </p>
                    </div>
                    <span className="font-black text-forest">
                      {participant.points}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded border border-forest/10 bg-white p-5 shadow-sm">
            <h2 className="font-black text-graphite">
              Exportar dados em CSV
            </h2>
            <p className="mt-2 text-sm text-graphite/65">
              Baixe planilhas para acompanhamento, relatorios e prestacao de
              contas.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {exportLinks.map((link) => (
                <a
                  key={link.href}
                  className="rounded border border-forest/25 px-4 py-2 text-sm font-bold text-forest transition hover:bg-forest/10"
                  href={link.href}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-8">
          <h2 className="mb-4 text-xl font-black text-graphite">
            Modulos administrativos
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {moduleCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="rounded border border-forest/10 bg-white p-5 shadow-sm transition hover:border-forest/30 hover:shadow-md"
              >
                <h3 className="font-black text-graphite">{card.title}</h3>
                <p className="mt-2 text-sm text-graphite/65">
                  {card.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </PageShell>
  );
}
