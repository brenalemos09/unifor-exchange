export function inteiro(valor: unknown): number | undefined {
  const n = Number(valor);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

function hojeISO(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "America/Fortaleza" });
}

export function statusOportunidade(inicio: Date, fim: Date): "em_breve" | "aberta" | "encerrada" {
  const hoje = hojeISO();
  const i = inicio.toISOString().slice(0, 10);
  const f = fim.toISOString().slice(0, 10);
  if (hoje < i) return "em_breve";
  if (hoje > f) return "encerrada";
  return "aberta";
}