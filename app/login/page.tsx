import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";
import { PageShell } from "@/components/PageShell";

export default function LoginPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-md px-5 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-graphite">
            Login administrativo
          </h1>
          <p className="mt-2 text-graphite/70">
            Acesso restrito à equipe autorizada do IF RUNNERS Connect.
          </p>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>

        <Link
          href="/inscricao"
          className="mt-5 inline-flex text-sm font-semibold text-forest"
        >
          Acessar inscrição pública
        </Link>
      </section>
    </PageShell>
  );
}
