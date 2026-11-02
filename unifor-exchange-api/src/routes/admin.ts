import { Router, Request, Response } from "express";
import { prisma } from "../prisma";
import { autenticar, apenasAdmin } from "../auth";
import { inteiro } from "../util";

export const adminRouter = Router();

// Tudo aqui exige login E perfil de administrador
adminRouter.use(autenticar, apenasAdmin);

/* ---------- utilitários ---------- */

// Converte erros do Prisma em respostas HTTP claras
function tratar(fn: (req: Request, res: Response) => Promise<unknown>) {
  return async (req: Request, res: Response) => {
    try {
      await fn(req, res);
    } catch (e: any) {
      if (e?.code === "P2002") return res.status(409).json({ erro: "Já existe um registro com esse valor único" });
      if (e?.code === "P2003") return res.status(409).json({ erro: "Operação bloqueada: há registros ligados a este item ou referência inválida" });
      if (e?.code === "P2025") return res.status(404).json({ erro: "Registro não encontrado" });
      console.error(e);
      res.status(500).json({ erro: "Erro interno" });
    }
  };
}

const texto = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const textoOuNull = (v: unknown) => (texto(v) ? texto(v) : null);
const listaDeIds = (v: unknown): number[] | undefined =>
  Array.isArray(v) ? v.map((x) => inteiro(x)).filter((x): x is number => !!x) : undefined;
const dataValida = (v: unknown) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(Date.parse(v));

const CATEGORIAS = ["intercambio_academico", "dupla_titulacao", "programa_internacional"];
const TIPOS_CONTEUDO = ["requisito", "contato", "checklist_item"];

/* ============================== PAÍSES ============================== */

// POST /admin/paises   { nome_oficial, nome, continente, descricao? }
adminRouter.post("/paises", tratar(async (req, res) => {
  const nome_oficial = texto(req.body?.nome_oficial);
  const nome = texto(req.body?.nome);
  const continente = texto(req.body?.continente);
  if (!nome_oficial || !nome || !continente) {
    return res.status(400).json({ erro: "nome_oficial, nome e continente são obrigatórios" });
  }
  const p = await prisma.pais.create({
    data: { nome_oficial, nome, continente, descricao: textoOuNull(req.body?.descricao) },
  });
  res.status(201).json(p);
}));

// PUT /admin/paises/:nomeOficial   (campos opcionais)
adminRouter.put("/paises/:nomeOficial", tratar(async (req, res) => {
  const d = req.body ?? {};
  const p = await prisma.pais.update({
    where: { nome_oficial: String(req.params.nomeOficial) },
    data: {
      ...(texto(d.nome) ? { nome: texto(d.nome) } : {}),
      ...(texto(d.continente) ? { continente: texto(d.continente) } : {}),
      ...(d.descricao !== undefined ? { descricao: textoOuNull(d.descricao) } : {}),
    },
  });
  res.json(p);
}));

// DELETE /admin/paises/:nomeOficial   (bloqueia se houver universidades nele)
adminRouter.delete("/paises/:nomeOficial", tratar(async (req, res) => {
  // DELETE /admin/paises/:nomeOficial
await prisma.pais.delete({ where: { nome_oficial: String(req.params.nomeOficial) } });
  res.status(204).end();
}));

/* =========================== UNIVERSIDADES =========================== */

// POST /admin/universidades
// { nome, pais_nome_oficial, cidade, descricao?, informacoes_convenio?, fonte_oficial?,
//   idiomas?: [ids], modalidades?: [ids], cursos?: [ids] }
adminRouter.post("/universidades", tratar(async (req, res) => {
  const d = req.body ?? {};
  const nome = texto(d.nome);
  const pais = texto(d.pais_nome_oficial);
  const cidade = texto(d.cidade);
  if (!nome || !pais || !cidade) {
    return res.status(400).json({ erro: "nome, pais_nome_oficial e cidade são obrigatórios" });
  }
  const idiomas = listaDeIds(d.idiomas) ?? [];
  const modalidades = listaDeIds(d.modalidades) ?? [];
  const cursos = listaDeIds(d.cursos) ?? [];

  const u = await prisma.universidade.create({
    data: {
      nome,
      pais_nome_oficial: pais,
      cidade,
      descricao: textoOuNull(d.descricao),
      informacoes_convenio: textoOuNull(d.informacoes_convenio),
      fonte_oficial: textoOuNull(d.fonte_oficial),
      universidade_idioma: { create: idiomas.map((id_idioma) => ({ id_idioma })) },
      universidade_modalidade: { create: modalidades.map((id_modalidade) => ({ id_modalidade })) },
      universidade_curso: { create: cursos.map((id_curso) => ({ id_curso })) },
    },
  });
  res.status(201).json(u);
}));

