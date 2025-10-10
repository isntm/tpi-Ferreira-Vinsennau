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
// Convierte "YYYY-MM-DD" o "DD/MM/YYYY" o "DD-MM-YYYY" a ISO "YYYY-MM-DD".
// Devuelve string ISO o null si no reconoce el formato.
export function aISODesdeFlexible(fecha) {
  const s = String(fecha ?? "").trim();

  // Caso 1: ya es ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // Caso 2: DD/MM/YYYY o DD-MM-YYYY
  const m = s.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);
  if (m) {
    const [, dd, mm, yyyy] = m;
    const d = Number(dd), mN = Number(mm), y = Number(yyyy);
    if (y >= 1900 && mN >= 1 && mN <= 12 && d >= 1 && d <= 31) {
      return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    }
  }
  return null;
}

// Valida fecha en cualquiera de esos formatos, verificando que Date la acepte.
export function esFechaValidaFlexible(fecha) {
  const iso = aISODesdeFlexible(fecha);
  if (!iso) return false;
  const dt = new Date(iso + "T00:00:00Z");
  return !isNaN(dt.getTime());
}
