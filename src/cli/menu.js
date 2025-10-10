// 1) Importamos funciones para leer por consola y pausar
import { leerLinea, pausar } from "./prompts.js";

/**
 * 2) Muestra el menú principal y gestiona la navegación del usuario.
 */
export async function ejecutarMenuPrincipal() {
  // 3) Variable para almacenar la opción elegida por el usuario
  let opcion = "";

  // 4) Bucle principal: se repite hasta que el usuario elija "0"
  while (opcion !== "0") {
    // 5) Mostramos las opciones disponibles del sistema
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

    // 7) Intentamos ejecutar la acción elegida, capturando errores
    try {
      if (opcion === "1") {
        console.log("\n[Aquí luego llamaremos a: crear vuelo]");
      } else if (opcion === "2") {
        console.log("\n[Aquí luego llamaremos a: listar vuelos]");
      } else if (opcion === "3") {
        console.log("\n[Aquí luego llamaremos a: crear reserva]");
      } else if (opcion === "4") {
        console.log("\n[Aquí luego llamaremos a: cambiar fecha de reserva]");
      } else if (opcion === "5") {
        console.log("\n[Aquí luego llamaremos a: listar reservas]");
      } else if (opcion === "6") {
        console.log("\n[Aquí luego llamaremos a: reporte de vuelos más solicitados]");
      } else if (opcion === "7") {
        console.log("\n[Aquí luego llamaremos a: reporte de cambios de reserva]");
      } else if (opcion === "0") {
        // 8) El usuario eligió salir: rompemos el bucle en la próxima iteración
        break;
      } else {
        // 9) Opción inválida
        console.log("\nLa opción no es válida. Intente nuevamente.");
      }
    } catch (error) {
      // 10) Si algo falla, mostramos el mensaje de error
      console.error("Error:", error.message);
    }

    // 11) Pausamos antes de mostrar nuevamente el menú
    if (opcion !== "0") {
      await pausar();
    }
  }
}
