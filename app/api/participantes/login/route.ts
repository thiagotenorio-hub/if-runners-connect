import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth";
import { ensureParticipantPasswordColumn } from "@/lib/participant-schema";
import { prisma } from "@/lib/prisma";

const PARTICIPANT_COOKIE = "if_runners_participant";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
  } | null;

  const email = normalizeText(body?.email).toLowerCase();
  const password = normalizeText(body?.password);

  if (!email || !password) {
    return NextResponse.json(
      { message: "Informe e-mail e senha." },
      { status: 400 }
    );
  }

  await ensureParticipantPasswordColumn();

  const participant = await prisma.participant.findUnique({
    where: { email }
  });

  if (!participant?.passwordHash) {
    return NextResponse.json(
      { message: "Inscrição sem senha cadastrada. Faça uma nova inscrição de teste." },
      { status: 401 }
    );
  }

  const validPassword = await verifyPassword(password, participant.passwordHash);

  if (!validPassword) {
    return NextResponse.json(
      { message: "Credenciais inválidas." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ message: "Login realizado com sucesso." });

  response.cookies.set(PARTICIPANT_COOKIE, participant.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return response;
}
