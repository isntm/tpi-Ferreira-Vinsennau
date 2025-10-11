// 1) Helpers de archivos para leer/escribir JSON.
import { leerJSON, escribirJSONAtomico, asegurarArchivo } from "../db/archivos.js";

// 2) Validaciones + fecha flexible.
import {
  esTexto,
  esEnteroPositivo,
  esFechaValidaFlexible,
  normalizarTexto,
  aISODesdeFlexible
} from "../validators/validaciones.js";

// 3) Usamos crypto para generar un ID único (UUID). Esta la discontinuamos en ids.js para usar ids mas legibles
// import crypto from "node:crypto";

import { siguienteIdVuelo } from "../db/ids.js";

// 4) Ruta del archivo JSON donde guardamos los vuelos.
const RUTA_VUELOS = "src/db/flights.json";

/**
 * 5) listVuelos: devuelve todos los vuelos persistidos.
 */
export async function listVuelos() {
  await asegurarArchivo(RUTA_VUELOS, []);
  return await leerJSON(RUTA_VUELOS, []);
}

/**
 * 6) createVuelo: valida datos, evita duplicados (numero+fechaISO),
 *    construye el objeto vuelo y lo persiste (ID UUID).
 */
export async function createVuelo({ numero, origen, destino, fecha, capacidad }) {
  // 7) Normalizamos textos (recortamos espacios).
  const _numero    = normalizarTexto(numero);
  const _origen    = normalizarTexto(origen);
  const _destino   = normalizarTexto(destino);
  const _fechaIn   = normalizarTexto(fecha);
  const _capacidad = capacidad;

  // 8) Validaciones básicas de texto/capacidad
  if (![esTexto(_numero), esTexto(_origen), esTexto(_destino)].every(Boolean)) {
    throw new Error("Campos de texto inválidos (mínimo 3 caracteres).");
  }
  if (!isFinite(Number(_capacidad)) || !esEnteroPositivo(_capacidad)) {
    throw new Error("Capacidad inválida (entero positivo requerido).");
  }

  // 9) Fecha: aceptar YYYY-MM-DD o DD/MM/YYYY o DD-MM-YYYY, guardar siempre en ISO
  if (!esFechaValidaFlexible(_fechaIn)) {
    throw new Error("Fecha inválida. Usá YYYY-MM-DD o DD/MM/YYYY.");
  }
  const fechaISO = aISODesdeFlexible(_fechaIn); // convertimos a ISO para persistir uniforme

  // 10) Cargamos los vuelos existentes
  const vuelos = await listVuelos();

  // 11) Regla simple: no permitir mismo número + misma fecha (en ISO)
  const duplicado = vuelos.some(v => v.numero === _numero && v.fecha === fechaISO);
  if (duplicado) {
    throw new Error("Ya existe un vuelo con ese número y esa fecha.");
  }

  // 12) Construimos el objeto vuelo con UUID y fecha en ISO (sin bloqueo de pasado)
  const vuelo = {
    // id: crypto.randomUUID(),          // UUID (sí, “largo” por ahora)
    id: await siguienteIdVuelo(),       // <-- ID corto y ordenado
    numero: _numero,
    origen: _origen,
    destino: _destino,
    fecha: fechaISO,                  // Guardado uniforme en ISO
    capacidad: Number(_capacidad),    // entero > 0
    asientosOcupados: 0,              // arranca sin reservas
    pasajeros: []                     // lista simple de pasajeros
  };

  // 13) Agregamos y persistimos de forma atómica.
  vuelos.push(vuelo);
  await escribirJSONAtomico(RUTA_VUELOS, vuelos);

  // 14) Devolvemos el vuelo creado (útil para mostrar o testear).
  return vuelo;
}
