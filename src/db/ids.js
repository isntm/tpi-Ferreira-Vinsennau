import { asegurarArchivo, leerJSON, escribirJSONAtomico } from "./archivos.js";

const RUTA_CONTADORES = "src/db/counters.json";

// Incrementa un contador y devuelve un ID con prefijo + número con ceros.
async function siguienteId({ campo, prefijo }) {
  // Si no existe, lo crea con ambos contadores en 0
  await asegurarArchivo(RUTA_CONTADORES, { vuelos: 0, reservas: 0 });
  const data = await leerJSON(RUTA_CONTADORES, { vuelos: 0, reservas: 0 });

  // Incremento del contador solicitado
  data[campo] = (data[campo] ?? 0) + 1;

  // Persistimos atómicamente
  await escribirJSONAtomico(RUTA_CONTADORES, data);

  // Ej.: "VUELO-0001" / "RES-0001"
  return `${prefijo}-${String(data[campo]).padStart(4, "0")}`;
}

export async function siguienteIdVuelo() {
  return siguienteId({ campo: "vuelos", prefijo: "VUELO" });
}

export async function siguienteIdReserva() {
  return siguienteId({ campo: "reservas", prefijo: "RES" });
}
