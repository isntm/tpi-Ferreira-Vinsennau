// 1) Helpers de archivos para leer/escribir JSON.
import { leerJSON, escribirJSONAtomico, asegurarArchivo } from "../db/archivos.js";

// 2) Validaciones en español.
import { esTexto, esEnteroPositivo, esFechaISOValida, normalizarTexto } from "../validators/validaciones.js";

// 3) Usamos crypto solo para generar un ID único simple.
import crypto from "node:crypto";

// 4) Ruta del archivo JSON donde guardamos los vuelos.
const RUTA_VUELOS = "src/db/flights.json";

/**
 * 5) listVuelos: devuelve todos los vuelos persistidos.
 */
export async function listVuelos() {
  // 6) Nos aseguramos de que el archivo exista; si no, lo creamos con [].
  await asegurarArchivo(RUTA_VUELOS, []);
  // 7) Leemos y devolvemos el array de vuelos.
  return await leerJSON(RUTA_VUELOS, []);
}

/**
 * 8) createVuelo: valida datos, evita duplicados (numero+fecha),
 *    construye el objeto vuelo y lo persiste.
 */
export async function createVuelo({ numero, origen, destino, fecha, capacidad }) {
  // 9) Normalizamos textos (recortamos espacios).
  const _numero   = normalizarTexto(numero);
  const _origen   = normalizarTexto(origen);
  const _destino  = normalizarTexto(destino);
  const _fecha    = normalizarTexto(fecha);
  const _capacidad = capacidad;

  // 10) Validaciones básicas.
  if (![esTexto(_numero), esTexto(_origen), esTexto(_destino)].every(Boolean)) {
    throw new Error("Campos de texto inválidos (mínimo 3 caracteres).");
  }
  if (!isFinite(Number(_capacidad)) || !esEnteroPositivo(_capacidad)) {
    throw new Error("Capacidad inválida (entero positivo requerido).");
  }
  if (!esFechaISOValida(_fecha)) {
    throw new Error("Fecha inválida. Formato esperado: YYYY-MM-DD.");
  }

  // 11) Cargamos los vuelos existentes.
  const vuelos = await listVuelos();

  // 12) Regla simple: no permitir mismo número + misma fecha.
  const duplicado = vuelos.some(v => v.numero === _numero && v.fecha === _fecha);
  if (duplicado) {
    throw new Error("Ya existe un vuelo con ese número y esa fecha.");
  }

  // 13) Construimos el objeto vuelo **acá mismo** (sin fábrica).
  const vuelo = {
    id: crypto.randomUUID(),           // identificador único
    numero: _numero,
    origen: _origen,
    destino: _destino,
    fecha: _fecha,                     // YYYY-MM-DD
    capacidad: Number(_capacidad),     // entero > 0
    asientosOcupados: 0,               // arranca sin reservas
    pasajeros: []                      // lista simple de pasajeros
  };

  // 14) Agregamos y persistimos de forma atómica.
  vuelos.push(vuelo);
  await escribirJSONAtomico(RUTA_VUELOS, vuelos);

  // 15) Devolvemos el vuelo creado (útil para mostrar o testear).
  return vuelo;
}