// PUT /admin/universidades/:id   (campos opcionais; se mandar idiomas/modalidades/cursos, a lista é SUBSTITUÍDA)
adminRouter.put("/universidades/:id", tratar(async (req, res) => {
  const id = inteiro(req.params.id);
  if (!id) return res.status(400).json({ erro: "id inválido" });
  const d = req.body ?? {};

  const idiomas = listaDeIds(d.idiomas);
  const modalidades = listaDeIds(d.modalidades);
  const cursos = listaDeIds(d.cursos);

  const u = await prisma.universidade.update({
    where: { id_universidade: id },
    data: {
      ...(texto(d.nome) ? { nome: texto(d.nome) } : {}),
      ...(texto(d.pais_nome_oficial) ? { pais_nome_oficial: texto(d.pais_nome_oficial) } : {}),
      ...(texto(d.cidade) ? { cidade: texto(d.cidade) } : {}),
      ...(d.descricao !== undefined ? { descricao: textoOuNull(d.descricao) } : {}),
      ...(d.informacoes_convenio !== undefined ? { informacoes_convenio: textoOuNull(d.informacoes_convenio) } : {}),
      ...(d.fonte_oficial !== undefined ? { fonte_oficial: textoOuNull(d.fonte_oficial) } : {}),
      ...(idiomas ? { universidade_idioma: { deleteMany: {}, create: idiomas.map((id_idioma) => ({ id_idioma })) } } : {}),
      ...(modalidades ? { universidade_modalidade: { deleteMany: {}, create: modalidades.map((id_modalidade) => ({ id_modalidade })) } } : {}),
      ...(cursos ? { universidade_curso: { deleteMany: {}, create: cursos.map((id_curso) => ({ id_curso })) } } : {}),
    },
  });
  res.json(u);
}));

// DELETE /admin/universidades/:id
// (favoritos e vínculos somem junto; oportunidades e relatos ficam, só perdem a universidade)
adminRouter.delete("/universidades/:id", tratar(async (req, res) => {
  const id = inteiro(req.params.id);
  if (!id) return res.status(400).json({ erro: "id inválido" });
  await prisma.universidade.delete({ where: { id_universidade: id } });
  res.status(204).end();
}));

/* ============================ OPORTUNIDADES ============================ */

// POST /admin/oportunidades
// { titulo, categoria, descricao, requisitos?, fonte_oficial?, data_inicio, data_fim, id_universidade? }
adminRouter.post("/oportunidades", tratar(async (req, res) => {
  const d = req.body ?? {};
  const titulo = texto(d.titulo);
  const descricao = texto(d.descricao);
  if (!titulo || !descricao) return res.status(400).json({ erro: "titulo e descricao são obrigatórios" });
  if (!CATEGORIAS.includes(d.categoria)) {
    return res.status(400).json({ erro: `categoria deve ser: ${CATEGORIAS.join(", ")}` });
  }
  if (!dataValida(d.data_inicio) || !dataValida(d.data_fim)) {
    return res.status(400).json({ erro: "data_inicio e data_fim devem estar no formato AAAA-MM-DD" });
  }
  if (d.data_fim < d.data_inicio) return res.status(400).json({ erro: "data_fim não pode ser anterior a data_inicio" });

  const o = await prisma.oportunidade.create({
    data: {
      titulo,
      categoria: d.categoria,
      descricao,
      requisitos: textoOuNull(d.requisitos),
      fonte_oficial: textoOuNull(d.fonte_oficial),
      data_inicio: new Date(d.data_inicio),
      data_fim: new Date(d.data_fim),
      id_universidade: inteiro(d.id_universidade) ?? null,
    },
  });
  res.status(201).json(o);
}));

