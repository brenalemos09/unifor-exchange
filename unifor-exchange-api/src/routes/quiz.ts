import { Router } from "express";
import { prisma } from "../prisma";
import { autenticar } from "../auth";
import { inteiro, statusOportunidade } from "../util";

export const quizRouter = Router();

// Cada opção da pergunta "área" aponta para um grupo de cursos (nomes iguais aos da tabela curso)
const AREAS: Record<string, string[]> = {
  tecnologia_engenharia: [
    "Ciência da Computação", "Engenharia Civil", "Engenharia de Produção",
    "Engenharia Elétrica", "Engenharia Mecânica",
  ],
  saude: ["Medicina", "Nutrição", "Odontologia", "Psicologia"],
  direito_negocios: ["Administração", "Ciências Contábeis", "Direito"],
  arquitetura_design_comunicacao: ["Arquitetura e Urbanismo", "Comunicação Social", "Design"],
};

// GET /quiz  -> quiz mais recente, com perguntas e opções (sem expor item/peso)
quizRouter.get("/quiz", async (_req, res) => {
  const quiz = await prisma.quiz.findFirst({ orderBy: { id_quiz: "desc" } });
  if (!quiz) return res.status(404).json({ erro: "Nenhum quiz cadastrado" });

  const perguntas = await prisma.pergunta.findMany({
    where: { id_quiz: quiz.id_quiz },
    orderBy: { id_pergunta: "asc" },
  });
  const opcoes = await prisma.opcoes.findMany({
    where: { id_pergunta: { in: perguntas.map((p) => p.id_pergunta) } },
  });

  res.json({
    id_quiz: quiz.id_quiz,
    perguntas: perguntas.map((p) => ({
      id_pergunta: p.id_pergunta,
      enunciado: p.enunciado,
      opcoes: opcoes.filter((o) => o.id_pergunta === p.id_pergunta).map((o) => o.texto),
    })),
  });
});

