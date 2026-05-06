# IF RUNNERS Connect

Sistema web inicial para o projeto de extensao **IF RUNNERS - Onde o Movimento Vira Cultura**, do IFPE Campus Garanhuns.

Esta versao e a base do MVP. Ela ja traz a estrutura visual, paginas principais e o desenho inicial do banco de dados.

## O que ja existe

- Tela inicial funcional.
- Pagina de inscricao de participante.
- Salvamento de inscricoes no banco.
- Validacao de campos obrigatorios na inscricao.
- Registro de atividades fisicas com link GPS ou upload de comprovante.
- Revisao administrativa para aprovar ou recusar atividades.
- Geracao de pontos apenas para atividades aprovadas.
- Regras de pontuacao centralizadas.
- Registro administrativo de presencas em eventos.
- Tela geral de pontuacao por participante.
- Rankings por pontuacao, quilometragem, vinculo e turma/setor.
- Agenda publica de eventos.
- Cadastro administrativo de treinos, oficinas, palestras e corrida oficial.
- QR Code administrativo para a pagina publica de inscricao.
- QR Code individual por evento para confirmacao de presenca.
- Lista administrativa de presenca por evento.
- Dashboard administrativo com indicadores, graficos simples e exportacao CSV.
- Termo simples de ciencia e consentimento.
- Protecao basica do painel administrativo.
- Relatorio LGPD em `docs/RELATORIO_LGPD.md`.
- Pagina de login.
- Painel administrativo.
- Tela administrativa para listar inscritos.
- Estrutura com Next.js, Tailwind, Prisma e PostgreSQL para publicacao online.
- Base para autenticacao simples com senha criptografada.
- Modelo do banco para administradores, participantes, atividades, eventos, presencas, pontuacoes e rankings.
- Dados ficticios para teste.

## Tecnologias

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL

## Publicacao online

O projeto esta preparado para publicar a primeira versao na Vercel usando banco PostgreSQL online.

Guia passo a passo:

```text
docs/PUBLICACAO_ONLINE.md
```

## Como rodar

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo de ambiente:

```bash
copy .env.example .env
```

No PowerShell, tambem pode usar:

```powershell
Copy-Item .env.example .env
```

3. Prepare o banco:

```bash
npm run prisma:push
```

4. Carregue dados ficticios de teste:

```bash
npm run db:seed
```

5. Inicie o sistema:

```bash
npm run dev
```

6. Abra no navegador:

```text
http://localhost:3000
```

## Estrutura principal

```text
app/
  agenda/
  admin/
    agenda/
    atividades/
    eventos/
    inscritos/
    presencas/
    qrcodes/
  atividades/
  inscricao/
  rankings/
  api/
    admin/
      eventos/
      export/
      atividades/
      presencas/
      qrcodes/
    eventos/
    atividades/
    participantes/
  login/
  privacidade/
  globals.css
  layout.tsx
  page.tsx
components/
  ActivityForm.tsx
  ActivityReviewActions.tsx
  AttendanceForm.tsx
  EventForm.tsx
  FormField.tsx
  Header.tsx
  LoginForm.tsx
  PageShell.tsx
  RankingTable.tsx
  RegistrationForm.tsx
  SelectField.tsx
lib/
  auth.ts
  prisma.ts
  scoring.ts
prisma/
  seed.js
  schema.prisma
```

## Dados de teste

O seed cria:

- 1 administrador;
- 4 participantes;
- 4 atividades fisicas;
- 2 eventos;
- 3 presencas;
- pontuacoes de atividade e presenca;
- ranking geral inicial.

Administrador de teste:

```text
E-mail: admin@ifrunners.local
Senha: admin123
```

## Padroes usados no banco

Campos de status e tipo usam textos padronizados para manter compatibilidade simples no MVP.

Valores sugeridos:

- `Participant.bond`: `ESTUDANTE`, `SERVIDOR`, `TERCEIRIZADO`, `COMUNIDADE_EXTERNA`
- `Activity.type`: `RUN`, `WALK`
- `Activity.status`: `PENDING`, `APPROVED`, `REJECTED`
- `Event.type`: `TRAINING`, `WORKSHOP`, `LECTURE`, `OFFICIAL_RACE`
- `Score.source`: `ACTIVITY`, `EVENT_ATTENDANCE`, `MANUAL_ADJUSTMENT`
- `Ranking.scope`: `GENERAL`, `BOND`, `SEX`, `ACTIVITY_TYPE`

## Regras de pontuacao

- 1 km de corrida aprovada: 10 pontos.
- 1 km de caminhada aprovada: 5 pontos.
- Participacao em treino coletivo: 30 pontos.
- Participacao em oficina ou palestra: 20 pontos.

O recalcule automatico acontece quando:

- uma atividade e aprovada ou recusada;
- uma presenca em evento e registrada;

Tela de pontuacao:

```text
http://localhost:3000/pontuacao
```

Tela de rankings:

```text
http://localhost:3000/rankings
```

Tela de agenda publica:

```text
http://localhost:3000/agenda
```

Cadastro administrativo da agenda:

```text
http://localhost:3000/admin/agenda
```

Tela administrativa de QR Codes:

```text
http://localhost:3000/admin/qrcodes
```

Aviso de privacidade e termo simples:

```text
http://localhost:3000/privacidade
```

Relatorio LGPD:

```text
docs/RELATORIO_LGPD.md
```

Documentacao final:

```text
docs/DOCUMENTACAO_FINAL.md
```

Confirmacao de presenca via QR Code de evento:

```text
http://localhost:3000/eventos/[token]/confirmar-presenca
```

Lista administrativa de presencas de um evento:

```text
http://localhost:3000/admin/eventos/[id]/presencas
```

## Fluxo de atividades

1. O participante ou administrador acessa `/atividades`.
2. Seleciona o participante e cadastra corrida ou caminhada.
3. Informa distancia, tempo, data e observacao opcional.
4. Envia link GPS ou comprovante.
5. A atividade entra como `PENDING`.
6. O administrador acessa `/admin/atividades`.
7. Ao aprovar, o sistema cria pontos em `Score`.
8. Ao recusar, a atividade nao gera pontos; se ja houver pontuacao anterior, ela e removida.

As regras detalhadas ficam centralizadas em `lib/scoring.ts`.
