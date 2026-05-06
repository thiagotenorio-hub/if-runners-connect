import { PageShell } from "@/components/PageShell";
import { RegistrationForm } from "@/components/RegistrationForm";
import { AppIcon } from "@/components/AppIcon";

export default function InscricaoPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-5 py-10">
        <div className="mb-8 rounded border border-forest/10 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded bg-forest/10 text-forest">
              <AppIcon className="h-7 w-7" name="health" />
            </span>
            <div>
              <p className="text-sm font-bold uppercase text-forest">
                IFPE Campus Garanhuns
              </p>
              <h1 className="mt-2 text-3xl font-black text-graphite">
                Inscricao no IF RUNNERS
              </h1>
              <p className="mt-3 max-w-3xl leading-7 text-graphite/72">
                O IF RUNNERS - Onde o Movimento Vira Cultura incentiva
                caminhada, corrida, saude e convivencia por meio de treinos,
                oficinas, palestras e desafios acompanhados pela equipe do
                projeto.
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-graphite/65">
                Seus dados serao usados apenas para gestao, acompanhamento,
                pontuacao, presenca e relatorios internos do projeto.
              </p>
            </div>
          </div>
        </div>

        <RegistrationForm />
      </section>
    </PageShell>
  );
}
