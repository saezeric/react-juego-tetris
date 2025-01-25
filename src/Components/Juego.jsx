import React from "react";
import { Panel } from "./Panel";
import { Pieza } from "./Pieza";
import { modelos } from "../lib/modelos";
import { useState } from "react";

export function Juego() {
  const [arrayCasillas, setArrayCasillas] = useState(modelos.matriz);
  return (
    <>
      <Pieza modelo={modelos.piezas[0].matriz[0]} />
      <Pieza modelo={modelos.piezas[1].matriz[0]} />
      <Pieza modelo={modelos.piezas[2].matriz[0]} />
      <Pieza modelo={modelos.piezas[3].matriz[0]} />
      <Pieza modelo={modelos.piezas[4].matriz[0]} />
      <Pieza modelo={modelos.piezas[5].matriz[0]} />
      <Pieza modelo={modelos.piezas[6].matriz[0]} />
      <Panel modelo={arrayCasillas} />
    </>
  );
}
