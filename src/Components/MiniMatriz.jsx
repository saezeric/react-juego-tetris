import React from "react";
import { colorPieza } from "../lib/colores";

export function MiniMatriz({ matriz }) {
  return (
    <div
      style={{
        // Quitamos height: "100vh"
        display: "flex",
        justifyContent: "center",
        // alignItems: "center", // Si también quieres centrar verticalmente dentro de su contenedor, mantenlo.
      }}
    >
      <div
        style={{
          width: "120px",
          height: "120px",
          backgroundColor: "white",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "5px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {matriz.map((fila, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "center" }}>
              {fila.map((celda, j) => {
                if (celda === 0) {
                  return (
                    <div
                      key={j}
                      style={{
                        width: "20px",
                        height: "20px",
                        margin: "1px",
                        backgroundColor: "transparent",
                      }}
                    />
                  );
                }

                const classColor = colorPieza({ numero: celda });
                return (
                  <div
                    key={j}
                    className={classColor}
                    style={{
                      width: "20px",
                      height: "20px",
                      margin: "1px",
                      border: "1px solid #ddd",
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
