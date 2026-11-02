const BASE = process.env.API_URL ?? "http://localhost:3000";
const SENHA = "1234";

let passou = 0;
let falhou = 0;

function checar(nome: string, condicao: boolean, detalhe: unknown = "") {
  if (condicao) {
    passou++;
    console.log(`  OK       ${nome}`);
  } else {
    falhou++;
    const extra = detalhe === "" ? "" : `\n           -> ${String(JSON.stringify(detalhe)).slice(0, 300)}`;
    console.log(`  FALHOU   ${nome}${extra}`);
  }
}

async function chamar(metodo: string, caminho: string, corpo?: unknown, token?: string) {
  const r = await fetch(BASE + caminho, {
    method: metodo,
    headers: {
      ...(corpo !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
  });
  const txt = await r.text();
  let dados: any = null;
  try { dados = txt ? JSON.parse(txt) : null; } catch { dados = txt; }
  return { status: r.status, dados };
}

// pega a lista, mesmo que venha embrulhada em um objeto
const lista = (d: any): any[] =>
  Array.isArray(d) ? d : d && typeof d === "object" ? ((Object.values(d).find(Array.isArray) as any[]) ?? []) : [];

async function entrar(login: string): Promise<string | undefined> {
  const r = await chamar("POST", "/auth/login", { login, senha: SENHA });
  return r.dados?.token;
}

function titulo(t: string) {
  console.log(`\n== ${t}`);
}

async function main() {
  /* ---------------- servidor e login ---------------- */
  titulo("Servidor e login");
  const saude = await chamar("GET", "/saude");
  checar("GET /saude responde 200", saude.status === 200, saude);

  const tokenEstudante = await entrar("2511483");
  checar("login do estudante 2511483 devolve token", !!tokenEstudante);
  const tokenAdmin = await entrar("1911207");
  checar("login do admin 1911207 devolve token", !!tokenAdmin);
  const porEmail = await entrar("ana.moura@teste.unifor.br");
  checar("login por e-mail funciona", !!porEmail);
  const senhaErrada = await chamar("POST", "/auth/login", { login: "2511483", senha: "errada" });
  checar("senha errada é recusada (401)", senhaErrada.status === 401, senhaErrada);

  if (!tokenEstudante || !tokenAdmin) {
    console.log("\nSem token não dá para continuar. Confira os campos de /auth/login em src/routes/auth.ts.");
    return;
  }

  const eu = await chamar("GET", "/auth/eu", undefined, tokenEstudante);
  checar("GET /auth/eu mostra o usuário logado", eu.status === 200, eu);
  const euSemToken = await chamar("GET", "/auth/eu");
  checar("GET /auth/eu sem token dá 401", euSemToken.status === 401, euSemToken);

  /* ---------------- catálogo ---------------- */
  titulo("Catálogo (países e universidades)");
  const filtros = await chamar("GET", "/filtros");
  checar("GET /filtros responde 200", filtros.status === 200, filtros);
  const paises = await chamar("GET", "/paises");
  checar("13 países", lista(paises.dados).length === 13, lista(paises.dados).length);
  const unis = await chamar("GET", "/universidades");
  checar("20 universidades", lista(unis.dados).length === 20, lista(unis.dados).length);
  const eu1 = await chamar("GET", "/universidades?continente=Europa&idioma=2");
  checar("Europa + inglês = 10 universidades", lista(eu1.dados).length === 10, lista(eu1.dados).length);
  const eu2 = await chamar("GET", "/universidades?continente=Europa&idioma=2&curso=8");
  checar("Europa + inglês + Eng. Civil = 6", lista(eu2.dados).length === 6, lista(eu2.dados).length);
  const busca = await chamar("GET", "/universidades?busca=Lisboa");
  checar("busca por 'Lisboa' acha resultado", lista(busca.dados).length >= 1, lista(busca.dados).length);
  const uni1 = await chamar("GET", "/universidades/1");
  checar("GET /universidades/1 traz a universidade", uni1.status === 200 && !!uni1.dados?.nome, uni1);
  const uniNaoExiste = await chamar("GET", "/universidades/9999");
  checar("universidade inexistente dá 404", uniNaoExiste.status === 404, uniNaoExiste);

  /* ---------------- oportunidades ---------------- */
  titulo("Oportunidades");
  const ops = await chamar("GET", "/oportunidades");
  checar("14 oportunidades", lista(ops.dados).length === 14, lista(ops.dados).length);
  checar("todas têm status calculado", lista(ops.dados).every((o) => ["aberta", "em_breve", "encerrada"].includes(o.status)));
  const abertas = await chamar("GET", "/oportunidades?status=aberta");
  checar("filtro status=aberta só traz abertas", lista(abertas.dados).length > 0 && lista(abertas.dados).every((o) => o.status === "aberta"), lista(abertas.dados).length);
  const duplas = await chamar("GET", "/oportunidades?categoria=dupla_titulacao");
  checar("categoria dupla_titulacao = 3", lista(duplas.dados).length === 3, lista(duplas.dados).length);
  const statusRuim = await chamar("GET", "/oportunidades?status=xyz");
  checar("status inválido dá 400", statusRuim.status === 400, statusRuim);
  const op1 = await chamar("GET", "/oportunidades/1");
  checar("GET /oportunidades/1 funciona", op1.status === 200 && !!op1.dados?.status, op1);

  /* ---------------- conteúdo e elegibilidade ---------------- */
  titulo("Conteúdo institucional e elegibilidade");
  const req = await chamar("GET", "/conteudo/requisitos");
  checar("7 requisitos", lista(req.dados).length === 7, lista(req.dados).length);
  const cont = await chamar("GET", "/conteudo/contatos");
  checar("4 contatos", lista(cont.dados).length === 4, lista(cont.dados).length);
  const chk = await chamar("GET", "/conteudo/checklist");
  checar("12 itens de checklist", lista(chk.dados).length === 12, lista(chk.dados).length);
  const perguntasElegib = await chamar("GET", "/elegibilidade");
  checar("4 requisitos verificáveis", lista(perguntasElegib.dados).length === 4, lista(perguntasElegib.dados).length);
  const elegib = await chamar("POST", "/elegibilidade", { atendidos: [1, 2, 3] });
  checar("atendendo 3 de 4 => não elegível, 1 pendente", elegib.dados?.elegivel === false && elegib.dados?.pendentes?.length === 1, elegib.dados);
  const elegibTodos = await chamar("POST", "/elegibilidade", { atendidos: [1, 2, 3, 4] });
  checar("atendendo os 4 => elegível", elegibTodos.dados?.elegivel === true, elegibTodos.dados);
  const relatos = await chamar("GET", "/relatos");
  checar("pelo menos 7 relatos", lista(relatos.dados).length >= 7, lista(relatos.dados).length);
  checar("relatos mostram só um nome (sem sobrenome)", lista(relatos.dados).every((r) => !r.autor || !String(r.autor).includes(" ")), lista(relatos.dados)[0]);
  const relatosLisboa = await chamar("GET", "/relatos?universidade=1");
  checar("filtro de relatos por universidade", lista(relatosLisboa.dados).length >= 1, lista(relatosLisboa.dados).length);

  /* ---------------- quiz ---------------- */
  titulo("Quiz");
  const quiz = await chamar("GET", "/quiz");
  checar("quiz tem 6 perguntas", quiz.dados?.perguntas?.length === 6, quiz.dados?.perguntas?.length);
  const semToken = await chamar("POST", "/quiz/responder", { respostas: [] });
  checar("responder sem login dá 401", semToken.status === 401, semToken);
  const respostaRuim = await chamar("POST", "/quiz/responder", { respostas: [{ id_pergunta: 1, texto: "não existe" }] }, tokenEstudante);
  checar("opção inexistente dá 400", respostaRuim.status === 400, respostaRuim);
  const resp = await chamar(
    "POST",
    "/quiz/responder",
    {
      respostas: [
        { id_pergunta: 1, texto: "Tecnologia e engenharias" },
        { id_pergunta: 2, texto: "Inglês" },
        { id_pergunta: 3, texto: "Europa" },
        { id_pergunta: 6, texto: "Obter um segundo diploma" },
      ],
    },
    tokenEstudante
  );
  checar("responder o quiz devolve 201 com recomendações", resp.status === 201 && resp.dados?.recomendacoes?.length > 0, resp);
  checar("1º lugar é o Politecnico di Milano", String(resp.dados?.recomendacoes?.[0]?.universidade).includes("Politecnico"), resp.dados?.recomendacoes);
  const hist = await chamar("GET", "/quiz/resultados", undefined, tokenEstudante);
  checar("resultado ficou salvo no histórico", lista(hist.dados).some((r) => r.id_resultado === resp.dados?.id_resultado), lista(hist.dados).length);
  const outro = await chamar("GET", `/quiz/resultados/${resp.dados?.id_resultado}`, undefined, tokenAdmin);
  checar("outro usuário não vê o resultado (404)", outro.status === 404, outro);

  /* ---------------- área do estudante ---------------- */
  titulo("Área do estudante");
  const favSemToken = await chamar("GET", "/favoritos");
  checar("favoritos sem login dá 401", favSemToken.status === 401, favSemToken);
  const favAntes = lista((await chamar("GET", "/favoritos", undefined, tokenEstudante)).dados);
  const jaFav = new Set(favAntes.map((f) => f.id_universidade));
  const idLivre = [...Array(20).keys()].map((i) => i + 1).find((i) => !jaFav.has(i)) ?? 20;
  const favCria = await chamar("POST", `/favoritos/${idLivre}`, undefined, tokenEstudante);
  checar(`favoritar universidade ${idLivre} (201)`, favCria.status === 201, favCria);
  const favDepois = lista((await chamar("GET", "/favoritos", undefined, tokenEstudante)).dados);
  checar("favorito aparece na lista", favDepois.some((f) => f.id_universidade === idLivre));
  const favDel = await chamar("DELETE", `/favoritos/${idLivre}`, undefined, tokenEstudante);
  checar("desfavoritar (204)", favDel.status === 204, favDel);
  const favInvalido = await chamar("POST", "/favoritos/9999", undefined, tokenEstudante);
  checar("favoritar universidade inexistente dá 404", favInvalido.status === 404, favInvalido);

  const ck = await chamar("GET", "/checklist", undefined, tokenEstudante);
  checar("checklist traz 12 itens e progresso", ck.dados?.total === 12 && typeof ck.dados?.progresso === "number", ck.dados);
  const item = ck.dados?.itens?.[0];
  if (item) {
    const original = item.status === "concluido";
    const marca = await chamar("PUT", `/checklist/${item.id_conteudo}`, { concluido: !original }, tokenEstudante);
    checar("marcar/desmarcar item do checklist", marca.status === 200 && marca.dados?.status === (original ? "pendente" : "concluido"), marca);
    await chamar("PUT", `/checklist/${item.id_conteudo}`, { concluido: original }, tokenEstudante); // restaura
  }
  const ckRuim = await chamar("PUT", "/checklist/20", { concluido: true }, tokenEstudante); // 20 = contato, não é checklist
  checar("item que não é de checklist dá 404", ckRuim.status === 404, ckRuim);

  const relatoCria = await chamar("POST", "/relatos", { titulo: "Teste automático", texto: "Relato criado pelo script de teste.", nota: 8.5, id_universidade: 1 }, tokenEstudante);
  checar("criar relato (201)", relatoCria.status === 201, relatoCria);
  const notaRuim = await chamar("POST", "/relatos", { titulo: "x", texto: "y", nota: 11 }, tokenEstudante);
  checar("nota 11 dá 400", notaRuim.status === 400, notaRuim);
  const idRelato = relatoCria.dados?.id_experiencia;
  const relatoOutro = await chamar("DELETE", `/relatos/1`, undefined, tokenEstudante);
  checar("estudante não apaga relato de outro (403)", relatoOutro.status === 403, relatoOutro);
  const relatoDel = await chamar("DELETE", `/relatos/${idRelato}`, undefined, tokenEstudante);
  checar("autor apaga o próprio relato (204)", relatoDel.status === 204, relatoDel);

  /* ---------------- admin ---------------- */
  titulo("Admin");
  const admSemToken = await chamar("POST", "/admin/paises", { nome_oficial: "x", nome: "x", continente: "x" });
  checar("admin sem login dá 401", admSemToken.status === 401, admSemToken);
  const admEstudante = await chamar("POST", "/admin/paises", { nome_oficial: "x", nome: "x", continente: "x" }, tokenEstudante);
  checar("estudante nas rotas de admin dá 403", admEstudante.status === 403, admEstudante);

  const NOME_PAIS = "País de Teste Automático";
  const paisCria = await chamar("POST", "/admin/paises", { nome_oficial: NOME_PAIS, nome: "Teste", continente: "Europa" }, tokenAdmin);
  checar("criar país (201)", paisCria.status === 201, paisCria);
  const paisRepete = await chamar("POST", "/admin/paises", { nome_oficial: NOME_PAIS, nome: "Teste", continente: "Europa" }, tokenAdmin);
  checar("país repetido dá 409", paisRepete.status === 409, paisRepete);
  const paisEdita = await chamar("PUT", `/admin/paises/${encodeURIComponent(NOME_PAIS)}`, { nome: "Teste Editado" }, tokenAdmin);
  checar("editar país", paisEdita.status === 200 && paisEdita.dados?.nome === "Teste Editado", paisEdita);

  const uniCria = await chamar(
    "POST",
    "/admin/universidades",
    { nome: "Universidade de Teste Automático", pais_nome_oficial: NOME_PAIS, cidade: "Cidade Teste", idiomas: [2], modalidades: [1], cursos: [8] },
    tokenAdmin
  );
  checar("criar universidade com idioma, modalidade e curso (201)", uniCria.status === 201, uniCria);
  const idUni = uniCria.dados?.id_universidade;
  const uniLida = await chamar("GET", `/universidades/${idUni}`);
  checar("universidade criada aparece no catálogo público", uniLida.status === 200, uniLida);
  const paisBloqueado = await chamar("DELETE", `/admin/paises/${encodeURIComponent(NOME_PAIS)}`, undefined, tokenAdmin);
  checar("não apaga país que tem universidade (409)", paisBloqueado.status === 409, paisBloqueado);

  const opCria = await chamar(
    "POST",
    "/admin/oportunidades",
    { titulo: "Oportunidade de teste", categoria: "programa_internacional", descricao: "Criada pelo script.", data_inicio: "2030-01-01", data_fim: "2030-02-01", id_universidade: idUni },
    tokenAdmin
  );
  checar("criar oportunidade (201)", opCria.status === 201, opCria);
  const opDatas = await chamar(
    "POST",
    "/admin/oportunidades",
    { titulo: "x", categoria: "programa_internacional", descricao: "y", data_inicio: "2030-02-01", data_fim: "2030-01-01" },
    tokenAdmin
  );
  checar("data_fim antes de data_inicio dá 400", opDatas.status === 400, opDatas);
  const idOp = opCria.dados?.id_oportunidade;
  const opLida = await chamar("GET", `/oportunidades/${idOp}`);
  checar("oportunidade futura aparece como em_breve", opLida.dados?.status === "em_breve", opLida.dados);
  const opDel = await chamar("DELETE", `/admin/oportunidades/${idOp}`, undefined, tokenAdmin);
  checar("apagar oportunidade (204)", opDel.status === 204, opDel);

  const ctCria = await chamar("POST", "/admin/conteudo", { tipo: "checklist_item", titulo: "Item de teste", ordem: 99 }, tokenAdmin);
  checar("criar item de conteúdo (201)", ctCria.status === 201, ctCria);
  const ctDel = await chamar("DELETE", `/admin/conteudo/${ctCria.dados?.id_conteudo}`, undefined, tokenAdmin);
  checar("apagar item de conteúdo (204)", ctDel.status === 204, ctDel);

  const uniDel = await chamar("DELETE", `/admin/universidades/${idUni}`, undefined, tokenAdmin);
  checar("apagar universidade de teste (204)", uniDel.status === 204, uniDel);
  const paisDel = await chamar("DELETE", `/admin/paises/${encodeURIComponent(NOME_PAIS)}`, undefined, tokenAdmin);
  checar("apagar país de teste (204)", paisDel.status === 204, paisDel);

  /* ---------------- recuperação de senha ---------------- */
  titulo("Recuperação de senha");
  const rec = await chamar("POST", "/auth/recuperar", { login: "2222418" });
  checar("pedir recuperação responde 200", rec.status === 200, rec);
  const inexistente = await chamar("POST", "/auth/recuperar", { login: "0000000" });
  checar("conta inexistente tem a mesma resposta (não revela)", inexistente.status === 200, inexistente);
  if (rec.dados?.codigo_demo) {
    const codigo = rec.dados.codigo_demo;
    const redef = await chamar("POST", "/auth/redefinir", { login: "2222418", codigo, nova_senha: SENHA });
    checar("redefinir com o código correto", redef.status === 200, redef);
    const reuso = await chamar("POST", "/auth/redefinir", { login: "2222418", codigo, nova_senha: SENHA });
    checar("código já usado é recusado", reuso.status === 400, reuso);
    checar("login continua funcionando", !!(await entrar("2222418")));
  } else {
    console.log("  PULADO   redefinição: ponha RECUPERACAO_DEMO=true no .env e reinicie o servidor para testar essa parte");
  }
  const codigoErrado = await chamar("POST", "/auth/redefinir", { login: "2222418", codigo: 111111, nova_senha: SENHA });
  checar("código errado é recusado", codigoErrado.status === 400, codigoErrado);
}

main()
  .catch((e) => {
    console.log("\nNão consegui falar com o servidor. Ele está rodando (npm run dev) em", BASE, "?");
    console.log(String(e?.cause ?? e));
    falhou++;
  })
  .finally(() => {
    console.log(`\n======== ${passou} OK  |  ${falhou} FALHARAM ========`);
    process.exit(falhou ? 1 : 0);
  });