
import { Router } from "express";
import { prisma } from "../prisma";
import { inteiro, statusOportunidade } from "../util";

export const catalogoRouter = Router();

const incluirRelacoes = {
  pais: { select: { nome: true, continente: true } },
  universidade_idioma: { include: { idioma: true } },
  universidade_modalidade: { include: { modalidade: true } },
  universidade_curso: { include: { curso: true } },
};

function resumir(u: any) {
  return {
    id_universidade: u.id_universidade,
    nome: u.nome,
    cidade: u.cidade,
    pais: u.pais.nome,
    continente: u.pais.continente,
    descricao: u.descricao,
    informacoes_convenio: u.informacoes_convenio,
    fonte_oficial: u.fonte_oficial,
    idiomas: u.universidade_idioma.map((x: any) => x.idioma.nome),
    modalidades: u.universidade_modalidade.map((x: any) => x.modalidade.tipo),
    cursos: u.universidade_curso.map((x: any) => x.curso.nome),
  };
}

// Listas para preencher os filtros do site
catalogoRouter.get("/filtros", async (_req, res) => {
  const [paises, idiomas, modalidades, cursos] = await Promise.all([
    prisma.pais.findMany({ orderBy: { nome: "asc" }, select: { nome: true, continente: true } }),
    prisma.idioma.findMany({ orderBy: { nome: "asc" } }),
    prisma.modalidade.findMany({ orderBy: { tipo: "asc" } }),
    prisma.curso.findMany({ orderBy: { nome: "asc" } }),
  ]);
  const continentes = [...new Set(paises.map((p) => p.continente))].sort();
  res.json({ continentes, paises, idiomas, modalidades, cursos });
});

// Países com a quantidade de universidades (base do mapa interativo)
catalogoRouter.get("/paises", async (_req, res) => {
  const paises = await prisma.pais.findMany({
    orderBy: { nome: "asc" },
    include: { _count: { select: { universidade: true } } },
  });
  res.json(
    paises.map((p) => ({
      nome_oficial: p.nome_oficial,
      nome: p.nome,
      continente: p.continente,
      descricao: p.descricao,
      total_universidades: p._count.universidade,
    }))
  );
});

// Um país com as suas universidades
catalogoRouter.get("/paises/:nome", async (req, res) => {
  const pais = await prisma.pais.findFirst({
    where: { nome: String(req.params.nome) },
    include: { universidade: { orderBy: { nome: "asc" }, include: incluirRelacoes } },
  });
  if (!pais) return res.status(404).json({ erro: "País não encontrado." });

  const { universidade, ...dadosPais } = pais;
  res.json({ ...dadosPais, universidades: universidade.map(resumir) });
});

// Lista de universidades com filtros: ?busca= &pais= &continente= &idioma= &modalidade= &curso=
catalogoRouter.get("/universidades", async (req, res) => {
  const busca = String(req.query.busca ?? "").trim();
  const pais = String(req.query.pais ?? "").trim();
  const continente = String(req.query.continente ?? "").trim();
  const idioma = inteiro(req.query.idioma);
  const modalidade = inteiro(req.query.modalidade);
  const curso = inteiro(req.query.curso);

  const universidades = await prisma.universidade.findMany({
    where: {
      ...(busca ? { nome: { contains: busca } } : {}),
      ...(pais || continente
        ? {
            pais: {
              ...(pais ? { nome: pais } : {}),
              ...(continente ? { continente } : {}),
            },
          }
        : {}),
      ...(idioma ? { universidade_idioma: { some: { id_idioma: idioma } } } : {}),
      ...(modalidade ? { universidade_modalidade: { some: { id_modalidade: modalidade } } } : {}),
      ...(curso ? { universidade_curso: { some: { id_curso: curso } } } : {}),
    },
    orderBy: { nome: "asc" },
    include: incluirRelacoes,
  });

  res.json(universidades.map(resumir));
});

// Detalhe de uma universidade, com oportunidades e relatos
catalogoRouter.get("/universidades/:id", async (req, res) => {
  const id = inteiro(req.params.id);
  if (!id) return res.status(400).json({ erro: "Identificador inválido." });

  const u = await prisma.universidade.findUnique({
    where: { id_universidade: id },
    include: {
      ...incluirRelacoes,
      oportunidade: { orderBy: { data_inicio: "asc" } },
      feedback_experiencia: {
        orderBy: { data_publicacao: "desc" },
        include: { usuario: { select: { nome: true } } },
      },
    },
  });
  if (!u) return res.status(404).json({ erro: "Universidade não encontrada." });

  const relatos = u.feedback_experiencia.map((f) => ({
    id_experiencia: f.id_experiencia,
    titulo: f.titulo,
    texto: f.texto,
    nota: f.nota === null ? null : Number(f.nota),
    data_publicacao: f.data_publicacao,
    autor: f.usuario ? f.usuario.nome.split(" ")[0] : "Anônimo",
  }));
  const notas = relatos.map((r) => r.nota).filter((n): n is number => n !== null);
  const notaMedia = notas.length
    ? Math.round((notas.reduce((a, b) => a + b, 0) / notas.length) * 10) / 10
    : null;

  res.json({
    ...resumir(u),
    oportunidades: u.oportunidade.map((o) => ({
      ...o,
      status: statusOportunidade(o.data_inicio, o.data_fim),
    })),
    relatos,
    nota_media: notaMedia,
  });
});