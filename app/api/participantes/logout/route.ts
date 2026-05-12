import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const PARTICIPANT_COOKIE = "if_runners_participant";

export async function POST() {
  cookies().delete(PARTICIPANT_COOKIE);
  return NextResponse.json({ message: "Logout realizado com sucesso." });
}
