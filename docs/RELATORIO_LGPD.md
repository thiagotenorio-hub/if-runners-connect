# Relatorio de seguranca, privacidade e LGPD

## Escopo

Sistema IF RUNNERS Connect, usado para inscricoes, atividades fisicas, eventos, presencas, pontuacoes, rankings, QR Codes e exportacoes.

## Base de cuidado

A LGPD protege dados pessoais e orienta o tratamento por principios como finalidade, adequacao, necessidade, transparencia, seguranca e prevencao. Dados referentes a saude ou condicao fisica exigem cuidado adicional, pois podem revelar informacoes sensiveis quando ligados a uma pessoa identificada.

Referencias consultadas:

- ANPD: perguntas frequentes sobre bases legais e dados pessoais sensiveis.
- Portais gov.br sobre principios da LGPD, tratamento de dados pessoais e agentes de tratamento.

## Dados coletados

- Nome completo.
- E-mail.
- Telefone.
- Idade.
- Sexo.
- Vinculo institucional.
- Turma ou setor.
- Objetivo no projeto.
- Condicao inicial informada.
- Atividades fisicas, distancia, tempo, data, link GPS e comprovantes.
- Presencas em eventos.
- Pontuacoes e rankings.

## Campos que nao devem ser publicos

Nao publicar em paginas abertas:

- e-mail;
- telefone;
- condicao inicial informada;
- objetivo individual quando revelar saude, limitacoes ou habitos pessoais;
- links GPS individuais;
- prints/comprovantes;
- idade individual, se nao houver necessidade;
- turma ou setor quando permitir exposicao indevida;
- listas completas de presenca com dados de contato.

Podem ser publicos com menor risco:

- ranking com nome, categoria ampla e pontos, se houver ciencia previa;
- agenda de eventos;
- totalizadores agregados, como total de inscritos e quilometragem total.

## Implementado nesta revisao

- Pagina publica de privacidade e termo simples: `/privacidade`.
- Aviso de uso de dados na inscricao.
- Checkbox de ciencia e consentimento com link para o aviso.
- Protecao basica do painel administrativo via login e cookie HTTP-only.
- Protecao basica das rotas `/api/admin`.
- Exportacoes CSV protegidas por login administrativo.
- Cabecalho `Cache-Control: no-store` nas exportacoes.

## Riscos atuais

1. Autenticacao administrativa ainda e basica.
   - Risco: cookie simples nao substitui sessao robusta.
   - Melhoria: usar sessao assinada, expiracao curta, rotacao de segredo e controle por perfil.

2. Exportacao CSV contem dados pessoais.
   - Risco: compartilhamento indevido fora do projeto.
   - Melhoria: registrar logs de exportacao, restringir por perfil e orientar armazenamento seguro.

3. Comprovantes e prints podem conter dados de saude, localizacao e rotas.
   - Risco: exposicao de localizacao e habitos pessoais.
   - Melhoria: restringir acesso aos arquivos, evitar pasta publica para comprovantes e definir prazo de retencao.

4. Rankings podem expor desempenho individual.
   - Risco: constrangimento ou exposicao indevida.
   - Melhoria: manter ciencia expressa na inscricao e permitir opt-out de exibicao publica, se o projeto decidir.

5. Condicao inicial informada pode conter dado sensivel.
   - Risco: tratamento inadequado de informacao sobre saude.
   - Melhoria: limitar o campo, deixar claro que nao se deve inserir laudos, diagnosticos ou dados clinicos detalhados.

6. QR Code de presenca confirma por e-mail.
   - Risco: outra pessoa pode confirmar presenca se souber o e-mail.
   - Melhoria: adicionar login do participante, token individual ou validacao pela equipe no local.

7. Falta politica de retencao.
   - Risco: manter dados por tempo maior que o necessario.
   - Melhoria: definir prazo de guarda e rotina de exclusao/anominizacao ao final do ciclo.

## Melhorias recomendadas

- Definir controlador, operador e encarregado pelo tratamento de dados.
- Publicar canal de contato para direitos do titular.
- Criar politica de retencao de dados.
- Evitar coletar CPF, RG, endereco ou dados clinicos se nao forem indispensaveis.
- Mover uploads de comprovantes para area privada.
- Registrar auditoria de aprovacoes, recusas, presencas e exportacoes.
- Adicionar perfis administrativos, por exemplo: coordenacao, bolsista, visualizador.
- Usar HTTPS em producao.
- Usar senhas fortes e alterar a senha padrao do seed.
- Fazer backup seguro e criptografado do banco.
- Revisar o termo com a gestao institucional ou encarregado de dados do IFPE.
