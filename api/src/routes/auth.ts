import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma";
import { autenticar, gerarToken } from "../auth";

export const authRouter = Router();

authRouter.post("/cadastro", async (req, res) => {
  const { matricula, nome, email, senha } = req.body ?? {};

  if (!/^\d{2}[12]\d{4}$/.test(String(matricula ?? ""))) {
    return res.status(400).json({ erro: "Matrícula inválida. Use o padrão XXYZZZZ, por exemplo 2511483." });
  }
  if (!nome || !email || !senha || String(senha).length < 4) {
    return res.status(400).json({ erro: "Informe nome, e-mail e uma senha de pelo menos 4 caracteres." });
  }

  const existe = await prisma.usuario.findFirst({
    where: { OR: [{ matricula: Number(matricula) }, { email: String(email) }] },
  });
  if (existe) {
    return res.status(409).json({ erro: "Matrícula ou e-mail já cadastrado." });
  }

  const usuario = await prisma.usuario.create({
    data: {
      matricula: Number(matricula),
      nome: String(nome),
      email: String(email),
      senha_hash: await bcrypt.hash(String(senha), 10),
      tipo: "estudante",
    },
    select: { matricula: true, nome: true, email: true, tipo: true },
  });

  res.status(201).json({
    usuario,
    token: gerarToken({ matricula: usuario.matricula, tipo: usuario.tipo }),
  });
});

authRouter.post("/login", async (req, res) => {
  const { login, senha } = req.body ?? {};
  const numero = Number(login);

  const usuario = await prisma.usuario.findFirst({
    where: {
      OR: [
        { email: String(login ?? "") },
        ...(Number.isInteger(numero) ? [{ matricula: numero }] : []),
      ],
    },
  });

  const confere = usuario && (await bcrypt.compare(String(senha ?? ""), usuario.senha_hash));
  if (!usuario || !confere) {
    return res.status(401).json({ erro: "Matrícula/e-mail ou senha incorretos." });
  }

  res.json({
    usuario: { matricula: usuario.matricula, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo },
    token: gerarToken({ matricula: usuario.matricula, tipo: usuario.tipo }),
  });
});

authRouter.get("/eu", autenticar, async (_req, res) => {
  const usuario = await prisma.usuario.findUnique({
    where: { matricula: res.locals.usuario.matricula },
    select: { matricula: true, nome: true, email: true, tipo: true },
  });
  res.json(usuario);
});