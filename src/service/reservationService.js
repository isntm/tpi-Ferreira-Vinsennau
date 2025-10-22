import { leerJSON, escribirJSONAtomico, asegurarArchivo } from "../db/archivos.js";
import { esTexto, esEmailBasico, normalizarTexto } from "../validators/validaciones.js";
// import crypto from "node:crypto"; Este ya no se usa, lo cambiamos por IDs mas legibles
import { siguienteIdReserva } from "../db/ids.js";

// Normaliza IDs: recorta y pasa a MAYÚSCULAS
const toId = (s) => String(s ?? "").trim().toUpperCase();

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

  // definir ANTES de usar
  const vueloIdNorm = toId(vueloId);

  // comparar con IDs normalizados
  const vuelo = vuelos.find(v => toId(v.id) === vueloIdNorm);
  if (!vuelo) throw new Error("El vuelo no existe.");
  if (vuelo.asientosOcupados >= vuelo.capacidad) throw new Error("Sin disponibilidad en ese vuelo.");

  const reserva = {
    id: await siguienteIdReserva(),   // o crypto.randomUUID() si no usás contadores
    vueloId: vueloIdNorm,             // ✅ guardar ya normalizado
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

/**
 * Cambiar fecha (mover) una reserva a otro vuelo.
 * Valida que la reserva esté ACTIVA, que el nuevo vuelo exista y tenga cupo,
 * actualiza asientos/pasajeros en ambos vuelos y registra historial.
 */
export async function cambiarFechaReserva({ reservaId, nuevoVueloId }) {
  // Normalizamos IDs (case-insensitive)
  const resId   = toId(reservaId);
  const nuevoId = toId(nuevoVueloId);

  // Carga de datos
  const [vuelos, reservas] = await Promise.all([
    (async () => { await asegurarArchivo(RUTA_VUELOS, []);   return leerJSON(RUTA_VUELOS, []); })(),
    (async () => { await asegurarArchivo(RUTA_RESERVAS, []); return leerJSON(RUTA_RESERVAS, []); })()
  ]);

  // 1) Buscar reserva ACTIVA
  const reserva = reservas.find(x => toId(x.id) === resId && x.estado === "ACTIVA");
  if (!reserva) throw new Error("La reserva no existe o no está ACTIVA.");

  // 2) Vuelos origen/destino
  const vueloOrigen  = vuelos.find(v => toId(v.id) === toId(reserva.vueloId)); // puede ser null si se borró
  const vueloDestino = vuelos.find(v => toId(v.id) === nuevoId);
  if (!vueloDestino) throw new Error("El nuevo vuelo no existe.");

  // 3) Evitar no-op
  if (toId(reserva.vueloId) === nuevoId) {
    throw new Error("La reserva ya está asignada a ese vuelo.");
  }

  // 4) Cupo en destino
  if (vueloDestino.asientosOcupados >= vueloDestino.capacidad) {
    throw new Error("No hay disponibilidad en el nuevo vuelo.");
  }

  // 5) Actualizar ORIGEN: liberar asiento y remover pasajero
  if (vueloOrigen) {
    vueloOrigen.asientosOcupados = Math.max(0, vueloOrigen.asientosOcupados - 1);
    vueloOrigen.pasajeros = (vueloOrigen.pasajeros || []).filter(p => p.idReserva !== reserva.id);
  }

  // 6) Actualizar DESTINO: ocupar asiento y agregar pasajero
  vueloDestino.asientosOcupados += 1;
  if (!Array.isArray(vueloDestino.pasajeros)) vueloDestino.pasajeros = [];
  vueloDestino.pasajeros.push({
    idReserva: reserva.id,
    nombre: reserva.pasajero.nombre,
    email: reserva.pasajero.email
  });

  // 7) Historial + mover puntero
  if (!Array.isArray(reserva.historial)) reserva.historial = [];
  reserva.historial.push({
    deVueloId: reserva.vueloId,
    aVueloId: vueloDestino.id,
    fecha: new Date().toISOString()
  });
  reserva.vueloId = vueloDestino.id;

  // 8) Persistencia atómica
  await Promise.all([
    escribirJSONAtomico(RUTA_VUELOS, vuelos),
    escribirJSONAtomico(RUTA_RESERVAS, reservas)
  ]);

  // 9) Devolvemos la reserva actualizada
  return reserva;
}

// Reporte: vuelos más solicitados (por asientos ocupados)
export async function vuelosMasSolicitados(limite = 5) {
  await asegurarArchivo(RUTA_VUELOS, []);
  const vuelos = await leerJSON(RUTA_VUELOS, []);
  // ordena desc. por asientosOcupados y toma top N
  return [...vuelos].sort((a, b) => b.asientosOcupados - a.asientosOcupados).slice(0, limite);
}

// Reporte: cuántos pasajeros cambiaron (únicos) y total de cambios
export async function contarPasajerosQueCambiaron() {
  await asegurarArchivo(RUTA_RESERVAS, []);
  const reservas = await leerJSON(RUTA_RESERVAS, []);
  const emailsUnicos = new Set(
    reservas
      .filter(r => (r.historial?.length || 0) > 0)
      .map(r => r.pasajero.email)
  );
  const totalCambios = reservas.reduce((acc, r) => acc + (r.historial?.length || 0), 0);
  return { pasajerosQueCambiaron: emailsUnicos.size, totalCambios };
}
