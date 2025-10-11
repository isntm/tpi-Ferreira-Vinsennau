// 1) Importamos funciones para leer por consola y pausar
import { leerLinea, pausar } from "./prompts.js";
// 2) Importamos servicios ya implementados
import { createVuelo, listVuelos } from "../service/flightService.js";
// 12) Importamos servicios de reservas ya implementados
import { crearReserva, listarReservas } from "../service/reservationService.js";
// 13) Importamos funciones para formatear salidas (que se vean bien en consola)
import { lineaReserva, tablaReservas, tablaVuelos } from "../utils/format.js";
// 14) Importamos la función para cambiar fecha de reserva
import { cambiarFechaReserva } from "../service/reservationService.js";

/**
 * 3) Muestra el menú principal y gestiona la navegación del usuario.
 */
export async function ejecutarMenuPrincipal() {
  // 4) Variable para almacenar la opción elegida por el usuario
  let opcion = "";

  // 5) Bucle principal: se repite hasta que el usuario elija "0"
  while (opcion !== "0") {
    console.log("\nMenú principal");
    console.log("1) Vuelos - Crear");
    console.log("2) Vuelos - Listar");
    console.log("3) Reservas - Crear");
    console.log("4) Reservas - Cambiar fecha");
    console.log("5) Reservas - Listar");
    console.log("6) Reporte - Vuelos más solicitados");
    console.log("7) Reporte - Pasajeros que cambiaron su reserva");
    console.log("0) Salir");

    // 6) Leemos la opción
    opcion = await leerLinea("Opción: ");

    try {
      switch (opcion) {
        case "1": {
          // 7) Crear vuelo: pedimos datos y llamamos al servicio
          const numero = await leerLinea("Número de vuelo: ");
          const origen = await leerLinea("Origen: ");
          const destino = await leerLinea("Destino: ");
          const fecha = await leerLinea("Fecha (YYYY-MM-DD o DD/MM/YYYY): ");
          const capacidad = await leerLinea("Capacidad (entero > 0): ");

          const creado = await createVuelo({ numero, origen, destino, fecha, capacidad });
          console.log("✅ Vuelo creado:", creado);
          break;
        }

        case "2": {
          // 8) Listar vuelos
          // const vuelos = await listVuelos();
          // console.table(vuelos);
          const vuelos = await listVuelos();
          console.table(tablaVuelos(vuelos));
          break;
        }

        case "3": {
          // Crear reserva
          const vueloId = await leerLinea("ID de vuelo: ");
          const pasajeroNombre = await leerLinea("Nombre del pasajero: ");
          const pasajeroEmail  = await leerLinea("Email del pasajero: ");
          // const r = await crearReserva({ vueloId, pasajeroNombre, pasajeroEmail });
          // console.log("✅ Reserva creada:", r);
          const r = await crearReserva({ vueloId, pasajeroNombre, pasajeroEmail });
          console.log("✅", lineaReserva(r));
          break;
        }

        case "4": {
          const reservaId    = await leerLinea("ID de la reserva (ej. RES-0001): ");
          const nuevoVueloId = await leerLinea("ID del NUEVO vuelo (ej. VUELO-0002): ");

          const reserva = await cambiarFechaReserva({ reservaId, nuevoVueloId });

          // Si usás helpers de formato:
          console.log("✅", lineaReserva(reserva));

          // Salida simple:
          // console.log("✅ Reserva movida:", reserva.id, "→ Vuelo", reserva.vueloId);
          break;
        }

        case "5": {
          // Listar reservas
          // const reservas = await listarReservas();
          // console.table(reservas);
          const reservas = await listarReservas();
          console.table(tablaReservas(reservas));
          break;
        }

        case "6":
          console.log("\n[Aquí luego llamaremos a: reporte de vuelos más solicitados]");
          break;

        case "7":
          console.log("\n[Aquí luego llamaremos a: reporte de cambios de reserva]");
          break;

        case "0":
          // 9) Salir: rompemos el bucle en la próxima evaluación
          break;

        default:
          console.log("\nLa opción no es válida. Intente nuevamente.");
      }
    } catch (error) {
      // 10) Si algo falla, mostramos el mensaje de error
      console.error("Error:", error.message);
    }

    // 11) Pausamos antes de redibujar el menú (si no salimos)
    if (opcion !== "0") {
      await pausar();
    }
  }
}
