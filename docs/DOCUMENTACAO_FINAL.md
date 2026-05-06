# Documentacao final do IF RUNNERS Connect

## 1. Apresentacao do sistema

O IF RUNNERS Connect e um sistema web desenvolvido para apoiar o projeto de extensao **IF RUNNERS - Onde o Movimento Vira Cultura**, do IFPE Campus Garanhuns.

O sistema centraliza inscricoes, registros de corridas e caminhadas, validacao de atividades, agenda de eventos, confirmacao de presenca por QR Code, pontuacao gamificada, rankings e acompanhamento administrativo.

A versao atual e um MVP funcional, pensado para uso inicial, testes e evolucao gradual.

## 2. Objetivo

O objetivo do IF RUNNERS Connect e facilitar a gestao do projeto IF RUNNERS, permitindo que a equipe organizadora acompanhe participantes, atividades, presencas, pontuacoes e indicadores do projeto em uma unica plataforma.

Tambem busca estimular a participacao por meio de rankings, pontuacao e visibilidade das atividades realizadas.

## 3. Funcionalidades

- Pagina inicial institucional.
- Inscricao publica de participantes.
- Termo simples de ciencia e consentimento.
- Login administrativo.
- Painel administrativo protegido.
- Registro de atividades fisicas.
- Upload de comprovante ou envio de link GPS.
- Validacao administrativa de atividades.
- Pontuacao automatica.
- Agenda publica de eventos.
- Cadastro administrativo de eventos.
- QR Code da pagina de inscricao.
- QR Code individual por evento.
- Confirmacao de presenca via QR Code.
- Lista de presenca por evento.
- Rankings gerais e segmentados.
- Dashboard administrativo com indicadores e graficos simples.
- Exportacao CSV.
- Relatorio LGPD.

## 4. Perfis de usuarios

### Participante

Pode:

- acessar a pagina inicial;
- fazer inscricao;
- visualizar agenda;
- registrar atividades;
- consultar pontuacao e rankings;
- confirmar presenca em eventos via QR Code.

### Administrador

Pode:

- acessar o painel administrativo;
- visualizar inscritos;
- aprovar ou recusar atividades;
- cadastrar eventos;
- registrar presencas manualmente;
- visualizar listas de presenca;
- gerar e baixar QR Codes;
- visualizar dashboard;
- exportar dados em CSV.

## 5. Regras de pontuacao

As regras atuais estao centralizadas em `lib/scoring.ts`.

- 1 km de corrida aprovada: 10 pontos.
- 1 km de caminhada aprovada: 5 pontos.
- Participacao em treino coletivo: 30 pontos.
- Participacao em oficina ou palestra: 20 pontos.

A pontuacao e recalculada automaticamente quando:

- uma atividade e aprovada ou recusada;
- uma presenca em evento e registrada.

Atividades pendentes ou recusadas nao geram pontos.

## 6. Fluxo de inscricao

1. O participante acessa `/inscricao`.
2. Le a apresentacao e o aviso de uso dos dados.
3. Preenche os campos obrigatorios:
   - nome completo;
   - e-mail;
   - telefone;
   - idade;
   - sexo;
   - vinculo;
   - turma ou setor;
   - objetivo no projeto.
4. Pode informar a condicao inicial.
5. Aceita o termo simples de ciencia e consentimento.
6. O sistema valida os campos obrigatorios.
7. O sistema salva o participante no banco.
8. O participante recebe mensagem de confirmacao.

## 7. Fluxo de registro de atividades

1. O participante ou administrador acessa `/atividades`.
2. Seleciona o participante.
3. Informa:
   - tipo de atividade: corrida ou caminhada;
   - distancia em km;
   - tempo em minutos;
   - data;
   - link GPS;
   - comprovante;
   - observacao.
4. O sistema exige link GPS ou arquivo de comprovante.
5. A atividade e salva com status `PENDING`.
6. O administrador acessa `/admin/atividades`.
7. O administrador aprova ou recusa.
8. Se aprovada, a atividade gera pontos.
9. Se recusada, nao gera pontos.

## 8. Fluxo de QR Code

### QR Code de inscricao

1. O administrador acessa `/admin/qrcodes`.
2. Visualiza o QR Code da pagina publica de inscricao.
3. Pode baixar o QR Code em PNG ou SVG.
4. O QR Code pode ser usado em cartazes, slides, redes sociais e banners.

### QR Code de evento

1. Cada evento cadastrado recebe um token unico.
2. O sistema gera um QR Code individual para o evento.
3. O QR Code aponta para `/eventos/[token]/confirmar-presenca`.
4. O participante escaneia o QR Code.
5. Informa o e-mail usado na inscricao.
6. O sistema valida o evento e o participante.
7. O sistema impede presenca duplicada no mesmo evento.
8. O sistema registra a presenca e adiciona a pontuacao do evento.

