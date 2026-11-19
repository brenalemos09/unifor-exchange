# UNIFOR Exchange

Plataforma web de apoio à mobilidade acadêmica internacional da UNIFOR. Reúne países, universidades conveniadas e oportunidades em um só lugar. Tem caráter **informativo e orientativo** e não substitui os processos oficiais da DRI.

Disciplina: Desenvolvimento de Plataformas Web — UNIFOR.

## Acesse o sistema publicado

| O quê | Endereço |
|---|---|
| Site (Vercel) | https://unifor-exchange.vercel.app |
| Tutorial "Como usar" | https://unifor-exchange.vercel.app/como-usar |
| API (Render) | https://unifor-exchange-api-puw9.onrender.com (teste: `/saude`) |
| Site reserva (Render) | https://unifor-exchange-puw9.onrender.com |

> A API está no plano gratuito do Render e "dorme" após ~15 min sem uso. O primeiro acesso depois disso pode levar até 1 minuto.

## Estrutura do projeto

```
unifor-exchange/
├── frontend/   → site (React + Vite + Bootstrap)
├── api/        → servidor (Node.js + Express + Prisma) que conversa com o banco MySQL
└── README.md
```

## Como rodar

Precisa do Node.js instalado. São **dois terminais**.

### 1) API (back-end)

```bash
cd api
npm install
cp .env.example .env     # preencha o .env com os dados passados pelo Hafiz (LEIA-ME_BANCO)
npx prisma generate
npm run dev              # sobe em http://localhost:3000
```

Teste rápido: abra http://localhost:3000/saude → deve aparecer `{"ok":true}`.
Testes do banco: `npm run testar` (esperado: "0 FALHARAM").

> Depois de todo `git pull`: rode `npm install` e `npx prisma generate` dentro de `api/`.

### 2) Front-end

```bash
cd frontend
npm install
npm run dev              # abre em http://localhost:5173
```

O front usa a API em `http://localhost:3000`. Para mudar, copie `frontend/.env.example` para `frontend/.env`.

## Variáveis de ambiente

| Onde | Variável | Para quê | Padrão |
|---|---|---|---|
| `api/.env` | `DATABASE_*`, `JWT_SECRET` | Banco e assinatura do login (pedir ao Hafiz, nunca subir) | — |
| `api/.env` | `PORT` | Porta da API | `3000` |
| `api/.env` | `CORS_ORIGEM` | Endereço(s) do site que podem chamar a API, separados por vírgula | `http://localhost:5173` |
| `api/.env` | `RECUPERACAO_DEMO` | `true` devolve o código de recuperação de senha na resposta (só para demonstração) | `false` |
| `frontend/.env` | `VITE_API_URL` | Endereço da API usado pelo site (lido no build) | `http://localhost:3000` |

Se o site rodar em outra porta (ex.: 5174), inclua o endereço em `CORS_ORIGEM`, senão o navegador bloqueia as chamadas.

## Publicação

O site e a API são publicados separadamente. O banco continua no Aiven.

### 1) API no Render

