import Link from "next/link";
import { AppIcon } from "@/components/AppIcon";
import { PageShell } from "@/components/PageShell";

const features = [
  {
    icon: "run" as const,
    title: "Corridas e caminhadas",
    text: "Registro de atividades com comprovante, link GPS e validação."
  },
  {
    icon: "calendar" as const,
    title: "Agenda do projeto",
    text: "Treinos, oficinas, palestras e corrida oficial em um só lugar."
  },
  {
    icon: "ranking" as const,
    title: "Rankings e pontos",
    text: "Pontuação gamificada e classificações por desempenho e vínculo."
  },
  {
    icon: "health" as const,
    title: "Movimento e cultura",
    text: "Acompanhamento institucional para fortalecer a participação."
  }
];

const quickStats = [
  { label: "Inscrições", value: "Online" },
  { label: "Eventos", value: "QR Code" },
  { label: "Ranking", value: "Ao vivo" }
];

export default function Home() {
  return (
    <PageShell>
      <section
        className="relative overflow-hidden bg-graphite text-white"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(16, 24, 17, 0.95) 0%, rgba(16, 24, 17, 0.76) 43%, rgba(16, 24, 17, 0.25) 100%), url('/brand/if-runners-hero.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}
      >
        <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-r from-leaf via-sun to-pace" />
        <div className="mx-auto grid min-h-[620px] max-w-6xl content-center gap-10 px-5 py-12 md:grid-cols-[1.02fr_0.98fr] md:items-center md:py-16">
          <div>
            <span className="inline-flex rounded bg-sun px-3 py-1 text-sm font-black uppercase text-graphite">
              IFPE Campus Garanhuns
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">
              IF RUNNERS Connect 2026
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-white/82">
              Sistema web para organizar inscrições, atividades, agenda,
              presenças, pontuação e rankings do IF RUNNERS - Onde o Movimento
              Vira Cultura.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/inscricao"
                className="rounded bg-leaf px-5 py-3 font-black text-graphite shadow-sm transition hover:bg-sun"
              >
                Fazer inscrição
              </Link>
              <Link
                href="/agenda"
                className="rounded border border-white/35 px-5 py-3 font-black text-white transition hover:bg-white hover:text-graphite"
              >
                Ver agenda
              </Link>
              <Link
                href="/rankings"
                className="rounded border border-sun/70 px-5 py-3 font-black text-sun transition hover:bg-sun hover:text-graphite"
              >
                Ver rankings
              </Link>
            </div>
          </div>

          <div className="justify-self-end">
            <div className="w-full max-w-sm border-l-4 border-leaf bg-graphite/80 p-6 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase text-sun">
                    Temporada
                  </p>
                  <h2 className="mt-1 text-4xl font-black text-white">2026</h2>
                </div>
                <span className="grid h-14 w-14 place-items-center rounded bg-leaf text-graphite">
                  <AppIcon className="h-8 w-8" name="run" />
                </span>
              </div>
              <div className="mt-8 grid gap-3">
                {quickStats.map((stat) => (
                  <div
                    className="flex items-center justify-between border border-white/10 bg-white/10 px-4 py-3"
                    key={stat.label}
                  >
                    <span className="text-sm font-semibold text-white/80">
                      {stat.label}
                    </span>
                    <span className="font-black text-sun">{stat.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {["Corrida", "Caminhada", "Saúde"].map((item) => (
                  <div
                    className="bg-leaf px-3 py-3 text-center text-xs font-black text-graphite"
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-4 md:grid-cols-4">
          {features.map((feature) => (
            <article
              className="rounded border border-forest/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-leaf hover:shadow-md"
              key={feature.title}
            >
              <span className="grid h-11 w-11 place-items-center rounded bg-graphite text-leaf">
                <AppIcon className="h-6 w-6" name={feature.icon} />
              </span>
              <h2 className="mt-4 font-black text-graphite">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-graphite/65">
                {feature.text}
              </p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
