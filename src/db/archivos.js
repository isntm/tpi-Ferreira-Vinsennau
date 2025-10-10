import { promises as fs } from "node:fs";

export async function asegurarArchivo(ruta, respaldo = []) {
  try { await fs.access(ruta); }
  catch { await fs.writeFile(ruta, JSON.stringify(respaldo, null, 2), "utf8"); }
}

export async function leerJSON(ruta, respaldo = []) {
  await asegurarArchivo(ruta, respaldo);
  const raw = await fs.readFile(ruta, "utf8");
  if (!raw) return JSON.parse(JSON.stringify(respaldo));
  return JSON.parse(raw);
}

export async function escribirJSONAtomico(ruta, datos) {
  const contenido = JSON.stringify(datos, null, 2);
  const tmp = ruta + ".tmp";
  await fs.writeFile(tmp, contenido, "utf8");
  await fs.rename(tmp, ruta);
}
