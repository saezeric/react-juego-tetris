import React from "react";
import { Panel } from "./Panel";
import { modelos } from "../lib/modelos";
import { useState } from "react";

export function Juego() {
  const [arrayCasillas, setArrayCasillas] = useState(modelos.matriz);
  return (
    <>
      <Panel modelo={arrayCasillas} />
    </>
  );
}
