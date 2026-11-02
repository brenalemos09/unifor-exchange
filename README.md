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

## Login de teste

Senha de todos os usuários de teste: `1234`. Administradores: matrículas `1911207` e `2111320`. Estudante: `2511483`.
A área administrativa (`/admin`) só abre para administradores.

## Regras do banco (importante)

- O banco é **compartilhado** pelo grupo. Não rode seed/DDL de novo e tenha cuidado com `DELETE`, `UPDATE`, `DROP` e `TRUNCATE`.
- Nunca suba o arquivo `.env` para o GitHub.

## Status

- **Etapa 1 — Plano de Trabalho:** concluída.
- **Etapa 2 — MVP:** em desenvolvimento. Catálogo, detalhes e área administrativa (CRUD de universidades) ligados à API e ao banco; login funcionando.
- Ainda com dados de exemplo no próprio front (serão ligados à API na Etapa 3): mapa, país, quiz/resultado, oportunidades, Minha Jornada e favoritos.

## Fluxo de Git

- `main`: versão estável. Branches de trabalho: `feature/...`. Commits: `feat`, `fix`, `style`, `docs`, `refactor`.
- Nada vai direto para a `main`: entra por Pull Request, revisado em grupo.

## Equipe

Brena Vitória Aguiar Lemos · Catarina Thaís Lima Pimentel · Enzo Fernandes Paulino · Hafiz Oliveira Costa · Thaís Câncio Rodrigues de Góis

## Links

- Trello: https://trello.com/invite/b/6a97079f2a71436af601617a/ATTI88d87562c6b07786dc9cbd3cc9bcfbce1B77E1FD/unifor-exchange
- Figma: https://www.figma.com/design/hFSbuZDYrMKZYXx4D9NAeS/UNIFOR-Exchange-%E2%80%94-Prot%C3%B3tipo-Web?node-id=1-6
