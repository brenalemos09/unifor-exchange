# UNIFOR Exchange

Plataforma web de apoio à mobilidade acadêmica internacional da UNIFOR. Reúne países, universidades conveniadas e oportunidades em um só lugar. Tem caráter **informativo e orientativo** e não substitui os processos oficiais da DRI.

Disciplina: Desenvolvimento de Plataformas Web — UNIFOR.

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

## Publicação (quando o grupo decidir)

1. **API**: publicar a pasta `api/` em um serviço Node (rodando `npm install`, `npx prisma generate` e `npm start`). Configurar no painel as variáveis do `.env` e `CORS_ORIGEM` com o endereço do site publicado.
2. **Front**: publicar a pasta `frontend/` em um serviço de site estático (`npm run build`, pasta `dist`). Configurar `VITE_API_URL` com o endereço da API publicada **antes** do build.
3. O site usa rotas do React; `frontend/public/_redirects` (Netlify) e `frontend/vercel.json` (Vercel) já mandam todas as rotas para o `index.html`.

## Recuperação de senha

Ainda não há envio de e-mail. O código de 6 dígitos (vale 15 minutos) aparece no terminal da API. Com `RECUPERACAO_DEMO=true`, ele também aparece na tela, para demonstração.

## Login de teste

Senha de todos os usuários de teste: `1234`. Administradores: matrículas `1911207` e `2111320`. Estudante: `2511483`.
A área administrativa (`/admin`) só abre para administradores.

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

## Fluxo de Git

- `main`: versão estável. Branches de trabalho: `feature/...`. Commits: `feat`, `fix`, `style`, `docs`, `refactor`.
- Nada vai direto para a `main`: entra por Pull Request, revisado em grupo.

## Equipe

Brena Vitória Aguiar Lemos · Catarina Thaís Lima Pimentel · Enzo Fernandes Paulino · Hafiz Oliveira Costa · Thaís Câncio Rodrigues de Góis

## Links

- Trello: https://trello.com/invite/b/6a97079f2a71436af601617a/ATTI88d87562c6b07786dc9cbd3cc9bcfbce1B77E1FD/unifor-exchange
- Figma: https://www.figma.com/design/hFSbuZDYrMKZYXx4D9NAeS/UNIFOR-Exchange-%E2%80%94-Prot%C3%B3tipo-Web?node-id=1-6
