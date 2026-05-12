import Link from "next/link";
import { Suspense } from "react";
import { PageShell } from "@/components/PageShell";
import { ParticipantLoginForm } from "@/components/ParticipantLoginForm";

export default function EntrarPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-md px-5 py-12">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase text-forest">
            Participantes
          </p>
          <h1 className="mt-2 text-3xl font-black text-graphite">
            Entrar na minha área
          </h1>
          <p className="mt-2 text-graphite/70">
            Use o e-mail e a senha cadastrados na inscrição.
          </p>
        </div>

        <Suspense>
          <ParticipantLoginForm />
        </Suspense>

        <Link
          href="/inscricao"
          className="mt-5 inline-flex text-sm font-semibold text-forest"
        >
          Ainda não tenho inscrição
        </Link>
      </section>
    </PageShell>
  );
}
