import { modelos } from "./modelos.js";
import { modeloPieza } from "./modeloPieza.js";

export function nuevaPieza() {
  const numero = Math.floor(Math.random() * modelos.piezas.length);
  const nombre = modelos.piezas[numero].nombre;
  const angulo = 0;
  return new modeloPieza({ numero, nombre, angulo });
}
