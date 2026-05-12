import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function isExternalUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const activityId = searchParams.get("activityId") || "";

  if (!activityId) {
    return NextResponse.json(
      { message: "Informe a atividade." },
      { status: 400 }
    );
  }

  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    select: { proofUploadPath: true }
  });

  if (!activity?.proofUploadPath) {
    return NextResponse.json(
      { message: "Comprovante não encontrado." },
      { status: 404 }
    );
  }

  if (isExternalUrl(activity.proofUploadPath)) {
    return NextResponse.redirect(activity.proofUploadPath);
  }

  if (activity.proofUploadPath.startsWith("/uploads/")) {
    return NextResponse.redirect(new URL(activity.proofUploadPath, request.url));
  }

  const blob = await get(activity.proofUploadPath, { access: "private" });

  if (!blob?.stream) {
    return NextResponse.json(
      { message: "Comprovante não encontrado no storage." },
      { status: 404 }
    );
  }

  return new Response(blob.stream, {
    headers: {
      "Content-Type":
        blob.headers.get("content-type") || "application/octet-stream",
      "Content-Disposition": `inline; filename="${activity.proofUploadPath
        .split("/")
        .pop()}"`
    }
  });
}
