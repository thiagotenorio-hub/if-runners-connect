import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  calculateEventAttendancePoints,
  recalculateParticipantScores
} from "@/lib/scoring";

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
  } | null;

  const email = normalizeEmail(body?.email);

  if (!email) {
    return NextResponse.json(
      { message: "Informe o e-mail cadastrado na inscrição." },
      { status: 400 }
    );
  }

  const event = await prisma.event.findUnique({
    where: { qrToken: params.token },
    select: {
      id: true,
      title: true,
      type: true,
      points: true
    }
  });

  if (!event) {
    return NextResponse.json(
      { message: "Evento não encontrado." },
      { status: 404 }
    );
  }

  const participant = await prisma.participant.findUnique({
    where: { email },
    select: {
      id: true,
      fullName: true
    }
  });

  if (!participant) {
    return NextResponse.json(
      { message: "E-mail não encontrado. Faça sua inscrição primeiro." },
      { status: 404 }
    );
  }

  const existingAttendance = await prisma.attendance.findUnique({
    where: {
      eventId_participantId: {
        eventId: event.id,
        participantId: participant.id
      }
    },
    select: { id: true }
  });

  if (existingAttendance) {
    return NextResponse.json(
      { message: "Sua presença já foi registrada neste evento." },
      { status: 409 }
    );
  }

  const pointsGranted = calculateEventAttendancePoints(event.type, event.points);

  await prisma.attendance.create({
    data: {
      eventId: event.id,
      participantId: participant.id,
      method: "QR_CODE",
      pointsGranted
    }
  });

  await recalculateParticipantScores(participant.id);

  return NextResponse.json({
    message: `Presença confirmada para ${participant.fullName}.`,
    points: pointsGranted
  });
}
