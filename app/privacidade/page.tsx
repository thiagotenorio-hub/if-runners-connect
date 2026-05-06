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
            Termo simples de ciencia e consentimento
          </h1>
          <div className="mt-6 grid gap-5 leading-7 text-graphite/75">
            <p>
              Ao se inscrever no IF RUNNERS Connect, voce declara estar ciente
              de que seus dados serao usados pela equipe do projeto IF RUNNERS -
              Onde o Movimento Vira Cultura, do IFPE Campus Garanhuns, para
              organizar inscricoes, atividades, eventos, presencas, pontuacao,
              rankings e relatorios internos do projeto.
            </p>
            <p>
              Os dados coletados incluem nome, e-mail, telefone, idade, sexo,
              vinculo institucional, turma ou setor, objetivo no projeto,
              condicao inicial informada, registros de atividades, comprovantes
              enviados, presencas e pontuacoes.
            </p>
            <p>
              Dados relacionados a condicao fisica, objetivo de saude,
              atividades e desempenho devem ser tratados com cuidado adicional e
              nao devem ser publicados de forma individual sem necessidade ou
              nova autorizacao.
            </p>
            <p>
              O acesso administrativo deve ser restrito a pessoas autorizadas.
              Exportacoes devem ser usadas apenas para fins de acompanhamento,
              prestacao de contas e gestao do projeto, evitando compartilhamento
              publico de dados pessoais.
            </p>
            <p>
              O participante pode solicitar correcao, informacoes sobre uso dos
              dados ou exclusao quando aplicavel, por meio da coordenacao do
              projeto.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