1. No [Render](https://render.com): **New → Blueprint** e escolha este repositório. O arquivo `render.yaml` já configura o serviço `unifor-exchange-api` (pasta `api/`, build `npm install && npm run build`, start `npm start`, checagem em `/saude`).
2. Preencha no painel as variáveis marcadas como secretas: `DATABASE_*` e `JWT_SECRET` (os mesmos valores do `.env`) e `CORS_ORIGEM` com o endereço do site publicado (passo 2).
3. Teste: `https://<endereço-da-api>/saude` deve mostrar `{"ok":true}`.

> No plano gratuito do Render a API "dorme" após uns 15 minutos sem uso. O primeiro acesso depois disso pode levar até 1 minuto.

### 2) Site na Vercel

1. Na [Vercel](https://vercel.com): **Add New → Project**, escolha este repositório e defina **Root Directory = `frontend`** (o Vite é detectado sozinho).
2. Em **Environment Variables**, crie `VITE_API_URL` com o endereço da API do Render (sem barra no final) e faça o deploy.
3. Volte ao Render e confira se `CORS_ORIGEM` tem exatamente o endereço da Vercel (ex.: `https://unifor-exchange.vercel.app`).

O site usa rotas do React; `frontend/vercel.json` (Vercel) e `frontend/public/_redirects` (Netlify) já mandam todas as rotas para o `index.html`.

### Antes de divulgar o link

- Troque as senhas das contas de teste (principalmente as de administrador): com o site público, qualquer pessoa que conheça a senha consegue entrar na área administrativa.
- Novos commits na `main` publicam sozinhos nas duas plataformas.

## Recuperação de senha

Ainda não há envio de e-mail. O código de 6 dígitos (vale 15 minutos) aparece no terminal da API. Com `RECUPERACAO_DEMO=true`, ele também aparece na tela, para demonstração.

## Login de teste

Senha de todos os usuários de teste: `1234`. Administradores: matrículas `1911207` e `2111320`. Estudante: `2511483`.
A área administrativa (`/admin`) só abre para administradores.

O tutorial para estudantes fica em `/como-usar` (link no rodapé e na página inicial).

## Regras do banco (importante)

- O banco é **compartilhado** pelo grupo. Não rode seed/DDL de novo e tenha cuidado com `DELETE`, `UPDATE`, `DROP` e `TRUNCATE`.
- Nunca suba o arquivo `.env` para o GitHub.

## Status

- **Etapa 1 — Plano de Trabalho:** concluída.
- **Etapa 2 — MVP:** concluída. Catálogo, detalhes, login e CRUD de universidades ligados à API.
- **Etapa 3 — Sistema completo:** todas as telas usam a API e o banco:
  - Cadastro, login, sair, recuperação de senha e telas protegidas (Minha Jornada, resultado do quiz e admin).
  - Mapa e página do país, catálogo, detalhes (com oportunidades e relatos), oportunidades com filtros.
  - Favoritos e checklist da Minha Jornada salvos no banco.
  - Quiz com recomendações, índice de compatibilidade e aviso de que o resultado é orientativo.
  - Experiências de estudantes, requisitos, contatos e verificação de elegibilidade.
  - Área administrativa com cadastro, edição e exclusão de universidades, países, oportunidades e conteúdo institucional.
  - Telas conferidas no celular (375px), tablet e computador; CORS restrito ao endereço do site.
- **Publicação e tutorial (nov/2026):** concluída.
  - Site publicado na Vercel (pasta `frontend/`) e API publicada no Render (pasta `api/`, configurada pelo `render.yaml`), ligadas ao banco no Aiven.
  - Nova tela **Como usar** (`/como-usar`): passo a passo para o estudante e dúvidas frequentes, com link no rodapé e na página inicial.
  - Atualizações automáticas: novos commits na `main` publicam o site e a API sozinhos.

## Fluxo de Git

- `main`: versão estável. Branches de trabalho: `feature/...`. Commits: `feat`, `fix`, `style`, `docs`, `refactor`.
- Nada vai direto para a `main`: entra por Pull Request, revisado em grupo.

## Equipe

Brena Vitória Aguiar Lemos · Catarina Thaís Lima Pimentel · Enzo Fernandes Paulino · Hafiz Oliveira Costa · Thaís Câncio Rodrigues de Góis

## Links

- Site publicado: https://unifor-exchange.vercel.app
- Tutorial para estudantes: https://unifor-exchange.vercel.app/como-usar
- API publicada: https://unifor-exchange-api-puw9.onrender.com
- Trello: https://trello.com/invite/b/6a97079f2a71436af601617a/ATTI88d87562c6b07786dc9cbd3cc9bcfbce1B77E1FD/unifor-exchange
- Figma: https://www.figma.com/design/hFSbuZDYrMKZYXx4D9NAeS/UNIFOR-Exchange-%E2%80%94-Prot%C3%B3tipo-Web?node-id=1-6
