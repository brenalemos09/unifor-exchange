import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./prisma";
import { authRouter } from "./routes/auth";
import { catalogoRouter } from "./routes/catalogo";
import { oportunidadesRouter } from "./routes/oportunidades";
import { quizRouter } from "./routes/quiz";
import { conteudoRouter } from "./routes/conteudo";
import { adminRouter } from "./routes/admin";
import { recuperacaoRouter } from "./routes/recuperacao";
import { estudanteRouter } from "./routes/estudante";

const app = express();

// CORS: só o endereço do site pode chamar a API pelo navegador.
// CORS_ORIGEM aceita vários endereços separados por vírgula (ex.: produção e localhost).
const origensPermitidas = (process.env.CORS_ORIGEM || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);
app.use(cors({ origin: origensPermitidas }));
app.use(express.json());

app.get("/saude", (_req, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRouter);
app.use("/auth", recuperacaoRouter);
app.use(catalogoRouter);
app.use(oportunidadesRouter);
app.use(quizRouter);
app.use(conteudoRouter);
app.use("/admin", adminRouter);
app.use(estudanteRouter);

const porta = Number(process.env.PORT) || 3000;
app.listen(porta, (erro) => {
  if (erro) {
    console.error(`Não foi possível iniciar a API na porta ${porta}: ${erro.message}`);
    process.exit(1);
  }
  console.log(`API rodando em http://localhost:${porta}`);
  console.log(`CORS liberado para: ${origensPermitidas.join(", ")}`);
});