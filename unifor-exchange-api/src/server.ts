import express from "express";
import cors from "cors";
import { prisma } from "./prisma";
import { authRouter } from "./routes/auth";
import { catalogoRouter } from "./routes/catalogo";
import { oportunidadesRouter } from "./routes/oportunidades";
import { quizRouter } from "./routes/quiz";
import { estudanteRouter } from "./routes/estudante";
import { conteudoRouter } from "./routes/conteudo";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use(catalogoRouter);
app.use(oportunidadesRouter);
app.use(quizRouter);
app.use(conteudoRouter);

app.use(estudanteRouter);

app.get("/saude", (_req, res) => {
  res.json({ ok: true });
});

const porta = Number(process.env.PORT) || 3000;
app.listen(porta, () => {
  console.log(`API rodando em http://localhost:${porta}`);
});