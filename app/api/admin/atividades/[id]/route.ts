import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  calculateActivityPoints,
  recalculateParticipantScores
} from "@/lib/scoring";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = (await request.json().catch(() => null)) as {
    status?: string;
    reviewNote?: string;
  } | null;

  if (!body || !["APPROVED", "REJECTED"].includes(body.status || "")) {
    return NextResponse.json(
      { message: "Informe uma decisao valida." },
      { status: 400 }
    );
  }

  const activity = await prisma.activity.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      participantId: true,
      type: true,
      distanceKm: true
    }
  });

  if (!activity) {
    return NextResponse.json(
      { message: "Atividade nao encontrada." },
      { status: 404 }
    );
  }

  await prisma.activity.update({
    where: { id: activity.id },
    data: {
      status: body.status,
      reviewNote:
        body.status === "REJECTED"
          ? body.reviewNote?.trim() || "Atividade recusada."
          : null,
      reviewedAt: new Date()
    }
  });

  await recalculateParticipantScores(activity.participantId);

  const points =
    body.status === "APPROVED"
      ? calculateActivityPoints(activity.type, activity.distanceKm)
      : 0;

  return NextResponse.json({
    message:
      body.status === "APPROVED"
        ? "Atividade aprovada e pontuacao recalculada."
        : "Atividade recusada e pontuacao recalculada.",
    points
  });
}
