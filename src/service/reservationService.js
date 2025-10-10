import { leerJSON, escribirJSONAtomico, asegurarArchivo } from "../db/archivos.js";
import { esTexto, esEmailBasico, normalizarTexto } from "../validators/validaciones.js";
import crypto from "node:crypto";

const RUTA_VUELOS = "src/db/flights.json";
const RUTA_RESERVAS = "src/db/reservations.json";

// Listar todas las reservas
export async function listarReservas() {
  await asegurarArchivo(RUTA_RESERVAS, []);
  return await leerJSON(RUTA_RESERVAS, []);
}

// Crear reserva (si hay disponibilidad en el vuelo)
export async function crearReserva({ vueloId, pasajeroNombre, pasajeroEmail }) {
  const nombre = normalizarTexto(pasajeroNombre);
  const email  = normalizarTexto(pasajeroEmail);
  if (!esTexto(nombre)) throw new Error("Nombre inválido (mín. 3).");
  if (!esEmailBasico(email)) throw new Error("Email inválido.");

  const [vuelos, reservas] = await Promise.all([
    (async () => { await asegurarArchivo(RUTA_VUELOS, []);   return leerJSON(RUTA_VUELOS, []); })(),
    (async () => { await asegurarArchivo(RUTA_RESERVAS, []); return leerJSON(RUTA_RESERVAS, []); })()
  ]);

  const vuelo = vuelos.find(v => v.id === vueloId);
  if (!vuelo) throw new Error("El vuelo no existe.");
  if (vuelo.asientosOcupados >= vuelo.capacidad) throw new Error("Sin disponibilidad en ese vuelo.");

  const reserva = {
    id: crypto.randomUUID(),
    vueloId,
    pasajero: { nombre, email },
    estado: "ACTIVA",
    creadaEl: new Date().toISOString()
  };

  reservas.push(reserva);
  vuelo.asientosOcupados += 1;
  vuelo.pasajeros.push({ idReserva: reserva.id, nombre, email });

  await Promise.all([
    escribirJSONAtomico(RUTA_RESERVAS, reservas),
    escribirJSONAtomico(RUTA_VUELOS, vuelos)
  ]);

  return reserva;
}
