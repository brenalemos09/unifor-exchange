import express from "express";
import cors from "cors";
import { prisma } from "./prisma";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/saude", (_req, res) => {
  res.json({ ok: true });
});

app.get("/universidades", async (_req, res) => {
  const universidades = await prisma.universidade.findMany({
    orderBy: { nome: "asc" },
  });
  res.json(universidades);
});

const porta = Number(process.env.PORT) || 3000;
app.listen(porta, () => {
  console.log(`API rodando em http://localhost:${porta}`);
});