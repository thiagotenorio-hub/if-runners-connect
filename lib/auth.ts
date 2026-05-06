import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function findUserForLogin(email: string) {
  return prisma.adminUser.findUnique({
    where: { email: email.toLowerCase().trim() }
  });
}
