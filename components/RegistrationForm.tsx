"use client";

import { FormEvent, useState } from "react";
import { FormField } from "@/components/FormField";
import { SelectField } from "@/components/SelectField";

type FormState = "idle" | "submitting" | "success" | "error";

const initialMessage = "";

export function RegistrationForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState(initialMessage);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const payload = {
      fullName: String(formData.get("fullName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      age: String(formData.get("age") || ""),
      sex: String(formData.get("sex") || ""),
      bond: String(formData.get("bond") || ""),
      classOrSector: String(formData.get("classOrSector") || ""),
      projectGoal: String(formData.get("projectGoal") || ""),
      initialCondition: String(formData.get("initialCondition") || "")
    };

    setState("submitting");
    setMessage(initialMessage);

    const response = await fetch("/api/participantes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    if (!response.ok) {
      setState("error");
      setMessage(data?.message || "Nao foi possivel concluir a inscricao.");
      return;
    }

    form.reset();
    setState("success");
    setMessage(data?.message || "Inscricao realizada com sucesso.");
  }

  return (
    <form
      className="grid gap-5 rounded border border-forest/10 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit}
    >
      {message ? (
        <div
          className={
            state === "success"
              ? "rounded border border-forest/20 bg-forest/10 px-4 py-3 text-sm font-semibold text-forest"
              : "rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          }
          role="status"
        >
          {message}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Nome completo" name="fullName" required />
        <FormField label="E-mail" name="email" type="email" required />
        <FormField label="Telefone" name="phone" required />
        <FormField label="Idade" name="age" type="number" min="1" max="120" required />
        <SelectField
          label="Vinculo"
          name="bond"
          options={[
            "ESTUDANTE",
            "SERVIDOR",
            "TERCEIRIZADO",
            "COMUNIDADE_EXTERNA"
          ]}
          required
        />
        <SelectField
          label="Sexo"
          name="sex"
          options={["FEMININO", "MASCULINO", "OUTRO", "PREFIRO_NAO_INFORMAR"]}
          required
        />
        <FormField label="Turma ou setor" name="classOrSector" required />
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-graphite">
          Objetivo no projeto
        </span>
        <textarea
          className="min-h-28 w-full rounded border border-graphite/15 bg-white px-3 py-3 outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/10"
          name="projectGoal"
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-graphite">
          Condicao inicial informada
        </span>
        <textarea
          className="min-h-28 w-full rounded border border-graphite/15 bg-white px-3 py-3 outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/10"
          name="initialCondition"
        />
      </label>

      <label className="flex items-start gap-3 rounded bg-forest/5 p-4 text-sm text-graphite/75">
        <input className="mt-1" type="checkbox" required />
        <span>
          Li e aceito o termo de ciencia e consentimento. Confirmo que desejo
          participar do projeto e que os dados informados poderao ser usados
          pela equipe para acompanhamento das atividades.{" "}
          <a className="font-bold text-forest" href="/privacidade" target="_blank">
            Ver aviso de privacidade
          </a>
        </span>
      </label>

      <button
        type="submit"
        className="w-full rounded bg-forest px-5 py-3 font-black text-white shadow-sm transition hover:bg-forest/90 disabled:cursor-not-allowed disabled:bg-graphite/35 md:w-fit"
        disabled={state === "submitting"}
      >
        {state === "submitting" ? "Enviando..." : "Enviar inscricao"}
      </button>
    </form>
  );
}
