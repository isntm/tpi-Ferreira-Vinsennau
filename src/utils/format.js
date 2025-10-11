// Fecha/hora legible en español (zona local de tu equipo)
export function formatearFechaHora(iso) {
  try {
    return new Date(iso).toLocaleString("es-AR", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit"
    });
  } catch {
    return iso; // si algo falla, devolvemos el ISO crudo
  }
}

// Una línea prolija para mostrar una reserva recién creada
export function lineaReserva(reserva) {
  const { id, vueloId, pasajero, estado, creadaEl } = reserva;
  const fh = formatearFechaHora(creadaEl);
  return `Reserva ${id} | Vuelo ${vueloId} | Pasajero: ${pasajero.nombre} <${pasajero.email}> | Estado: ${estado} | Creada: ${fh}`;
}

// Proyección tabular de reservas para console.table
export function tablaReservas(reservas) {
  return reservas.map(r => ({
    ID: r.id,
    Vuelo: r.vueloId,
    Pasajero: r.pasajero?.nombre ?? "",
    Email: r.pasajero?.email ?? "",
    Estado: r.estado,
    "Creada el": formatearFechaHora(r.creadaEl)
  }));
}

// Proyección tabular de vuelos (opcional)
export function tablaVuelos(vuelos) {
  return vuelos.map(v => ({
    ID: v.id,
    Número: v.numero,
    Origen: v.origen,
    Destino: v.destino,
    Fecha: v.fecha,
    Capacidad: v.capacidad,
    Ocupados: v.asientosOcupados
  }));
}
