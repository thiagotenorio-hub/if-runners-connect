# Publicacao online da primeira versao

Este guia usa:

- GitHub para guardar o codigo.
- Vercel para publicar o site.
- Neon para guardar os dados online.

## 1. Criar o banco online no Neon

1. Acesse https://neon.tech/
2. Entre com sua conta.
3. Crie um novo projeto.
4. Copie a connection string do banco.

Ela se parece com isto:

```text
postgresql://usuario:senha@host.neon.tech/banco?sslmode=require
```

## 2. Variaveis de ambiente

Na Vercel, configure estas variaveis:

```text
DATABASE_URL=postgresql://usuario:senha@host.neon.tech/banco?sslmode=require
AUTH_SECRET=uma-chave-grande-e-secreta
```

Para gerar uma chave simples, voce pode usar um texto longo e dificil de adivinhar.

## 3. Preparar as tabelas do banco

Depois de colocar a `DATABASE_URL` do Neon no seu `.env`, rode:

```powershell
npm run prisma:push
npm run db:seed
```

O seed cria o acesso inicial:

```text
E-mail: admin@ifrunners.local
Senha: admin123
```

Troque essa senha antes de usar com participantes reais.

## 4. Publicar na Vercel

1. Acesse https://vercel.com/
2. Clique em Add New Project.
3. Escolha o repositorio do GitHub.
4. Configure as variaveis `DATABASE_URL` e `AUTH_SECRET`.
5. Clique em Deploy.

## Observacao sobre comprovantes

Na primeira versao online, o envio de arquivo de comprovante fica bloqueado na Vercel. Use link GPS para registrar atividades.

Isso evita perder arquivos, porque a Vercel nao guarda uploads enviados para a pasta do projeto. Uma versao futura pode usar armazenamento online como Supabase Storage, UploadThing ou S3.
