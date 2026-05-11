import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  calculateEventAttendancePoints,
  recalculateParticipantScores
} from "@/lib/scoring";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    eventId?: string;
    participantId?: string;
    method?: string;
  } | null;

  if (!body?.eventId || !body?.participantId) {
    return NextResponse.json(
      { message: "Informe participante e evento." },
      { status: 400 }
    );
  }

  const event = await prisma.event.findUnique({
    where: { id: body.eventId },
    select: { id: true, type: true, points: true }
  });

  if (!event) {
    return NextResponse.json(
      { message: "Evento não encontrado." },
      { status: 404 }
    );
  }

  const pointsGranted = calculateEventAttendancePoints(event.type, event.points);

  const existingAttendance = await prisma.attendance.findUnique({
    where: {
      eventId_participantId: {
        eventId: body.eventId,
        participantId: body.participantId
      }
    },
    select: { id: true }
  });

  if (existingAttendance) {
    return NextResponse.json(
      { message: "Presença já registrada para este evento." },
      { status: 409 }
    );
  }

  await prisma.attendance.create({
    data: {
      eventId: body.eventId,
      participantId: body.participantId,
      method: body.method || "ADMIN",
      pointsGranted
    }
  });

  await recalculateParticipantScores(body.participantId);

  return NextResponse.json({
    message: "Presença registrada e pontuação recalculada.",
    points: pointsGranted
  });
}
