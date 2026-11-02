import { Router } from "express";
import { prisma } from "../prisma";
import { inteiro } from "../util";

export const conteudoRouter = Router();

const AVISO =
  "Resultado orientativo (não oficial). A confirmação da elegibilidade depende do edital e da coordenação de intercâmbio.";

/* ------------------------- REQUISITOS, CONTATOS, CHECKLIST ------------------------- */

// GET /conteudo/requisitos
conteudoRouter.get("/conteudo/requisitos", async (_req, res) => {
  res.json(
    await prisma.conteudo_institucional.findMany({
      where: { tipo: "requisito" },
      orderBy: { ordem: "asc" },
    })
  );
});

// GET /conteudo/contatos
conteudoRouter.get("/conteudo/contatos", async (_req, res) => {
  res.json(
    await prisma.conteudo_institucional.findMany({
      where: { tipo: "contato" },
      orderBy: { id_conteudo: "asc" },
    })
  );
});

// GET /conteudo/checklist  (modelo geral, sem progresso; o progresso do usuário fica em /checklist)
conteudoRouter.get("/conteudo/checklist", async (_req, res) => {
  res.json(
    await prisma.conteudo_institucional.findMany({
      where: { tipo: "checklist_item" },
      orderBy: { ordem: "asc" },
    })
  );
});

/* ------------------------------ ELEGIBILIDADE (RF15) ------------------------------ */

// GET /elegibilidade  -> perguntas a exibir (só os requisitos verificáveis)
conteudoRouter.get("/elegibilidade", async (_req, res) => {
  const itens = await prisma.conteudo_institucional.findMany({
    where: { tipo: "requisito", verificavel_elegibilidade: true },
    orderBy: { ordem: "asc" },
    select: { id_conteudo: true, titulo: true, descricao: true },
  });
  res.json(itens);
});

// POST /elegibilidade   body: { "atendidos": [1, 2, 3] }  (ids dos requisitos que a pessoa afirma cumprir)
conteudoRouter.post("/elegibilidade", async (req, res) => {
  if (!Array.isArray(req.body?.atendidos)) {
    return res.status(400).json({ erro: "Envie { \"atendidos\": [ids dos requisitos que você cumpre] }" });
  }
  const atendidos = new Set<number>(
    req.body.atendidos.map((v: unknown) => inteiro(v)).filter((v: number | undefined | null) => !!v)
  );

  const requisitos = await prisma.conteudo_institucional.findMany({
    where: { tipo: "requisito", verificavel_elegibilidade: true },
    orderBy: { ordem: "asc" },
    select: { id_conteudo: true, titulo: true },
  });

  const detalhes = requisitos.map((r) => ({ ...r, atendido: atendidos.has(r.id_conteudo) }));
  const pendentes = detalhes.filter((d) => !d.atendido);

  res.json({
    elegivel: pendentes.length === 0,
    atendidos: detalhes.length - pendentes.length,
    total: detalhes.length,
    pendentes,
    detalhes,
    aviso: AVISO,
  });
});

/* ------------------------------ RELATOS (leitura pública) ------------------------------ */

const primeiroNome = (nome?: string | null) => (nome ? nome.trim().split(/\s+/)[0] : null);

// GET /relatos?universidade=&busca=
conteudoRouter.get("/relatos", async (req, res) => {
  const idUniversidade = inteiro(req.query.universidade);
  const busca = String(req.query.busca ?? "").trim();

  const lista = await prisma.feedback_experiencia.findMany({
    where: {
      ...(idUniversidade ? { id_universidade: idUniversidade } : {}),
      ...(busca ? { OR: [{ titulo: { contains: busca } }, { texto: { contains: busca } }] } : {}),
    },
    orderBy: { data_publicacao: "desc" },
    include: {
      usuario: { select: { nome: true } },
      universidade: { select: { id_universidade: true, nome: true } },
    },
  });

  res.json(
    lista.map(({ usuario, matricula, nota, ...r }) => ({
      ...r,
      nota: nota === null ? null : Number(nota),
      autor: primeiroNome(usuario?.nome), // só o primeiro nome, por privacidade
    }))
  );
});

// GET /relatos/:id
conteudoRouter.get("/relatos/:id", async (req, res) => {
  const id = inteiro(req.params.id);
  if (!id) return res.status(400).json({ erro: "id inválido" });

  const r = await prisma.feedback_experiencia.findUnique({
    where: { id_experiencia: id },
    include: {
      usuario: { select: { nome: true } },
      universidade: { select: { id_universidade: true, nome: true } },
    },
  });
  if (!r) return res.status(404).json({ erro: "Relato não encontrado" });

  const { usuario, matricula, nota, ...resto } = r;
  res.json({ ...resto, nota: nota === null ? null : Number(nota), autor: primeiroNome(usuario?.nome) });
});