/* eslint-disable react/prop-types */
import React from "react";
import { colorPieza } from "../lib/colores";
import { modeloPieza } from "../lib/modeloPieza";

export const Panel = ({ modelo }) => {
  return (
    <div className="panel container my-5 bg-opacity-50 bg-dark p-5 text-dark">
      {modelo.map((fila, indexFila) => (
        <div key={indexFila} className="fila d-flex justify-content-center">
          {fila.map((celda, indexColumna) => {
            // Llama a colorPieza con el número de la celda
            const claseColor = colorPieza({ numero: celda });
            return (
              <div
                key={indexColumna}
                className={`celda border border-dark p-2 ${claseColor}`}
              >
                {celda}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
