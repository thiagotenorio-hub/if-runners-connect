import { prisma } from "@/lib/prisma";

let passwordColumnReady = false;

export async function ensureParticipantPasswordColumn() {
  if (passwordColumnReady) {
    return;
  }

  await prisma.$executeRawUnsafe(
    'ALTER TABLE "Participant" ADD COLUMN IF NOT EXISTS "passwordHash" TEXT'
  );

  passwordColumnReady = true;
}
