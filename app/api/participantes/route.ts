import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const requiredFields = [
  "fullName",
  "email",
  "phone",
  "age",
  "sex",
  "bond",
  "classOrSector",
  "projectGoal"
];

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "P2002"
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { message: "Dados da inscrição inválidos." },
      { status: 400 }
    );
  }

  const missingField = requiredFields.find((field) => {
    const value = (body as Record<string, unknown>)[field];
    return value === undefined || normalizeText(value) === "";
  });

  if (missingField) {
    return NextResponse.json(
      { message: "Preencha todos os campos obrigatórios." },
      { status: 400 }
    );
  }

  const age = Number((body as { age: unknown }).age);

  if (!Number.isInteger(age) || age < 1 || age > 120) {
    return NextResponse.json(
      { message: "Informe uma idade válida." },
      { status: 400 }
    );
  }

  const email = normalizeText((body as { email: unknown }).email).toLowerCase();

  try {
    const participant = await prisma.participant.create({
      data: {
        fullName: normalizeText((body as { fullName: unknown }).fullName),
        email,
        phone: normalizeText((body as { phone: unknown }).phone),
        age,
        sex: normalizeText((body as { sex: unknown }).sex),
        bond: normalizeText((body as { bond: unknown }).bond),
        classOrSector: normalizeText(
          (body as { classOrSector: unknown }).classOrSector
        ),
        projectGoal: normalizeText((body as { projectGoal: unknown }).projectGoal),
        initialCondition:
          normalizeText((body as { initialCondition: unknown }).initialCondition) ||
          "Não informada"
      }
    });

    return NextResponse.json(
      {
        message: "Inscrição realizada com sucesso.",
        participantId: participant.id
      },
      { status: 201 }
    );
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { message: "Já existe uma inscrição com este e-mail." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Não foi possível salvar a inscrição agora." },
      { status: 500 }
    );
  }
}
