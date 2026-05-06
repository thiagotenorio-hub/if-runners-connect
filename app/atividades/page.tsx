import Link from "next/link";
import { ActivityForm } from "@/components/ActivityForm";
import { AppIcon } from "@/components/AppIcon";
import { PageShell } from "@/components/PageShell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AtividadesPage() {
  const participants = await prisma.participant.findMany({
    orderBy: { fullName: "asc" },
    select: {
      id: true,
      fullName: true,
      email: true
    }
  });

  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-5 py-10">
        <div className="mb-8 rounded border border-forest/10 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded bg-forest/10 text-forest">
              <AppIcon className="h-7 w-7" name="run" />
            </span>
            <div>
              <p className="text-sm font-bold uppercase text-forest">
                Corridas e caminhadas
              </p>
              <h1 className="mt-2 text-3xl font-black text-graphite">
                Registrar atividade fisica
              </h1>
              <p className="mt-3 max-w-3xl leading-7 text-graphite/72">
                Envie sua corrida ou caminhada com distancia, tempo, data e
                comprovante. A atividade ficara pendente ate a avaliacao da
                equipe.
              </p>
            </div>
          </div>
        </div>

        {participants.length === 0 ? (
          <div className="rounded border border-forest/10 bg-white p-6 shadow-sm">
            <p className="text-graphite/70">
              Ainda nao ha participantes cadastrados. Faca uma inscricao antes
              de registrar atividades.
            </p>
            <Link
              href="/inscricao"
              className="mt-5 inline-flex rounded bg-forest px-5 py-3 font-bold text-white transition hover:bg-forest/90"
            >
              Ir para inscricao
            </Link>
          </div>
        ) : (
          <ActivityForm participants={participants} />
        )}
      </section>
    </PageShell>
  );
}
