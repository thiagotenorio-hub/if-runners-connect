import { PageShell } from "@/components/PageShell";

export default function PrivacidadePage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-5 py-10">
        <div className="rounded border border-forest/10 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-forest">
            Privacidade e LGPD
          </p>
          <h1 className="mt-2 text-3xl font-black text-graphite">
            Termo simples de ciência e consentimento
          </h1>
          <div className="mt-6 grid gap-5 leading-7 text-graphite/75">
            <p>
              Ao se inscrever no IF RUNNERS Connect, você declara estar ciente
              de que seus dados serão usados pela equipe do projeto IF RUNNERS -
              Onde o Movimento Vira Cultura, do IFPE Campus Garanhuns, para
              organizar inscrições, atividades, eventos, presenças, pontuação,
              rankings e relatórios internos do projeto.
            </p>
            <p>
              Os dados coletados incluem nome, e-mail, telefone, idade, sexo,
              vínculo institucional, turma ou setor, objetivo no projeto,
              condição inicial informada, registros de atividades, comprovantes
              enviados, presenças e pontuações.
            </p>
            <p>
              Dados relacionados à condição física, objetivo de saúde,
              atividades e desempenho devem ser tratados com cuidado adicional e
              não devem ser publicados de forma individual sem necessidade ou
              nova autorização.
            </p>
            <p>
              O acesso administrativo deve ser restrito a pessoas autorizadas.
              Exportações devem ser usadas apenas para fins de acompanhamento,
              prestação de contas e gestão do projeto, evitando compartilhamento
              público de dados pessoais.
            </p>
            <p>
              O participante pode solicitar correção, informações sobre uso dos
              dados ou exclusão quando aplicável, por meio da coordenação do
              projeto.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
