import React from "react";
import { Panel } from "./Panel";
import { modelos } from "../lib/modelos";
import { useState, useEffect, useContext } from "react";
import { nuevaPieza } from "../lib/nuevaPieza";
import UserContext from "../Contexts/UserContext";
import { Navigate } from "react-router-dom";

export function Juego() {
  const [arrayCasillas, setArrayCasillas] = useState(modelos.matriz); // Estado que sirve para mostrar el panel de juego
  const [piezaActual, setPiezaActual] = useState(nuevaPieza()); // Estado que instancia una nueva pieza
  let [puntuacion, setPuntuacion] = useState(0); // Estado que define la puntuacion
  let [pararPartida, setPararPartida] = useState(false); // Estado que define si la partida ha de pararse o no
  const { arrayPartidas, setArrayPartidas } = useContext(UserContext); // Capturamos el arrayPartidas y el setArrayPartidas del UserContext
  const [redirigir, setRedirigir] = useState(false); // Estado que si es true, nos redirige a la pagina de tabla partidas para que veamos dichas partidas.

  // Estados para el modal y para la nueva partida (usados en registraPartida)
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaPartida, setNuevaPartida] = useState({
    nick: "",
    puntuacion: "",
    fecha: "",
  });

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

  // #########################################################
  //  Detectar cuando la pieza toca el suelo
  // #########################################################

  function piezaTocaSuelo(piezaActual) {
    const suelo = arrayCasillas.length - 1; // Medimos el array y restamos uno para marcar como limite el suelo
    return piezaActual.fila + piezaActual.matriz.length >= suelo; // devolvemos piezaActual siempre que no colisionemos con suelo
  }

  // ##########################################################
  //  Prepara la partida con la puntuación actual y la fecha,
  //   y activa el modal para que el usuario ingrese el nick
  // ##########################################################

  function registraPartida() {
    const fechaActual = new Date();
    const anio = fechaActual.getFullYear();
    const mes = ("0" + (fechaActual.getMonth() + 1)).slice(-2);
    const dia = ("0" + fechaActual.getDate()).slice(-2);
    const fechaFormateada = anio + "-" + mes + "-" + dia;

    // Preparamos la nueva partida con la puntuación obtenida y la fecha actual.
    // El campo "nick" se completará en el modal.
    setNuevaPartida({
      nick: "",
      puntuacion: puntuacion,
      fecha: fechaFormateada,
    });
    setModalVisible(true);
  }

  // ---------------------------------------------------
  // Actualiza los campos del modal al escribir
  // ---------------------------------------------------
  function actualizarFormularioPartida(e) {
    const { name, value } = e.target;
    setNuevaPartida({ ...nuevaPartida, [name]: value });
  }

  // ---------------------------------------------------
  // Guarda la partida: la agrega al array de partidas del contexto
  // ---------------------------------------------------
  function agregarPartida() {
    // Agregamos la nueva partida al array global
    setArrayPartidas([...arrayPartidas, nuevaPartida]);
    // Reiniciamos el estado del modal
    setNuevaPartida({ nick: "", puntuacion: "", fecha: "" });
    setModalVisible(false);
    setRedirigir(true); // Activa la redirección
    console.log("Nueva partida:", nuevaPartida);
    console.log("Nuestras partidas:", arrayPartidas);
  }

  // #########################################################
  //  Realizar un movimiento cada vez que se clica una tecla
  // #########################################################

  useEffect(() => {
    // L'efecte a executar
    function controlTeclas(event) {
      if (pararPartida == true) {
        return;
      }
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
    };
  }, [pararPartida]);

  // Efecto para que baje la pieza automaticamente cada 2 segundos
  useEffect(() => {
    let temporizador = setInterval(() => {
      if (!pararPartida) {
        bajar();
      }
    }, 2000);
    return () => clearInterval(temporizador);
  }, [pararPartida]);

  // ####################################################
  //          Funciones para mover las piezas
  // ####################################################

  function moverDra() {
    if (pararPartida == true) {
      return;
    }
    borrarPieza(piezaActual); // borramos la estela de la pieza
    piezaActual.columna++; // hacemos que la pieza se mueva a la derecha cada vez que pulsamos
    setPiezaActual({ ...piezaActual }); // seteamos la pieza actual dentro del state pieza actual
    puntuacion += 10; // sumamos puntos por cada movimiento
    setPuntuacion(puntuacion); // seteamos la puntuacion actualizada
  }

  function moverIzq() {
    if (pararPartida == true) {
      return;
    }
    borrarPieza(piezaActual); // borramos la estela de la pieza
    piezaActual.columna--; // hacemos que la pieza se mueva a la izquierda cada vez que pulsamos
    setPiezaActual({ ...piezaActual }); // seteamos la pieza actual dentro del state pieza actual
    puntuacion += 10; // sumamos puntos por cada movimiento
    setPuntuacion(puntuacion); // seteamos la puntuacion actualizada
  }

  function bajar() {
    if (pararPartida == true) {
      return;
    }
    borrarPieza(piezaActual); // borramos la estela de la pieza
    piezaActual.fila++; // hacemos que la pieza baje cada vez que pulsamos
    setPiezaActual({ ...piezaActual }); // seteamos la pieza actual dentro del state pieza actual
    puntuacion += 10; // sumamos puntos por cada movimiento
    setPuntuacion(puntuacion); // seteamos la puntuacion actualizada
    console.log(piezaTocaSuelo(piezaActual));

    // Si la pieza toca el suelo, realizamos las siguientes acciones

    if (piezaTocaSuelo(piezaActual)) {
      pararPartida = true; // Parar partida si la pieza toca el suelo
      setPararPartida(pararPartida); // Seteamos el estado pararPartida
      puntuacion += 50; // Si pieza toca el suelo sumamos 50 puntos
      setPuntuacion(puntuacion); // Seteamos el estado puntuacion
    }
  }

  function girar() {
    if (pararPartida == true) {
      return;
    }
    borrarPieza(piezaActual); // borramos la estela de la pieza
    piezaActual.girar(); // Si pulso la tecla girar, llamo a la funcion girar de modeloPieza
    setPiezaActual({ ...piezaActual }); // seteamos la pieza actual dentro del state pieza actual
    puntuacion += 20; // sumamos puntos por cada giro
    setPuntuacion(puntuacion); // seteamos la puntuacion actualizada
  }

  useEffect(() => {
    pintarPieza(piezaActual); // pintamos pieza por cada vez que se mueve, baja o gira.
  }, [piezaActual]);

  // Si se activa la redirección, usamos Navigate para dirigir a "/partidas"
  if (redirigir) {
    return <Navigate to="/partidas" />;
  }

  return (
    <>
      {/* ################################################################################# */}
      {/*                   Mostramos la puntuacion de nuestra partida                      */}
      {/* ################################################################################# */}

      <div className="container text-center my-5">
        <div className="bg-opacity-50 bg-dark text-light p-3">
          {pararPartida === true && (
            <h2 className="text-success">PARTIDA FINALIZADA</h2>
          )}
          <h3>Puntuación: {puntuacion}</h3>
          {/* Al finalizar la partida se muestra el botón para guardar */}
          {pararPartida === true && (
            // Mostramos el boton del modal para guardar la partida
            <button className="btn btn-primary" onClick={registraPartida}>
              Guardar Partida
            </button>
          )}
        </div>
      </div>

      {/* ################################################################################# */}
      {/*                   Codigo para mostrar nuestro Panel de juego                      */}
      {/* ################################################################################# */}

      {/* Panel de juego de nuestro tetris */}
      <Panel modelo={arrayCasillas} />

      {/* Modal para ingresar el nick y guardar la partida */}
      {modalVisible && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Nueva Partida</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="nick" className="form-label">
                      Nick
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nick"
                      name="nick"
                      value={nuevaPartida.nick}
                      onChange={actualizarFormularioPartida}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="puntuacion" className="form-label">
                      Puntuación
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="puntuacion"
                      name="puntuacion"
                      value={nuevaPartida.puntuacion}
                      onChange={actualizarFormularioPartida}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="fecha" className="form-label">
                      Fecha
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="fecha"
                      name="fecha"
                      value={nuevaPartida.fecha}
                      onChange={actualizarFormularioPartida}
                      readOnly
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalVisible(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={agregarPartida}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
