import { modelos } from "./modelos";

export class modeloPieza {
  constructor({ numero, nombre, angulo }) {
    this.numero = numero + 2;
    this.nombre = nombre;
    this.angulo = angulo;
    this.fila = 0;
    this.columna = 1;
    this.matriz = this.obtenerMatriz(numero, angulo);
  }

  obtenerMatriz(numero, angulo) {
    // Si existe la pieza y existe el angulo de dicha pieza se hace lo siguiente
    if (modelos.piezas[numero] && modelos.piezas[numero].matriz[angulo]) {
      // Devolvemos la pieza concreta con su angulo
      return modelos.piezas[numero].matriz[angulo];
    }
  }

  girar() {
    // Si existe la pieza y existe el angulo de dicha pieza se hace lo siguiente
    if (
      modelos.piezas[this.numero] &&
      modelos.piezas[this.numero].matriz[this.angulo + 1]
    ) {
      // Aumentamos el angulo de la pieza
      this.angulo++;
      // Devolvemos la pieza concreta con su angulo
      return modelos.piezas[this.numero].matriz[this.angulo];
    } else {
      // Si no existe el angulo, volvemos a la posicion inicial
      this.angulo = 0;
      // Devolvemos la pieza concreta con su angulo
      return modelos.piezas[this.numero].matriz[this.angulo];
    }
  }
}
