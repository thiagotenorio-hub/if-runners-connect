"use client";

import { useRouter } from "next/navigation";

export function ParticipantLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/participantes/logout", { method: "POST" });
    router.push("/entrar");
    router.refresh();
  }

  return (
    <button
      className="rounded border border-forest/25 px-4 py-2 text-sm font-bold text-forest transition hover:bg-forest/10"
      type="button"
      onClick={handleLogout}
    >
      Sair
    </button>
  );
}
