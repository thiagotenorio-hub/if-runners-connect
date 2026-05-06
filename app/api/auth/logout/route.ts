import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ADMIN_COOKIE = "if_runners_admin";

export async function POST() {
  cookies().delete(ADMIN_COOKIE);

  return NextResponse.json({ message: "Sessao encerrada." });
}
