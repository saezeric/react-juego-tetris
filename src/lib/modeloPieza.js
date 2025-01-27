import { modelos } from "./modelos";

// Clase para crear nuestras piezas, digamos que es como una plantilla
export class modeloPieza {
  constructor({ numero, nombre, angulo, fila, columna }) {
    this.numero = numero;
    this.nombre = nombre;
    this.angulo = angulo;
    this.fila = fila;
    this.columna = columna;
    this.matriz = this.obtenerMatriz(numero, angulo);
  }

  // Funcion para obtener la matriz de nuevaPieza
  obtenerMatriz(numero, angulo) {
    // Si existe la pieza y existe el angulo de dicha pieza se hace lo siguiente
    if (modelos.piezas[numero] && modelos.piezas[numero].matriz[angulo]) {
      // Devolvemos la pieza concreta con su angulo
      return modelos.piezas[numero].matriz[angulo];
    }
  }

  // Funcion para girar las piezas
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
