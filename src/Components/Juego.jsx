import React from "react";
import { Panel } from "./Panel";
import { modelos } from "../lib/modelos";
import { useState } from "react";
import { nuevaPieza } from "../lib/nuevaPieza";

export function Juego() {
  const [arrayCasillas, setArrayCasillas] = useState(modelos.matriz);
  const [piezaActual, setPiezaActual] = useState([]);

  const insertaNuevaPieza = () => {
    const pActual = nuevaPieza();
    setPiezaActual([...piezaActual, pActual]);
    pintarPieza(pActual);
  };

  const pintarPieza = (pActual) => {
    const nuevaMatriz = [...arrayCasillas];

    pActual.matriz.map((fila, indexFila) => {
      fila.map((celda, indexColumna) => {
        if (
          arrayCasillas[pActual.fila + indexFila][
            pActual.columna + indexColumna
          ] === 1
        ) {
          // Hacer que la pieza aparezca dentro del panel si esta se sobrepone sobre el borde 1
          if (
            arrayCasillas[pActual.fila + indexFila][
              pActual.columna + indexColumna
            ] <= 1
          ) {
            // Si la pieza se sobrepone sobre el borde 1, hacemos que la pieza entre dentro del panel
            pActual.columna = 1;
            nuevaMatriz[pActual.fila + indexFila][
              pActual.columna + indexColumna
            ] = celda;
          }
          // Hacer que la pieza aparezca dentro del panel si esta se sobrepone sobre el borde 11
          if (
            arrayCasillas[pActual.fila + indexFila][
              pActual.columna + indexColumna
            ] >= 10
          ) {
            nuevaMatriz[pActual.fila + indexFila][
              pActual.columna - indexColumna
            ] = celda;
          }
        }
        console.log(pActual.columna, indexColumna);
      });
    });

    pActual.matriz.map((fila, indexFila) => {
      fila.map((celda, indexColumna) => {
        if (celda !== 0) {
          nuevaMatriz[pActual.fila + indexFila][
            pActual.columna + indexColumna
          ] = celda;
        }
      });
    });
    setArrayCasillas(nuevaMatriz);
  };

  return (
    <>
      {/* Codigo para mostrar todas y cada una de las piezas */}
      {/* {modelos.piezas.map((pieza, index) =>
        pieza.matriz.map((fila, indexFila) => (
          // Llamamos a la clase Pieza para obtener nuestras piezas y sus angulos
          <Pieza
            key={`${index}-${indexFila}`} // Identificacion unica para cada pieza, es importante para diferenciarlas
            numero={index} // Es el numero que hace referencia a nuestra pieza, a este le sumaremos +2 en modeloPieza.js
            nombre={pieza.nombre} // Es el nombre que hace referencia a nuestra pieza
            angulo={indexFila} // Puedes cambiar esto según sea necesario
          />
        ))
      )} */}

      {/* Codigo que muestra la pieza actual por pantalla fuera del panel */}
      {/* {piezaActual.map((p, index) => (
        <Pieza
          key={index}
          numero={p.numero}
          nombre={p.nombre}
          angulo={p.angulo}
        />
      ))} */}

      <div className="container text-center bg-opacity-50 bg-dark text-dark my-5">
        <button className="container p-3 my-2" onClick={insertaNuevaPieza}>
          Agregar Pieza
        </button>
      </div>

      {/* Panel de juego de nuestro tetris */}
      <Panel modelo={arrayCasillas} />
    </>
  );
}
