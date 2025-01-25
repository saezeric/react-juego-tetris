import React from "react";
import { Panel } from "./Panel";
import { Pieza } from "./Pieza";
import { modelos } from "../lib/modelos";
import { useState } from "react";

export function Juego() {
  const [arrayCasillas, setArrayCasillas] = useState(modelos.matriz);

  return (
    <>
      {modelos.piezas.map((pieza, index) =>
        pieza.matriz.map((fila, indexFila) => (
          // Llamamos a la clase Pieza para obtener nuestras piezas y sus angulos
          <Pieza
            key={`${index}-${indexFila}`} // Identificacion unica para cada pieza, es importante para diferenciarlas
            numero={index} // Es el numero que hace referencia a nuestra pieza, a este le sumaremos +2 en modeloPieza.js
            nombre={pieza.nombre} // Es el nombre que hace referencia a nuestra pieza
            angulo={indexFila} // Puedes cambiar esto según sea necesario
          />
        ))
      )}
      <Panel modelo={arrayCasillas} />
    </>
  );
}
