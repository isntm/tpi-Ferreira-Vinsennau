// 1) Importamos funciones para leer por consola y pausar
import { leerLinea, pausar } from "./prompts.js";
// 2) Importamos servicios ya implementados
import { createVuelo, listVuelos } from "../service/flightService.js";

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
          const vuelos = await listVuelos();
          console.table(vuelos);
          break;
        }

        case "3":
          console.log("\n[Aquí luego llamaremos a: crear reserva]");
          break;

        case "4":
          console.log("\n[Aquí luego llamaremos a: cambiar fecha de reserva]");
          break;

        case "5":
          console.log("\n[Aquí luego llamaremos a: listar reservas]");
          break;

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
