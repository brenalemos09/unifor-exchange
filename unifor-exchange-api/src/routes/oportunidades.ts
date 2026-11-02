import { Router } from "express";
import { prisma } from "../prisma";
import { inteiro, statusOportunidade } from "../util";

export const oportunidadesRouter = Router();

const CATEGORIAS = ["intercambio_academico", "dupla_titulacao", "programa_internacional"] as const;
const STATUS = ["aberta", "em_breve", "encerrada"] as const;

const incluirUniversidade = {
  universidade: {
    select: { id_universidade: true, nome: true, cidade: true, pais_nome_oficial: true },
  },
};

// GET /oportunidades?categoria=&status=&universidade=&busca=
oportunidadesRouter.get("/oportunidades", async (req, res) => {
  const categoria = String(req.query.categoria ?? "");
  const status = String(req.query.status ?? "");
  const busca = String(req.query.busca ?? "").trim();
  const idUniversidade = inteiro(req.query.universidade);

  if (categoria && !(CATEGORIAS as readonly string[]).includes(categoria)) {
    return res.status(400).json({ erro: `categoria deve ser: ${CATEGORIAS.join(", ")}` });
  }
  if (status && !(STATUS as readonly string[]).includes(status)) {
    return res.status(400).json({ erro: `status deve ser: ${STATUS.join(", ")}` });
  }

  const lista = await prisma.oportunidade.findMany({
    where: {
      ...(categoria ? { categoria: categoria as (typeof CATEGORIAS)[number] } : {}),
      ...(idUniversidade ? { id_universidade: idUniversidade } : {}),
      ...(busca ? { titulo: { contains: busca } } : {}),
    },
    include: incluirUniversidade,
    orderBy: { data_inicio: "asc" },
  });

  // status depende da data de hoje, por isso é calculado aqui e não no banco
  const comStatus = lista.map((o) => ({
    ...o,
    status: statusOportunidade(o.data_inicio, o.data_fim),
  }));

  res.json(status ? comStatus.filter((o) => o.status === status) : comStatus);
});

// GET /oportunidades/:id
oportunidadesRouter.get("/oportunidades/:id", async (req, res) => {
  const id = inteiro(req.params.id);
  if (!id) return res.status(400).json({ erro: "id inválido" });

  const o = await prisma.oportunidade.findUnique({
    where: { id_oportunidade: id },
    include: incluirUniversidade,
  });
  if (!o) return res.status(404).json({ erro: "Oportunidade não encontrada" });

  res.json({ ...o, status: statusOportunidade(o.data_inicio, o.data_fim) });
});