// POST /quiz/responder   body: { "respostas": [ { "id_pergunta": 1, "texto": "Tecnologia e engenharias" }, ... ] }
quizRouter.post("/quiz/responder", autenticar, async (req, res) => {
  const matricula = Number(res.locals.usuario.matricula);
  const respostas: { id_pergunta: unknown; texto: unknown }[] = Array.isArray(req.body?.respostas)
    ? req.body.respostas
    : [];
  if (respostas.length === 0) {
    return res.status(400).json({ erro: "Envie ao menos uma resposta em 'respostas'" });
  }

  const quiz = await prisma.quiz.findFirst({ orderBy: { id_quiz: "desc" } });
  if (!quiz) return res.status(404).json({ erro: "Nenhum quiz cadastrado" });

  const perguntas = await prisma.pergunta.findMany({ where: { id_quiz: quiz.id_quiz } });
  const opcoes = await prisma.opcoes.findMany({
    where: { id_pergunta: { in: perguntas.map((p) => p.id_pergunta) } },
  });

  // Valida cada resposta e descobre o item/peso da opção escolhida
  const escolhidas = new Map<number, { texto: string; item: string; peso: number }>();
  for (const r of respostas) {
    const idPergunta = inteiro(r.id_pergunta);
    const opcao = opcoes.find((o) => o.id_pergunta === idPergunta && o.texto === r.texto);
    if (!idPergunta || !opcao) {
      return res.status(400).json({ erro: `Resposta inválida: pergunta ${r.id_pergunta} / "${r.texto}"` });
    }
    escolhidas.set(idPergunta, { texto: opcao.texto, item: opcao.item ?? "", peso: opcao.peso });
  }

  // Quais respostas contam para cada critério (pela ordem do enunciado, sem depender de id fixo)
  const porEnunciado = (trecho: string) => {
    const p = perguntas.find((x) => x.enunciado.toLowerCase().includes(trecho));
    return p ? escolhidas.get(p.id_pergunta) : undefined;
  };
  const area = porEnunciado("área");
  const idioma = porEnunciado("idioma");
  const regiao = porEnunciado("região");
  const objetivo = porEnunciado("objetivo");
  // Obs.: clima e custo de vida não existem no banco, então não entram no cálculo.

  const universidades = await prisma.universidade.findMany({
    include: {
      pais: true,
      universidade_idioma: { include: { idioma: true } },
      universidade_curso: { include: { curso: true } },
      oportunidade: true,
    },
  });

  const pesoMaximo =
    (area?.peso ?? 0) + (idioma?.peso ?? 0) + (regiao?.peso ?? 0) + (objetivo?.peso ?? 0);

  const ranking = universidades.map((u) => {
    let pontos = 0;
    const motivos: string[] = [];

    if (area && area.peso > 0) {
      const cursosDaArea = AREAS[area.item] ?? [];
      const nomes = u.universidade_curso.map((c) => c.curso.nome).filter((n) => cursosDaArea.includes(n));
      if (nomes.length > 0) {
        pontos += area.peso * (0.5 + (0.5 * nomes.length) / cursosDaArea.length);
        motivos.push(`oferece ${nomes.slice(0, 3).join(", ")}`);
      }
    }
    if (idioma && idioma.peso > 0 && u.universidade_idioma.some((i) => i.idioma.nome === idioma.item)) {
      pontos += idioma.peso;
      motivos.push(`aulas em ${idioma.item.toLowerCase()}`);
    }
    if (regiao && regiao.peso > 0 && u.pais.continente === regiao.item) {
      pontos += regiao.peso;
      motivos.push(`fica em ${u.pais.nome} (${u.pais.continente})`);
    }
    if (objetivo && objetivo.peso > 0) {
      const tem = u.oportunidade.some(
        (o) => o.categoria === objetivo.item && statusOportunidade(o.data_inicio, o.data_fim) !== "encerrada"
      );
      if (tem) {
        pontos += objetivo.peso;
        motivos.push("tem programa disponível no seu objetivo");
      }
    }

    return {
      id_universidade: u.id_universidade,
      universidade: u.nome,
      indice_compatibilidade: pesoMaximo > 0 ? Math.round((100 * pontos) / pesoMaximo) : 0,
      justificativa: motivos.length ? `Combina com seu perfil: ${motivos.join("; ")}.` : "Sem pontos em comum com suas respostas.",
    };
  });

  const top = ranking
    .filter((r) => r.indice_compatibilidade > 0)
    .sort((a, b) => b.indice_compatibilidade - a.indice_compatibilidade)
    .slice(0, 5);

  const resumo = [area, regiao, idioma, objetivo]
    .filter((r) => r && r.peso > 0)
    .map((r) => r!.texto);

  const resultado = await prisma.resultado_quiz.create({
    data: {
      id_quiz: quiz.id_quiz,
      matricula,
      perfil: resumo.length ? resumo.join(" · ").slice(0, 255) : "Perfil aberto",
      descricao: "Resultado orientativo, calculado a partir das suas respostas. Confirme sempre as informações com a coordenação de intercâmbio.",
      recomendacoes_universidades: {
        create: top.map((t) => ({
          universidade: t.universidade,
          indice_compatibilidade: t.indice_compatibilidade,
          justificativa: t.justificativa,
        })),
      },
    },
  });

  res.status(201).json({
    id_resultado: resultado.id_resultado,
    perfil: resultado.perfil,
    descricao: resultado.descricao,
    recomendacoes: top, // já inclui id_universidade para abrir /universidades/:id
  });
});

// GET /quiz/resultados  -> histórico do usuário logado
quizRouter.get("/quiz/resultados", autenticar, async (_req, res) => {
  const matricula = Number(res.locals.usuario.matricula);
  const lista = await prisma.resultado_quiz.findMany({
    where: { matricula },
    orderBy: { data_realizacao: "desc" },
    include: { recomendacoes_universidades: true },
  });
  res.json(lista);
});

// GET /quiz/resultados/:id  -> um resultado (só se for do usuário logado)
quizRouter.get("/quiz/resultados/:id", autenticar, async (req, res) => {
  const id = inteiro(req.params.id);
  if (!id) return res.status(400).json({ erro: "id inválido" });

  const r = await prisma.resultado_quiz.findUnique({
    where: { id_resultado: id },
    include: { recomendacoes_universidades: true },
  });
  if (!r || r.matricula !== Number(res.locals.usuario.matricula)) {
    return res.status(404).json({ erro: "Resultado não encontrado" });
  }
  res.json(r);
});