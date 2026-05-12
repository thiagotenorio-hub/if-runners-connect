import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function safeFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .toLowerCase();
}

async function saveProofFile(file: File) {
  if (!file.name || file.size === 0) {
    return null;
  }

  const fileName = `${Date.now()}-${safeFileName(file.name)}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`atividades/${fileName}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type || undefined
    });

    return blob.url;
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "atividades");
  await mkdir(uploadsDir, { recursive: true });

  const filePath = path.join(uploadsDir, fileName);
  await writeFile(filePath, bytes);

  return `/uploads/atividades/${fileName}`;
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return NextResponse.json(
      { message: "Dados da atividade inválidos." },
      { status: 400 }
    );
  }

  const participantId = textValue(formData, "participantId");
  const type = textValue(formData, "type");
  const distanceKm = Number(textValue(formData, "distanceKm"));
  const durationMinutes = Number(textValue(formData, "durationMinutes"));
  const activityDate = textValue(formData, "activityDate");
  const gpsLink = textValue(formData, "gpsLink");
  const observation = textValue(formData, "observation");
  const proof = formData.get("proof");

  if (!participantId || !type || !activityDate) {
    return NextResponse.json(
      { message: "Preencha todos os campos obrigatórios." },
      { status: 400 }
    );
  }

  if (!["RUN", "WALK"].includes(type)) {
    return NextResponse.json(
      { message: "Tipo de atividade inválido." },
      { status: 400 }
    );
  }

  if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
    return NextResponse.json(
      { message: "Informe uma distância válida." },
      { status: 400 }
    );
  }

  if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
    return NextResponse.json(
      { message: "Informe um tempo válido em minutos." },
      { status: 400 }
    );
  }

  const hasProofFile = proof instanceof File && proof.size > 0;

  if (process.env.VERCEL && hasProofFile && !process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        message:
          "O envio de print ainda precisa do Vercel Blob configurado. Use link GPS por enquanto."
      },
      { status: 400 }
    );
  }

  if (!gpsLink && !hasProofFile) {
    return NextResponse.json(
      { message: "Informe um link GPS ou envie um print/comprovante." },
      { status: 400 }
    );
  }

  const participant = await prisma.participant.findUnique({
    where: { id: participantId },
    select: { id: true }
  });

  if (!participant) {
    return NextResponse.json(
      { message: "Participante não encontrado." },
      { status: 404 }
    );
  }

  let proofUploadPath: string | null = null;

  if (proof instanceof File && proof.size > 0) {
    try {
      proofUploadPath = await saveProofFile(proof);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o print/comprovante.";

      return NextResponse.json(
        {
          message: `Não foi possível salvar o print/comprovante. Detalhe: ${message}`
        },
        { status: 500 }
      );
    }
  }

  const activity = await prisma.activity.create({
    data: {
      participantId,
      type,
      distanceKm,
      durationMinutes,
      activityDate: new Date(`${activityDate}T12:00:00`),
      gpsLink: gpsLink || null,
      proofUploadPath,
      observation: observation || null,
      status: "PENDING"
    }
  });

  return NextResponse.json(
    {
      message: "Atividade registrada como pendente.",
      activityId: activity.id
    },
    { status: 201 }
  );
}
