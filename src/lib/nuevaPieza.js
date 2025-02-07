import { modelos } from "./modelos.js";
import { modeloPieza } from "./modeloPieza.js";

// Funcion que crea una pieza completamente aleatoria y usa la clase modeloPieza para crearse
export function nuevaPieza() {
  // Numero aleatorio para poder variar entre piezas de forma aleatoria
  const numero = Math.floor(Math.random() * modelos.piezas.length);
  const nombre = modelos.piezas[numero].nombre;
  // Cambiamos el angulo de forma random para cada pieza como en el juego original
  const angulo = Math.floor(
    Math.random() * modelos.piezas[numero].matriz.length
  );
  const fila = 0;
  const columna = Math.floor(
    Math.random() * (11 - modelos.piezas[numero].matriz[angulo][0].length) + 1
  );
  return new modeloPieza({ numero, nombre, angulo, fila, columna });
}
