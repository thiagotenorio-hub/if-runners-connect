import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const allowedTypes = ["TRAINING", "WORKSHOP", "LECTURE", "OFFICIAL_RACE"];

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function createQrToken(title: string, startsAt: Date) {
  const slug = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `${slug}-${startsAt.getTime()}`;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    title?: string;
    type?: string;
    date?: string;
    time?: string;
    location?: string;
    description?: string;
    points?: number;
  } | null;

  const title = normalizeText(body?.title);
  const type = normalizeText(body?.type);
  const date = normalizeText(body?.date);
  const time = normalizeText(body?.time);
  const location = normalizeText(body?.location);
  const description = normalizeText(body?.description);
  const points = Number(body?.points ?? 0);

  if (!title || !type || !date || !time || !location) {
    return NextResponse.json(
      { message: "Preencha todos os campos obrigatorios." },
      { status: 400 }
    );
  }

  if (!allowedTypes.includes(type)) {
    return NextResponse.json(
      { message: "Tipo de evento invalido." },
      { status: 400 }
    );
  }

  if (!Number.isInteger(points) || points < 0) {
    return NextResponse.json(
      { message: "Informe uma pontuação válida." },
      { status: 400 }
    );
  }

  const startsAt = new Date(`${date}T${time}:00`);

  if (Number.isNaN(startsAt.getTime())) {
    return NextResponse.json(
      { message: "Informe data e horário válidos." },
      { status: 400 }
    );
  }

  const event = await prisma.event.create({
    data: {
      title,
      type,
      startsAt,
      location,
      description: description || null,
      points,
      qrToken: createQrToken(title, startsAt)
    }
  });

  return NextResponse.json(
    {
      message: "Evento cadastrado com sucesso.",
      eventId: event.id
    },
    { status: 201 }
  );
}
