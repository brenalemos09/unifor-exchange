import { Router } from "express";
import { prisma } from "../prisma";
import { autenticar } from "../auth";
import { inteiro } from "../util";

export const estudanteRouter = Router();

// Todas as rotas deste arquivo exigem login
estudanteRouter.use(autenticar);

const matriculaDe = (res: any) => Number(res.locals.usuario.matricula);

/* ---------------------------- FAVORITOS (RF12) ---------------------------- */

// GET /favoritos
estudanteRouter.get("/favoritos", async (_req, res) => {
  const lista = await prisma.favorito.findMany({
    where: { matricula: matriculaDe(res) },
    orderBy: { data_insercao: "desc" },
    include: {
      universidade: {
        select: { id_universidade: true, nome: true, cidade: true, pais_nome_oficial: true },
      },
    },
  });
  res.json(lista);
});

// POST /favoritos/:idUniversidade   (pode repetir sem erro)
estudanteRouter.post("/favoritos/:idUniversidade", async (req, res) => {
  const idUniversidade = inteiro(req.params.idUniversidade);
  if (!idUniversidade) return res.status(400).json({ erro: "id inválido" });

  const existe = await prisma.universidade.findUnique({ where: { id_universidade: idUniversidade } });
  if (!existe) return res.status(404).json({ erro: "Universidade não encontrada" });

  const matricula = matriculaDe(res);
  const fav = await prisma.favorito.upsert({
    where: { matricula_id_universidade: { matricula, id_universidade: idUniversidade } },
    update: {},
    create: { matricula, id_universidade: idUniversidade },
  });
  res.status(201).json(fav);
});

// DELETE /favoritos/:idUniversidade
estudanteRouter.delete("/favoritos/:idUniversidade", async (req, res) => {
  const idUniversidade = inteiro(req.params.idUniversidade);
  if (!idUniversidade) return res.status(400).json({ erro: "id inválido" });

  await prisma.favorito.deleteMany({
    where: { matricula: matriculaDe(res), id_universidade: idUniversidade },
  });
  res.status(204).end();
});

/* ------------------------ CHECKLIST / PROGRESSO (RF16) ------------------------ */

// GET /checklist  -> itens do checklist com o status do usuário e o % de progresso
estudanteRouter.get("/checklist", async (_req, res) => {
  const matricula = matriculaDe(res);

  const itens = await prisma.conteudo_institucional.findMany({
    where: { tipo: "checklist_item" },
    orderBy: [{ ordem: "asc" }, { id_conteudo: "asc" }],
  });
  const feitos = await prisma.acompanhamento.findMany({ where: { matricula } });
  const porConteudo = new Map(feitos.map((a) => [a.id_conteudo, a]));

  const lista = itens.map((i) => {
    const a = porConteudo.get(i.id_conteudo);
    return {
      id_conteudo: i.id_conteudo,
      titulo: i.titulo,
      descricao: i.descricao,
      ordem: i.ordem,
      status: a?.status ?? "pendente",
      data_conclusao: a?.data_conclusao ?? null,
    };
  });

  const concluidos = lista.filter((i) => i.status === "concluido").length;
  res.json({
    progresso: lista.length ? Math.round((100 * concluidos) / lista.length) : 0,
    concluidos,
    total: lista.length,
    itens: lista,
  });
});

// PUT /checklist/:idConteudo   body: { "concluido": true }
estudanteRouter.put("/checklist/:idConteudo", async (req, res) => {
  const idConteudo = inteiro(req.params.idConteudo);
  if (!idConteudo) return res.status(400).json({ erro: "id inválido" });
  if (typeof req.body?.concluido !== "boolean") {
    return res.status(400).json({ erro: "Envie { \"concluido\": true } ou { \"concluido\": false }" });
  }

  const item = await prisma.conteudo_institucional.findUnique({ where: { id_conteudo: idConteudo } });
  if (!item || item.tipo !== "checklist_item") {
    return res.status(404).json({ erro: "Item de checklist não encontrado" });
  }

  const matricula = matriculaDe(res);
  const concluido: boolean = req.body.concluido;
  // data de hoje no fuso de Fortaleza (mesma lógica das oportunidades)
  const hoje = new Date(new Date().toLocaleDateString("sv-SE", { timeZone: "America/Fortaleza" }));

  const dados = {
    status: concluido ? ("concluido" as const) : ("pendente" as const),
    data_conclusao: concluido ? hoje : null,
  };
  const a = await prisma.acompanhamento.upsert({
    where: { matricula_id_conteudo: { matricula, id_conteudo: idConteudo } },
    update: dados,
    create: { matricula, id_conteudo: idConteudo, ...dados },
  });
  res.json(a);
});

/* ---------------------------- RELATOS (RF17) ---------------------------- */

// POST /relatos   body: { titulo, texto, nota?, id_universidade? }
estudanteRouter.post("/relatos", async (req, res) => {
  const titulo = String(req.body?.titulo ?? "").trim();
  const texto = String(req.body?.texto ?? "").trim();
  if (!titulo || !texto) return res.status(400).json({ erro: "titulo e texto são obrigatórios" });
  if (titulo.length > 200) return res.status(400).json({ erro: "titulo deve ter até 200 caracteres" });

  let nota: number | null = null;
  if (req.body?.nota !== undefined && req.body.nota !== null) {
    nota = Number(req.body.nota);
    if (Number.isNaN(nota) || nota < 0 || nota > 10) {
      return res.status(400).json({ erro: "nota deve ser um número de 0 a 10" });
    }
  }

  let idUniversidade: number | null = null;
  if (req.body?.id_universidade !== undefined && req.body.id_universidade !== null) {
    idUniversidade = inteiro(req.body.id_universidade) ?? null;
    const existe = idUniversidade
      ? await prisma.universidade.findUnique({ where: { id_universidade: idUniversidade } })
      : null;
    if (!existe) return res.status(400).json({ erro: "id_universidade inválido" });
  }

  const relato = await prisma.feedback_experiencia.create({
    data: { titulo, texto, nota, id_universidade: idUniversidade, matricula: matriculaDe(res) },
  });
  res.status(201).json(relato);
});

// DELETE /relatos/:id   (só o autor ou um administrador)
estudanteRouter.delete("/relatos/:id", async (req, res) => {
  const id = inteiro(req.params.id);
  if (!id) return res.status(400).json({ erro: "id inválido" });

  const relato = await prisma.feedback_experiencia.findUnique({ where: { id_experiencia: id } });
  if (!relato) return res.status(404).json({ erro: "Relato não encontrado" });

  const ehAdmin = res.locals.usuario.tipo === "administrador";
  if (relato.matricula !== matriculaDe(res) && !ehAdmin) {
    return res.status(403).json({ erro: "Você só pode apagar os seus próprios relatos" });
  }

  await prisma.feedback_experiencia.delete({ where: { id_experiencia: id } });
  res.status(204).end();
});