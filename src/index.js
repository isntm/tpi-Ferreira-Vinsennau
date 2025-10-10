
// A partir de aquí todo el código lo guardaremos comentado, para aprender y reforzar conceptos.
// Luego, cuando el código esté listo, lo iremos descomentando.

// 1) Importamos la función que corre el menú principal
import { ejecutarMenuPrincipal } from "./cli/menu.js";

// 2) Inmediatamente invocamos una función asíncrona autoejecutable
(async () => {
  // 3) Limpiamos la consola para que se vea prolijo cada vez que inicia
  console.clear();

  // 4) Mostramos un encabezado descriptivo
  console.log("__| Sistema de Reservas de Vuelos |__");

  // 5) Ejecutamos el menú principal (flujo de la app)
  await ejecutarMenuPrincipal();

  // 6) Mensaje final cuando el usuario elige salir
  console.log("\nGracias por usar el sistema. ¡Te esperamos pronto!\n");
})();   
