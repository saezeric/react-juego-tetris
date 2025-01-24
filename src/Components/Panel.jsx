/* eslint-disable react/prop-types */
import React from "react";

export const Panel = ({ modelo }) => {
  return (
    <div className="panel container my-5 bg-opacity-50 bg-dark p-5 text-dark">
      {modelo.map((fila, indexFila) => (
        <div key={indexFila} className="fila d-flex justify-content-center">
          {fila.map((celda, indexColumna) => (
            <div
              key={indexColumna}
              className="celda border border-dark p-2 bg-white"
            >
              {celda}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
