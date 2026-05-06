import Link from "next/link";
import { headers } from "next/headers";
import { PageShell } from "@/components/PageShell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getBaseUrl() {
  const headerList = headers();
  const host = headerList.get("host") || "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") || "http";

  return `${protocol}://${host}`;
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export default async function QrCodesPage() {
  const baseUrl = getBaseUrl();
  const registrationUrl = `${baseUrl}/inscricao`;
  const events = await prisma.event.findMany({
    orderBy: { startsAt: "desc" }
  });

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-forest">
              Administracao
            </p>
            <h1 className="mt-2 text-3xl font-black text-graphite">
              QR Codes
            </h1>
            <p className="mt-2 max-w-3xl text-graphite/70">
              Baixe o QR Code de inscricao para usar em cartazes, slides, redes
              sociais e banners do IF RUNNERS.
            </p>
          </div>
          <Link
            href="/admin"
            className="rounded border border-forest/25 px-4 py-2 text-sm font-bold text-forest transition hover:bg-forest/10"
          >
            Voltar ao painel
          </Link>
        </div>

        <div className="grid gap-6 rounded border border-graphite/10 bg-white p-6 md:grid-cols-[320px_1fr] md:items-center">
          <div className="rounded border border-graphite/10 bg-[#f6f8f5] p-5">
            <img
              alt="QR Code para inscricao no IF RUNNERS Connect"
              className="h-auto w-full rounded bg-white"
              src="/api/admin/qrcodes/inscricao"
            />
          </div>

          <div>
            <h2 className="text-2xl font-black text-graphite">
              Inscricao de participantes
            </h2>
            <p className="mt-3 text-sm leading-6 text-graphite/70">
              Este QR Code aponta diretamente para a pagina publica de
              inscricao do sistema.
            </p>

            <div className="mt-5 rounded border border-graphite/10 bg-[#f6f8f5] p-4">
              <p className="text-xs font-bold uppercase text-graphite/60">
                Link de destino
              </p>
              <p className="mt-2 break-all text-sm font-semibold text-graphite">
                {registrationUrl}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                className="rounded bg-forest px-5 py-3 text-sm font-bold text-white transition hover:bg-forest/90"
                href="/api/admin/qrcodes/inscricao?format=png&download=1"
              >
                Baixar PNG
              </a>
              <a
                className="rounded border border-forest/25 px-5 py-3 text-sm font-bold text-forest transition hover:bg-forest/10"
                href="/api/admin/qrcodes/inscricao?format=svg&download=1"
              >
                Baixar SVG
              </a>
              <Link
                className="rounded border border-graphite/15 px-5 py-3 text-sm font-bold text-graphite transition hover:bg-graphite/5"
                href="/inscricao"
              >
                Abrir inscricao
              </Link>
            </div>
          </div>
        </div>

        <section className="mt-8 overflow-hidden rounded border border-graphite/10 bg-white">
          <div className="border-b border-graphite/10 p-5">
            <h2 className="text-xl font-black text-graphite">
              QR Codes dos eventos
            </h2>
            <p className="mt-2 text-sm text-graphite/70">
              Cada evento possui um QR Code unico para confirmacao de presenca.
            </p>
          </div>

          {events.length === 0 ? (
            <div className="p-6 text-sm text-graphite/70">
              Ainda nao ha eventos cadastrados.
            </div>
          ) : (
            <div className="grid gap-4 p-5 md:grid-cols-2">
              {events.map((event) => {
                const confirmationUrl = event.qrToken
                  ? `${baseUrl}/eventos/${event.qrToken}/confirmar-presenca`
                  : "";

                return (
                  <article
                    key={event.id}
                    className="grid gap-4 rounded border border-graphite/10 p-4"
                  >
                    <div className="grid grid-cols-[120px_1fr] gap-4">
                      <div className="rounded border border-graphite/10 bg-[#f6f8f5] p-2">
                        {event.qrToken ? (
                          <img
                            alt={`QR Code de presenca do evento ${event.title}`}
                            className="h-auto w-full rounded bg-white"
                            src={`/api/admin/qrcodes/eventos/${event.qrToken}`}
                          />
                        ) : null}
                      </div>
                      <div>
                        <h3 className="font-black text-graphite">
                          {event.title}
                        </h3>
                        <p className="mt-1 text-sm text-graphite/70">
                          {formatDateTime(event.startsAt)}
                        </p>
                        <p className="mt-2 break-all text-xs text-graphite/60">
                          {confirmationUrl}
                        </p>
                      </div>
                    </div>
                    {event.qrToken ? (
                      <div className="flex flex-wrap gap-2">
                        <a
                          className="rounded bg-forest px-3 py-2 text-xs font-bold text-white transition hover:bg-forest/90"
                          href={`/api/admin/qrcodes/eventos/${event.qrToken}?format=png&download=1`}
                        >
                          Baixar PNG
                        </a>
                        <a
                          className="rounded border border-forest/25 px-3 py-2 text-xs font-bold text-forest transition hover:bg-forest/10"
                          href={`/api/admin/qrcodes/eventos/${event.qrToken}?format=svg&download=1`}
                        >
                          Baixar SVG
                        </a>
                        <Link
                          className="rounded border border-graphite/15 px-3 py-2 text-xs font-bold text-graphite transition hover:bg-graphite/5"
                          href={`/eventos/${event.qrToken}/confirmar-presenca`}
                        >
                          Abrir
                        </Link>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </PageShell>
  );
}
