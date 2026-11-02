import { Router } from "express";
import { randomInt } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma";

export const recuperacaoRouter = Router();

const VALIDADE_MIN = 15;
const MSG_GENERICA = "Se a conta existir, um código de recuperação foi gerado.";

// aceita matrícula (só números) ou e-mail
async function acharUsuario(login: string) {
  if (/^\d+$/.test(login)) return prisma.usuario.findUnique({ where: { matricula: Number(login) } });
  return prisma.usuario.findUnique({ where: { email: login.toLowerCase() } });
}

// POST /auth/recuperar   { "login": "2511483" }
recuperacaoRouter.post("/recuperar", async (req, res) => {
  const login = String(req.body?.login ?? "").trim();
  if (!login) return res.status(400).json({ erro: "Informe matrícula ou e-mail" });

  const usuario = await acharUsuario(login);
  if (!usuario) return res.json({ mensagem: MSG_GENERICA }); // não revela se a conta existe

  // invalida códigos anteriores ainda não usados
  await prisma.token_recuperacao.updateMany({
    where: { matricula: usuario.matricula, utilizado: false },
    data: { utilizado: true },
  });

  const codigo = randomInt(100000, 1000000); // 6 dígitos
  await prisma.token_recuperacao.upsert({
    where: { matricula_codigo: { matricula: usuario.matricula, codigo } },
    update: { utilizado: false, data_expiracao: new Date(Date.now() + VALIDADE_MIN * 60_000) },
    create: {
      matricula: usuario.matricula,
      codigo,
      data_expiracao: new Date(Date.now() + VALIDADE_MIN * 60_000),
    },
  });

  // Sem envio real de e-mail: o código aparece no terminal do servidor.
  console.log(`[RECUPERAÇÃO] matrícula ${usuario.matricula} -> código ${codigo} (vale ${VALIDADE_MIN} min)`);

  // Para demonstração: com RECUPERACAO_DEMO=true no .env, o código também volta na resposta.
  res.json(
    process.env.RECUPERACAO_DEMO === "true"
      ? { mensagem: MSG_GENERICA, codigo_demo: codigo }
      : { mensagem: MSG_GENERICA }
  );
});

// POST /auth/redefinir   { "login": "2511483", "codigo": 123456, "nova_senha": "abcd" }
recuperacaoRouter.post("/redefinir", async (req, res) => {
  const login = String(req.body?.login ?? "").trim();
  const codigo = Number(req.body?.codigo);
  const novaSenha = String(req.body?.nova_senha ?? "");

  if (!login || !Number.isInteger(codigo)) {
    return res.status(400).json({ erro: "Informe login e codigo" });
  }
  if (novaSenha.length < 4) {
    return res.status(400).json({ erro: "A nova senha deve ter ao menos 4 caracteres" });
  }

  const invalido = { erro: "Código inválido ou expirado" };
  const usuario = await acharUsuario(login);
  if (!usuario) return res.status(400).json(invalido);

  const token = await prisma.token_recuperacao.findUnique({
    where: { matricula_codigo: { matricula: usuario.matricula, codigo } },
  });
  if (!token || token.utilizado || token.data_expiracao < new Date()) {
    return res.status(400).json(invalido);
  }

  const senha_hash = await bcrypt.hash(novaSenha, 10);
  await prisma.$transaction([
    prisma.usuario.update({ where: { matricula: usuario.matricula }, data: { senha_hash } }),
    prisma.token_recuperacao.update({
      where: { matricula_codigo: { matricula: usuario.matricula, codigo } },
      data: { utilizado: true },
    }),
  ]);

  res.json({ mensagem: "Senha redefinida. Faça login com a nova senha." });
});