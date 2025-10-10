// 1) Importamos prompt-sync para leer desde la consola
import crearPromptSync from "prompt-sync";

// 2) Creamos una instancia de prompt con soporte para Ctrl+C (sigint)
const prompt = crearPromptSync({ sigint: true });

/**
 * 3) Solicita al usuario que ingrese un texto, mostrando una etiqueta.
 *    Retorna la cadena ingresada (sin validar).
 */
export async function leerLinea(etiqueta) {
  // 4) Mostramos la etiqueta y leemos lo que el usuario escribe
  const valor = prompt(etiqueta);
  // 5) Devolvemos una promesa resuelta, para poder usar await
  return Promise.resolve(valor);
}

/**
 * 6) Pausa la ejecución hasta que el usuario presiona Enter.
 */
export async function pausar(mensaje = "Presione Enter para continuar...") {
  // 7) Esperamos una tecla para continuar (no usamos el valor)
  prompt(mensaje);
}
