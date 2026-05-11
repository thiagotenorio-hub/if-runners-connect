"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ActivityReviewActionsProps = {
  activityId: string;
  status: string;
};

export function ActivityReviewActions({
  activityId,
  status
}: ActivityReviewActionsProps) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<
    "APPROVED" | "REJECTED" | null
  >(null);
  const [message, setMessage] = useState("");

  async function reviewActivity(nextStatus: "APPROVED" | "REJECTED") {
    const reviewNote =
      nextStatus === "REJECTED"
        ? window.prompt("Informe o motivo da recusa, se desejar:") || ""
        : "";

    setLoadingAction(nextStatus);
    setMessage("");

    const response = await fetch(`/api/admin/atividades/${activityId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus, reviewNote })
    });

    const data = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    setLoadingAction(null);

    if (!response.ok) {
      setMessage(data?.message || "Não foi possível revisar a atividade.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded bg-forest px-3 py-2 text-xs font-bold text-white transition hover:bg-forest/90 disabled:cursor-not-allowed disabled:bg-graphite/35"
          disabled={loadingAction !== null || status === "APPROVED"}
          onClick={() => reviewActivity("APPROVED")}
          type="button"
        >
          {loadingAction === "APPROVED" ? "Aprovando..." : "Aprovar"}
        </button>
        <button
          className="rounded border border-red-200 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-graphite/20 disabled:text-graphite/35"
          disabled={loadingAction !== null || status === "REJECTED"}
          onClick={() => reviewActivity("REJECTED")}
          type="button"
        >
          {loadingAction === "REJECTED" ? "Recusando..." : "Recusar"}
        </button>
      </div>
      {message ? (
        <p className="text-xs font-semibold text-red-700">{message}</p>
      ) : null}
    </div>
  );
}
