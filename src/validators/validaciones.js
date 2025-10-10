export function esTexto(valor) {
  const s = String(valor ?? "").trim();
  return s.length >= 3;
}
export function normalizarTexto(valor) {
  return String(valor ?? "").trim();
}
export function esEnteroPositivo(valor) {
  const n = Number(valor);
  return Number.isInteger(n) && n > 0;
}
export function esFechaISOValida(fecha) {
  const s = String(fecha ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + "T00:00:00Z");
  return !isNaN(d.getTime());
}
