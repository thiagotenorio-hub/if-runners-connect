type RegistrationEmailInput = {
  email: string;
  fullName: string;
};

function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export async function sendRegistrationConfirmationEmail({
  email,
  fullName
}: RegistrationEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return false;
  }

  const from =
    process.env.REGISTRATION_EMAIL_FROM ||
    "IF RUNNERS CONNECT <onboarding@resend.dev>";
  const loginUrl = `${siteUrl()}/entrar`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: "Inscricao confirmada no IF RUNNERS CONNECT",
      html: `
        <div style="font-family: Arial, sans-serif; color: #1f2933; line-height: 1.6;">
          <h1 style="color: #176b43;">Inscricao confirmada</h1>
          <p>Ola, ${fullName}.</p>
          <p>Sua inscricao no IF RUNNERS CONNECT foi realizada com sucesso.</p>
          <p>Voce ja pode acessar sua area com o e-mail e a senha cadastrados.</p>
          <p>
            <a href="${loginUrl}" style="display: inline-block; background: #176b43; color: #ffffff; padding: 12px 18px; border-radius: 6px; text-decoration: none; font-weight: bold;">
              Acessar minha area
            </a>
          </p>
          <p>Se o botao nao abrir, acesse: ${loginUrl}</p>
        </div>
      `,
      text: `Ola, ${fullName}. Sua inscricao no IF RUNNERS CONNECT foi realizada com sucesso. Voce ja pode acessar sua area com o e-mail e a senha cadastrados: ${loginUrl}`
    })
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(details || "Falha ao enviar e-mail de confirmacao.");
  }

  return true;
}
