import "dotenv/config";
import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

const segredo = process.env.JWT_SECRET;
if (!segredo) throw new Error("Defina JWT_SECRET no .env");

export type DadosToken = { matricula: number; tipo: string };

export function gerarToken(dados: DadosToken) {
  return jwt.sign(dados, segredo as string, { expiresIn: "8h" });
}

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const cabecalho = req.headers.authorization;
  if (!cabecalho?.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Faça login para continuar." });
  }
  try {
    res.locals.usuario = jwt.verify(cabecalho.slice(7), segredo as string) as DadosToken;
    next();
  } catch {
    res.status(401).json({ erro: "Sessão inválida ou expirada. Faça login novamente." });
  }
}

export function apenasAdmin(_req: Request, res: Response, next: NextFunction) {
  if (res.locals.usuario?.tipo !== "administrador") {
    return res.status(403).json({ erro: "Acesso restrito ao administrador." });
  }
  next();
}