## 9. Fluxo de eventos

1. O administrador acessa `/admin/agenda`.
2. Cadastra um evento com:
   - titulo;
   - tipo;
   - data;
   - horario;
   - local;
   - descricao;
   - pontuacao associada.
3. O evento aparece na agenda publica em `/agenda`.
4. O evento tambem aparece na tela de QR Codes.
5. Participantes visualizam os proximos eventos.
6. Presencas podem ser registradas por QR Code ou manualmente pelo administrador.

Tipos de evento:

- treino em grupo;
- oficina;
- palestra;
- corrida oficial.

## 10. Descricao do painel administrativo

O painel administrativo fica em `/admin` e e protegido por login.

Ele exibe:

- total de inscritos;
- total de atividades registradas;
- total de km corridos;
- total de km caminhados;
- total de eventos realizados;
- total de atividades pendentes;
- presencas registradas;
- km totais aprovados;
- participantes mais pontuados.

Tambem possui graficos simples:

- evolucao das inscricoes;
- quilometragem por semana;
- participacao por tipo de vinculo;
- distribuicao corrida x caminhada.

Modulos administrativos:

- Participantes: `/admin/inscritos`
- Atividades: `/admin/atividades`
- Agenda: `/admin/agenda`
- Presencas: `/admin/presencas`
- QR Codes: `/admin/qrcodes`
- Rankings: `/rankings`

## 11. Instrucoes de instalacao

### Requisitos

- Node.js instalado.
- npm ou npx funcionando no terminal.

### Passos

1. Instalar dependencias:

```bash
npm install
```

2. Criar o arquivo `.env`:

```bash
copy .env.example .env
```

No PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Criar o banco SQLite com Prisma:

```bash
npx prisma migrate dev --name init
```

4. Carregar dados ficticios:

```bash
npm run db:seed
```

5. Iniciar o servidor:

```bash
npm run dev
```

6. Abrir no navegador:

```text
http://localhost:3000
```

## 12. Instrucoes de uso para administradores

### Acesso

1. Acesse `/login`.
2. Informe e-mail e senha administrativos.
3. Acesse o painel em `/admin`.

Credenciais ficticias do seed:

```text
E-mail: admin@ifrunners.local
Senha: admin123
```

Essa senha deve ser alterada antes de qualquer uso real.

### Rotina basica

1. Divulgar o QR Code de inscricao em `/admin/qrcodes`.
2. Acompanhar inscritos em `/admin/inscritos`.
3. Cadastrar eventos em `/admin/agenda`.
4. Baixar QR Codes dos eventos em `/admin/qrcodes` ou `/admin/agenda`.
5. Validar atividades em `/admin/atividades`.
6. Registrar presencas manualmente em `/admin/presencas`, quando necessario.
7. Acompanhar rankings em `/rankings`.
8. Exportar dados CSV pelo dashboard `/admin`.

## 13. Limitacoes atuais

- A autenticacao administrativa e basica.
- Ainda nao ha perfis administrativos diferentes.
- Participantes nao possuem login proprio.
- Confirmacao de presenca por QR Code usa apenas e-mail.
- Uploads de comprovantes ainda ficam em pasta publica.
- Nao ha auditoria completa de alteracoes administrativas.
- Nao ha tela de edicao ou exclusao de eventos.
- Nao ha tela de edicao de participantes.
- Nao ha recuperacao de senha.
- Nao ha envio de e-mails automaticos.
- O banco inicial e SQLite, adequado para MVP e testes, mas limitado para uso amplo.
- Nao ha deploy configurado.
- O ambiente local atual ainda nao conseguiu validar `npm/npx`.

## 14. Funcionalidades futuras

- Login individual de participantes.
- Perfil do participante.
- Recuperacao de senha.
- Upload privado de comprovantes.
- Controle de permissoes por perfil administrativo.
- Auditoria de exportacoes, aprovacoes, recusas e presencas.
- Edicao e cancelamento de eventos.
- Exportacao em XLSX.
- Relatorios por periodo.
- Ranking por sexo, faixa etaria ou categoria configuravel.
- Modo de anonimizar rankings publicos.
- Confirmacao de presenca com token individual.
- Envio de e-mails de confirmacao.
- Dashboard com filtros por periodo.
- Deploy em ambiente institucional.
- Banco PostgreSQL para producao.
- Politica de retencao e exclusao de dados.
- Revisao formal do termo LGPD com a instituicao.
