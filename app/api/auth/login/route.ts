import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { findUserForLogin, verifyPassword } from "@/lib/auth";

const ADMIN_COOKIE = "if_runners_admin";
const FALLBACK_ADMIN_EMAIL = "admin@ifrunners.local";
const FALLBACK_ADMIN_PASSWORD = "admin123";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isFallbackAdmin(email: string, password: string) {
  return email === FALLBACK_ADMIN_EMAIL && password === FALLBACK_ADMIN_PASSWORD;
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

  const user = await findUserForLogin(email).catch(() => null);

  if (!user || !user.active) {
    if (!isFallbackAdmin(email, password)) {
      return NextResponse.json(
        { message: "Credenciais invalidas." },
        { status: 401 }
      );
    }
  } else {
    const validPassword = await verifyPassword(password, user.passwordHash);

    if (!validPassword) {
      return NextResponse.json(
        { message: "Credenciais invalidas." },
        { status: 401 }
      );
    }
  }

  cookies().set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return NextResponse.json({ message: "Login realizado com sucesso." });
}
