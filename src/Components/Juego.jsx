import React from "react";
import { Panel } from "./Panel";
import { modelos } from "../lib/modelos";
import { useState, useEffect } from "react";
import { nuevaPieza } from "../lib/nuevaPieza";

export function Juego() {
  const [arrayCasillas, setArrayCasillas] = useState(modelos.matriz);
  const [piezaActual, setPiezaActual] = useState(nuevaPieza());
  let [puntuacion, setPuntuacion] = useState(0);

  // Temporizador para que la pieza baje automaticamente sola
  // eslint-disable-next-line no-unused-vars
  let temporizador;

  // ####################################################
  //     Insertar nuevas piezas a traves de un boton
  // ####################################################

  function insertaNuevaPieza() {
    setPiezaActual(nuevaPieza());
  }

  // #############################################################
  //    Imprimimos la matriz de nuestra ficha dentro del panel
  // #############################################################

  const pintarPieza = (piezaActual) => {
    const nuevaMatriz = [...arrayCasillas];

    // console.log(piezaActual.columna);
    piezaActual.matriz.forEach((fila, indexFila) => {
      fila.forEach((celda, indexColumna) => {
        if (celda !== 0) {
          nuevaMatriz[piezaActual.fila + indexFila][
            piezaActual.columna + indexColumna
          ] = celda;
        }
      });
    });
    console.log("piezaActual.matriz:", piezaActual.matriz);
    setArrayCasillas(nuevaMatriz);
  };

  // ##################################################################################
  //    Si piezaActual se mueve o se gira, se elimina la estela que deja tras de si
  // ##################################################################################

  function borrarPieza(piezaActual) {
    const nuevaMatriz = [...arrayCasillas]; // Copia de la matriz del tablero

    // Recorremos la matriz de la pieza
    piezaActual.matriz.forEach((fila, indexFila) => {
      fila.forEach((celda, indexColumna) => {
        if (celda !== 0) {
          // Si la celda no es 0, la borramos de la matriz del tablero
          nuevaMatriz[piezaActual.fila + indexFila][
            piezaActual.columna + indexColumna
          ] = 0; // 0 representa una celda vacía
        }
      });
    });

    // Actualizamos el estado del tablero
    setArrayCasillas(nuevaMatriz);
  }

  function piezaTocaSuelo(piezaActual) {
    const suelo = arrayCasillas.length - 1; // Medimos el array y restamos uno para marcar como limite el suelo
    return piezaActual.fila + piezaActual.matriz.length >= suelo; // devolvemos piezaActual siempre que no colisionemos con suelo
  }

  // #########################################################
  //  Realizar un movimiento cada vez que se clica una tecla
  // #########################################################

  useEffect(() => {
    // L'efecte a executar
    function controlTeclas(event) {
      if (event.key === "ArrowUp") {
        girar();
      }
      if (event.key === "ArrowDown") {
        bajar();
      }
      if (event.key === "ArrowRight") {
        moverDra();
      }
      if (event.key === "ArrowLeft") {
        moverIzq();
      }
    }
    console.log("Se esta ejecutando el useEffect");
    window.addEventListener("keydown", controlTeclas);

    return () => {
      window.removeEventListener("keydown", controlTeclas); // Cleanup (opcional)
      temporizador = setInterval(bajar, 2000); // La pieza baja automaticamente cada dos segundos
    };
  }, []);

  // ####################################################
  //          Funciones para mover las piezas
  // ####################################################

  function moverDra() {
    borrarPieza(piezaActual); // borramos la estela de la pieza
    piezaActual.columna++; // hacemos que la pieza se mueva a la derecha cada vez que pulsamos
    setPiezaActual({ ...piezaActual }); // seteamos la pieza actual dentro del state pieza actual
    puntuacion += 10; // sumamos puntos por cada movimiento
    setPuntuacion(puntuacion); // seteamos la puntuacion actualizada
  }

  function moverIzq() {
    borrarPieza(piezaActual); // borramos la estela de la pieza
    piezaActual.columna--; // hacemos que la pieza se mueva a la izquierda cada vez que pulsamos
    setPiezaActual({ ...piezaActual }); // seteamos la pieza actual dentro del state pieza actual
    puntuacion += 10; // sumamos puntos por cada movimiento
    setPuntuacion(puntuacion); // seteamos la puntuacion actualizada
  }

  function bajar() {
    borrarPieza(piezaActual); // borramos la estela de la pieza
    piezaActual.fila++; // hacemos que la pieza baje cada vez que pulsamos
    setPiezaActual({ ...piezaActual }); // seteamos la pieza actual dentro del state pieza actual
    puntuacion += 10; // sumamos puntos por cada movimiento
    setPuntuacion(puntuacion); // seteamos la puntuacion actualizada
    console.log(piezaTocaSuelo(piezaActual));

    if (piezaTocaSuelo(piezaActual)) {
      puntuacion += 50;
      setPuntuacion(puntuacion);
    }
  }

  function girar() {
    borrarPieza(piezaActual); // borramos la estela de la pieza
    piezaActual.girar(); // Si pulso la tecla girar, llamo a la funcion girar de modeloPieza
    setPiezaActual({ ...piezaActual }); // seteamos la pieza actual dentro del state pieza actual
    puntuacion += 20; // sumamos puntos por cada giro
    setPuntuacion(puntuacion); // seteamos la puntuacion actualizada
  }

  useEffect(() => {
    pintarPieza(piezaActual); // pintamos pieza por cada vez que se mueve, baja o gira.
  }, [piezaActual]);

  return (
    <>
      {/* ################################################################################# */}
      {/*                   Mostramos la puntuacion de nuestra partida                      */}
      {/* ################################################################################# */}

      <div className="container text-center my-5">
        <div className="bg-opacity-50 bg-dark text-light p-3">
          {/* Mostramos la puntuacion por el div */}
          <h3>Puntuación: {puntuacion}</h3>{" "}
        </div>
      </div>

      {/* ################################################################################# */}
      {/*                   Codigo para mostrar nuestro Panel de juego                      */}
      {/* ################################################################################# */}

      {/* Panel de juego de nuestro tetris */}
      <Panel modelo={arrayCasillas} />

      {/* ················································································· */}
      {/* Codigo antiguo */}
      {/* ················································································· */}

      {/* Boton añadir partida  */}

      {/* <div className="container text-center bg-opacity-50 bg-dark text-dark my-5">
        <button className="container p-3 my-2" onClick={insertaNuevaPieza}>
          Agregar Pieza
        </button>
      </div> */}

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
    </>
  );
}