// PUT /admin/oportunidades/:id   (campos opcionais)
adminRouter.put("/oportunidades/:id", tratar(async (req, res) => {
  const id = inteiro(req.params.id);
  if (!id) return res.status(400).json({ erro: "id inválido" });
  const d = req.body ?? {};

  if (d.categoria !== undefined && !CATEGORIAS.includes(d.categoria)) {
    return res.status(400).json({ erro: `categoria deve ser: ${CATEGORIAS.join(", ")}` });
  }
  for (const campo of ["data_inicio", "data_fim"]) {
    if (d[campo] !== undefined && !dataValida(d[campo])) {
      return res.status(400).json({ erro: `${campo} deve estar no formato AAAA-MM-DD` });
    }
  }

  const atual = await prisma.oportunidade.findUnique({ where: { id_oportunidade: id } });
  if (!atual) return res.status(404).json({ erro: "Oportunidade não encontrada" });
  const inicio = d.data_inicio ? new Date(d.data_inicio) : atual.data_inicio;
  const fim = d.data_fim ? new Date(d.data_fim) : atual.data_fim;
  if (fim < inicio) return res.status(400).json({ erro: "data_fim não pode ser anterior a data_inicio" });

  const o = await prisma.oportunidade.update({
    where: { id_oportunidade: id },
    data: {
      ...(texto(d.titulo) ? { titulo: texto(d.titulo) } : {}),
      ...(d.categoria ? { categoria: d.categoria } : {}),
      ...(texto(d.descricao) ? { descricao: texto(d.descricao) } : {}),
      ...(d.requisitos !== undefined ? { requisitos: textoOuNull(d.requisitos) } : {}),
      ...(d.fonte_oficial !== undefined ? { fonte_oficial: textoOuNull(d.fonte_oficial) } : {}),
      data_inicio: inicio,
      data_fim: fim,
      ...(d.id_universidade !== undefined ? { id_universidade: inteiro(d.id_universidade) ?? null } : {}),
    },
  });
  res.json(o);
}));

// DELETE /admin/oportunidades/:id
adminRouter.delete("/oportunidades/:id", tratar(async (req, res) => {
  const id = inteiro(req.params.id);
  if (!id) return res.status(400).json({ erro: "id inválido" });
  await prisma.oportunidade.delete({ where: { id_oportunidade: id } });
  res.status(204).end();
}));

/* ======================= CONTEÚDO INSTITUCIONAL ======================= */

// POST /admin/conteudo   { tipo, titulo, descricao?, ordem?, verificavel_elegibilidade?, contato? }
adminRouter.post("/conteudo", tratar(async (req, res) => {
  const d = req.body ?? {};
  const titulo = texto(d.titulo);
  if (!titulo) return res.status(400).json({ erro: "titulo é obrigatório" });
  if (!TIPOS_CONTEUDO.includes(d.tipo)) {
    return res.status(400).json({ erro: `tipo deve ser: ${TIPOS_CONTEUDO.join(", ")}` });
  }
  const c = await prisma.conteudo_institucional.create({
    data: {
      tipo: d.tipo,
      titulo,
      descricao: textoOuNull(d.descricao),
      ordem: inteiro(d.ordem) ?? null,
      verificavel_elegibilidade: d.tipo === "requisito" && typeof d.verificavel_elegibilidade === "boolean"
        ? d.verificavel_elegibilidade : null,
      contato: d.tipo === "contato" ? textoOuNull(d.contato) : null,
    },
  });
  res.status(201).json(c);
}));

// PUT /admin/conteudo/:id   (campos opcionais; o tipo não muda)
adminRouter.put("/conteudo/:id", tratar(async (req, res) => {
  const id = inteiro(req.params.id);
  if (!id) return res.status(400).json({ erro: "id inválido" });
  const d = req.body ?? {};
  const c = await prisma.conteudo_institucional.update({
    where: { id_conteudo: id },
    data: {
      ...(texto(d.titulo) ? { titulo: texto(d.titulo) } : {}),
      ...(d.descricao !== undefined ? { descricao: textoOuNull(d.descricao) } : {}),
      ...(d.ordem !== undefined ? { ordem: inteiro(d.ordem) ?? null } : {}),
      ...(typeof d.verificavel_elegibilidade === "boolean" ? { verificavel_elegibilidade: d.verificavel_elegibilidade } : {}),
      ...(d.contato !== undefined ? { contato: textoOuNull(d.contato) } : {}),
    },
  });
  res.json(c);
}));

// DELETE /admin/conteudo/:id   (apaga também o progresso dos estudantes nesse item)
adminRouter.delete("/conteudo/:id", tratar(async (req, res) => {
  const id = inteiro(req.params.id);
  if (!id) return res.status(400).json({ erro: "id inválido" });
  await prisma.conteudo_institucional.delete({ where: { id_conteudo: id } });
  res.status(204).end();
}));

/* ============================= MODERAÇÃO ============================= */
// O administrador apaga relatos de qualquer autor em DELETE /relatos/:id (já feito em estudante.ts).