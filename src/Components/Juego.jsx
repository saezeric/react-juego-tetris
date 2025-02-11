import React from "react";
import { Panel } from "./Panel";
import { modelos } from "../lib/modelos";
import { useState, useEffect } from "react";
import { nuevaPieza } from "../lib/nuevaPieza";

export function Juego() {
  const [arrayCasillas, setArrayCasillas] = useState(modelos.matriz);
  const [piezaActual, setPiezaActual] = useState(nuevaPieza());

  // ####################################################
  //     Insertar nuevas piezas a traves de un boton
  // ####################################################

  function insertaNuevaPieza() {
    const pActual = nuevaPieza();
    setPiezaActual(pActual);
    pintarPieza(pActual);
  }

  // #############################################################
  //    Imprimimos la matriz de nuestra ficha dentro del panel
  // #############################################################

  const pintarPieza = (pActual) => {
    const nuevaMatriz = [...arrayCasillas];

    // console.log(pActual.columna);
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

  // #########################################################
  //  Realizar un movimiento cada vez que se clica una tecla
  // #########################################################

  useEffect(() => {
    // L'efecte a executar
    function controlTeclas(event) {
      if (event.key === "ArrowUp") {
        girar(event);
      }
      if (event.key === "ArrowDown") {
        bajar(event);
      }
      if (event.key === "ArrowRight") {
        moverDra(event);
      }
      if (event.key === "ArrowLeft") {
        moverIzq(event);
      }
    }
    console.log("Se esta ejecutando el useEffect");
    window.addEventListener("keydown", controlTeclas);

    return () => {
      // Cleanup (opcional)
      window.removeEventListener("keydown", controlTeclas);
    };
  }, []);

  // ####################################################
  //          Funciones para mover las piezas
  // ####################################################

  function moverDra(e) {
    console.log("Has pulsado la tecla derecha", e.key);
    piezaActual.columna++;
    console.log(piezaActual.columna);
  }

  function moverIzq(e) {
    console.log("Has pulsado la tecla izquierda", e.key);
    piezaActual.columna--;
    console.log(piezaActual.columna);
  }

  function bajar(e) {
    console.log("Has pulsado la tecla bajar", e.key);
    piezaActual.fila++;
    setPiezaActual({ ...piezaActual });
    console.log(piezaActual.fila);
  }

  function girar(e) {
    console.log("Funcion Girar", e.key);
    if (piezaActual.angulo == 3) {
      piezaActual.angulo = 0;
      console.log(piezaActual.angulo);
    } else {
      piezaActual.angulo++;
      console.log(piezaActual.angulo);
    }
  }

  useEffect(() => {
    pintarPieza(piezaActual);
  }, [piezaActual]);

  return (
    <>
      {/*#######################################################

      Codigo para mostrar todas las piezas de nuestro array

      #########################################################*/}

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

      {/* #######################################################
      Codigo para mostrar nuestro Panel de juego
      ######################################################### */}

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
