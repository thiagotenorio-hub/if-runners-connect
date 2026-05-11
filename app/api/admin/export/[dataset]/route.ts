import { prisma } from "@/lib/prisma";

type CsvRow = Record<string, string | number | null>;

function escapeCsvValue(value: string | number | null) {
  if (value === null) {
    return "";
  }

  const text = String(value);

  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function toCsv(rows: CsvRow[]) {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsvValue(row[header])).join(",")
    )
  ];

  return lines.join("\n");
}

function csvResponse(filename: string, rows: CsvRow[]) {
  return new Response(toCsv(rows), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="${filename}.csv"`,
      "X-Content-Type-Options": "nosniff",
      "Content-Type": "text/csv; charset=utf-8"
    }
  });
}

export async function GET(
  _request: Request,
  { params }: { params: { dataset: string } }
) {
  if (params.dataset === "participantes") {
    const participants = await prisma.participant.findMany({
      orderBy: { registeredAt: "asc" }
    });

    return csvResponse(
      "if-runners-participantes",
      participants.map((participant) => ({
        id: participant.id,
        nome: participant.fullName,
        email: participant.email,
        telefone: participant.phone,
        idade: participant.age,
        sexo: participant.sex,
        vinculo: participant.bond,
        turma_setor: participant.classOrSector,
        objetivo: participant.projectGoal,
        condicao_inicial: participant.initialCondition,
        data_inscricao: participant.registeredAt.toISOString()
      }))
    );
  }

  if (params.dataset === "atividades") {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      include: { participant: true }
    });

    return csvResponse(
      "if-runners-atividades",
      activities.map((activity) => ({
        id: activity.id,
        participante: activity.participant.fullName,
        email: activity.participant.email,
        tipo: activity.type,
        distancia_km: activity.distanceKm,
        tempo_min: activity.durationMinutes,
        data: activity.activityDate.toISOString(),
        link_gps: activity.gpsLink,
        comprovante: activity.proofUploadPath,
        observacao: activity.observation,
        status: activity.status,
        nota_revisao: activity.reviewNote,
        revisada_em: activity.reviewedAt?.toISOString() || null
      }))
    );
  }

  if (params.dataset === "eventos") {
    const events = await prisma.event.findMany({
      orderBy: { startsAt: "desc" }
    });

    return csvResponse(
      "if-runners-eventos",
      events.map((event) => ({
        id: event.id,
        titulo: event.title,
        tipo: event.type,
        data_horario: event.startsAt.toISOString(),
        local: event.location,
        descricao: event.description,
        pontos: event.points,
        qr_token: event.qrToken
      }))
    );
  }

  if (params.dataset === "presencas") {
    const attendances = await prisma.attendance.findMany({
      orderBy: { confirmedAt: "desc" },
      include: {
        event: true,
        participant: true
      }
    });

    return csvResponse(
      "if-runners-presencas",
      attendances.map((attendance) => ({
        id: attendance.id,
        evento: attendance.event.title,
        tipo_evento: attendance.event.type,
        participante: attendance.participant.fullName,
        email: attendance.participant.email,
        vinculo: attendance.participant.bond,
        confirmado_em: attendance.confirmedAt.toISOString(),
        metodo: attendance.method,
        pontos: attendance.pointsGranted
      }))
    );
  }

  if (params.dataset === "pontuacoes") {
    const scores = await prisma.score.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        participant: true,
        activity: true,
        event: true
      }
    });

    return csvResponse(
      "if-runners-pontuacoes",
      scores.map((score) => ({
        id: score.id,
        participante: score.participant.fullName,
        email: score.participant.email,
        origem: score.source,
        pontos: score.points,
        descricao: score.description,
        atividade_id: score.activityId,
        evento: score.event?.title || null,
        criado_em: score.createdAt.toISOString()
      }))
    );
  }

  return new Response("Dataset não encontrado.", { status: 404 });
}
