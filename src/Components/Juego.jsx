import React from "react";
import { Panel } from "./Panel";
import { modelos } from "../lib/modelos";
import { useState, useEffect, useContext } from "react";
import { nuevaPieza } from "../lib/nuevaPieza";
import UserContext from "../Contexts/UserContext";
import { Navigate } from "react-router-dom";
import { MiniMatriz } from "./MiniMatriz";

export function Juego() {
  const [arrayCasillas, setArrayCasillas] = useState(modelos.matriz); // Estado que sirve para mostrar el panel de juego
  const [piezaActual, setPiezaActual] = useState(nuevaPieza()); // Estado que instancia una nueva pieza
  const [piezaSiguiente, setPiezaSiguiente] = useState(nuevaPieza()); // Estado que instanciara la siguiente pieza que utilizaremos
  let [puntuacion, setPuntuacion] = useState(0); // Estado que define la puntuacion
  let [pararPartida, setPararPartida] = useState(false); // Estado que define si la partida ha de pararse o no
  const [partidaTerminada, setPartidaTerminada] = useState(false);
  const { arrayPartidas, setArrayPartidas } = useContext(UserContext); // Capturamos el arrayPartidas y el setArrayPartidas del UserContext
  const [redirigir, setRedirigir] = useState(false); // Estado que si es true, nos redirige a la pagina de tabla partidas para que veamos dichas partidas.
  const [tablero, setTablero] = useState(modelos.matrizClonada); // Clon de arrayCasillas
  let [colision, setColision] = useState(false);
  // Estados para el modal y para la nueva partida (usados en registraPartida)
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaPartida, setNuevaPartida] = useState({
    nick: "",
    puntuacion: "",
    fecha: "",
  });
  const [lineasEliminadas, setLineasEliminadas] = useState(0);
  const [piezaGuardada, setPiezaGuardada] = useState(null);

  function reiniciarPosicion(pieza) {
    pieza.fila = 0;
    pieza.columna = Math.floor(
      (arrayCasillas[0].length - pieza.matriz[0].length) / 2
    );
    return pieza;
  }

  function guardarPieza() {
    if (!piezaGuardada) {
      borrarPieza(piezaActual);
      setPiezaGuardada(reiniciarPosicion(piezaActual));
      setPiezaActual(piezaSiguiente);
      setPiezaSiguiente(nuevaPieza());
    } else {
      borrarPieza(piezaActual);
      const temp = reiniciarPosicion(piezaActual);
      setPiezaActual(reiniciarPosicion(piezaGuardada));
      setPiezaGuardada(temp);
    }
  }

  // ####################################################
  //     Insertar nuevas piezas a traves de un boton
  // ####################################################

  function insertaNuevaPieza() {
    const nuevoTablero = arrayCasillas.map((fila) => [...fila]);
    setTablero(nuevoTablero);
    const pieza = piezaSiguiente;
    console.log("pieza:", pieza);
    // Comprobamos si la nueva pieza colisiona inmediatamente
    // (usamos hayColision(pieza, arrayCasillas), por ejemplo)
    if (hayColision(pieza, arrayCasillas)) {
      // Si hay colisión, significa que no cabe. La partida acaba.
      console.log("No cabe la nueva pieza. Partida terminada.");
      setPararPartida(true); // Evita que se siga moviendo la pieza
      setPartidaTerminada(true); // Indica que la partida finaliza
      return;
    }
    setPiezaActual(pieza);
    setPiezaSiguiente(nuevaPieza());
    console.log("Nueva pieza actual:", piezaActual);
  }

  // ####################################################
  //       Eliminar filas de piezas rellenadas
  // ####################################################

  function eliminarLineas() {
    // Hacemos una copia de arrayCasillas
    let nuevoTablero = [];
    for (let f = 0; f < arrayCasillas.length; f++) {
      let filaCopia = [];
      for (let c = 0; c < arrayCasillas[f].length; c++) {
        filaCopia[c] = arrayCasillas[f][c];
      }
      nuevoTablero.push(filaCopia);
    }

    let lineasEliminadasEstaVez = 0;
    // Recorremos hasta la penúltima fila (ignoramos la última que actúa como "suelo")
    for (let i = 0; i < nuevoTablero.length - 1; i++) {
      // Verificamos si la fila está completa (todas las celdas != 0)
      // pero ignorando la primera (col 0) y la última (col ...length - 1) columna
      let filaCompleta = true;
      const colLen = nuevoTablero[i].length;

      // Comprobamos columnas 1..(colLen-2)
      for (let j = 1; j < colLen - 1; j++) {
        if (nuevoTablero[i][j] === 0) {
          filaCompleta = false;
          break;
        }
      }

      if (filaCompleta) {
        lineasEliminadasEstaVez++;

        // 1) Creamos una fila vacía (pero dejamos la columna 0 y colLen-1 con su valor)
        let filaVacia = [];
        for (let x = 0; x < colLen; x++) {
          // En col 0 y colLen-1 conservamos el valor que tuvieran,
          // si quieres dejarlos a 0, cambia la lógica según lo necesites
          if (x === 0 || x === colLen - 1) {
            filaVacia[x] = nuevoTablero[i][x];
          } else {
            filaVacia[x] = 0;
          }
        }

        // 2) Omitimos la fila i para "eliminarla" (estilo Tetris)
        let tableroSinFila = [];
        for (let r = 0; r < nuevoTablero.length; r++) {
          if (r !== i) {
            tableroSinFila.push(nuevoTablero[r]);
          }
        }

        // 3) Añadimos la fila vacía al principio
        let tableroConFilaNueva = [filaVacia];
        for (let r = 0; r < tableroSinFila.length; r++) {
          tableroConFilaNueva.push(tableroSinFila[r]);
        }

        // 4) Actualizamos nuevoTablero
        nuevoTablero = tableroConFilaNueva;

        // 5) Decrementamos i para volver a verificar la nueva fila
        i--;
      }
    }

    // Si se han eliminado líneas, actualizamos el tablero y sumamos puntos
    if (lineasEliminadasEstaVez > 0) {
      setArrayCasillas(nuevoTablero);
      setLineasEliminadas(lineasEliminadas + lineasEliminadasEstaVez);
      setPuntuacion(puntuacion + lineasEliminadasEstaVez * 100);
    }
  }

  // ####################################################
  //     Deteccion de colisiones en el panel de juego
  // ####################################################

  function hayColision(piezaActual, tablero) {
    const numFilas = tablero.length; // Almacenamos el numero de filas que tenemos
    const numColumnas = tablero[0].length; // Almacenamos el numero de columnas que tenemos
    const filaPosterior = piezaActual.fila + 1; // Simulamos que bajamos la pieza una unidad
    const columnaD = piezaActual.columna + 1;
    const columnaI = piezaActual.columna - 1;

    for (let i = 0; i < piezaActual.matriz.length; i++) {
      for (let j = 0; j < piezaActual.matriz[i].length; j++) {
        if (piezaActual.matriz[i][j] !== 0) {
          const fila = filaPosterior + i;
          const columnaDerecha = columnaD + j;
          const columnaIzquierda = columnaI + j;
          // Si la celda se sale del límite inferior, hay colisión
          if (fila >= numFilas) {
            return true;
          }
          if (columnaIzquierda < 0) {
            return true;
          }
          if (columnaDerecha >= numColumnas) {
            return true;
          }
          if (
            arrayCasillas[piezaActual.fila + i][piezaActual.columna + j] !==
              0 &&
            tablero[piezaActual.fila + i][piezaActual.columna + j] !== 0
          ) {
            return true;
          }
        }
      }
    }
    return false;
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

  // function piezaTocaSuelo(piezaActual) {
  //   const suelo = arrayCasillas.length - 1; // Medimos el array y restamos uno para marcar como limite el suelo
  //   return piezaActual.fila + piezaActual.matriz.length >= suelo; // devolvemos piezaActual siempre que no colisionemos con suelo
  // }

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
    if (partidaTerminada == true) {
      return;
    }
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
      if (event.key.toLowerCase() === "g") {
        guardarPieza(); // Llamamos a la función para guardar/intercambiar la pieza
      }
    }
    console.log("Se esta ejecutando el useEffect");
    window.addEventListener("keydown", controlTeclas);

    return () => {
      window.removeEventListener("keydown", controlTeclas); // Cleanup (opcional)
    };
  }, [colision, piezaActual]);

  useEffect(() => {
    let temporizador;
    if (!colision && piezaActual) {
      // Solo si hay una pieza actual activa
      temporizador = setInterval(() => {
        bajar();
      }, 2000);
    }
    return () => clearInterval(temporizador);
  }, [colision, piezaActual]); // Dependencia añadida: piezaActual

  // Efecto que detecta colision

  useEffect(() => {
    if (colision === true) {
      // Una vez fijada la pieza, se genera una nueva pieza jugable.
      insertaNuevaPieza();
      // Reiniciamos el flag de colisión.
      setColision(false);
    }
  }, [colision]);

  // ####################################################
  //          Funciones para mover las piezas
  // ####################################################

  function moverDra() {
    if (partidaTerminada == true) {
      return;
    }
    // Creamos una pieza candidata movida a la derecha
    const pActual = { ...piezaActual, columna: piezaActual.columna + 1 };
    if (hayColision(pActual, tablero) == true) {
      return;
    }
    borrarPieza(piezaActual); // borramos la estela de la pieza
    piezaActual.columna++; // hacemos que la pieza se mueva a la derecha cada vez que pulsamos
    setPiezaActual({ ...piezaActual }); // seteamos la pieza actual dentro del state pieza actual
    puntuacion += 10; // sumamos puntos por cada movimiento
    setPuntuacion(puntuacion); // seteamos la puntuacion actualizada
  }

  function moverIzq() {
    if (partidaTerminada == true) {
      return;
    }
    // Creamos una pieza candidata movida a la derecha
    const pActual = { ...piezaActual, columna: piezaActual.columna - 1 };
    if (hayColision(pActual, tablero) == true) {
      return;
    }

    borrarPieza(piezaActual); // borramos la estela de la pieza
    piezaActual.columna--; // hacemos que la pieza se mueva a la izquierda cada vez que pulsamos
    setPiezaActual({ ...piezaActual }); // seteamos la pieza actual dentro del state pieza actual
    puntuacion += 10; // sumamos puntos por cada movimiento
    setPuntuacion(puntuacion); // seteamos la puntuacion actualizada
  }

  function bajar() {
    if (partidaTerminada == true || !piezaActual) {
      return;
    }
    const pActual = { ...piezaActual, fila: piezaActual.fila + 1 };
    // Si la pieza colisiona se suma puntuacion y se creara una nueva pieza
    if (hayColision(pActual, tablero) == true) {
      console.log("Colisión detectada: la pieza se fija en el tablero");
      setColision(true);
      puntuacion += 50; // Si pieza toca el suelo sumamos 50 puntos
      setPuntuacion(puntuacion); // Seteamos el estado puntuacion
      eliminarLineas();
      return;
    }
    borrarPieza(piezaActual); // borramos la estela de la pieza
    piezaActual.fila++; // hacemos que la pieza baje cada vez que pulsamos
    setPiezaActual({ ...piezaActual }); // seteamos la pieza actual dentro del state pieza actual
    puntuacion += 10; // sumamos puntos por cada movimiento
    setPuntuacion(puntuacion); // seteamos la puntuacion actualizada
  }

  function girar() {
    if (partidaTerminada == true || !piezaActual) {
      return;
    }
    borrarPieza(piezaActual); // borramos la estela de la pieza
    // Creamos una copia candidata de la pieza y le aplicamos la rotación
    console.log("Pieza antes de girar:", piezaActual);
    piezaActual.girar(); // Si pulso la tecla girar, llamo a la funcion girar de modeloPieza
    reubicarPiezaBajar(); // Evitar atravesar suelo al girar la ficha cerca del suelo
    reubicarPiezaDerecha(); // Evitar atravesar el muro Derecho al girar la ficha
    reubicarPiezaColision();
    setPiezaActual({ ...piezaActual }); // seteamos la pieza actual dentro del state pieza actual
    puntuacion += 20; // sumamos puntos por cada giro
    setPuntuacion(puntuacion); // seteamos la puntuacion actualizada
  }

  // Funcion para reubicar pieza cuando giramos, esto evita romper el panel por debajo
  function reubicarPiezaBajar() {
    // Comprobamos si la pieza, tras girar, se sale por el fondo del tablero
    const numFilas = arrayCasillas.length - 1;
    const alturaPieza = piezaActual.matriz.length;
    const sueloPieza = piezaActual.fila + alturaPieza;
    // Si la parte inferior de la pieza excede el tablero,
    // calculamos cuántas filas se salen y ajustamos la posición vertical hacia arriba.
    if (sueloPieza > numFilas) {
      const piezaFinal = sueloPieza - numFilas;
      piezaActual.fila = piezaActual.fila - piezaFinal;
    }
  }

  function reubicarPiezaDerecha() {
    const numColumnas = arrayCasillas[0].length - 1; // Número total de columnas del tablero
    const anchoPieza = piezaActual.matriz[0].length; // Asumimos que el ancho de la pieza es la longitud de la primera fila de la matriz
    // Si la parte derecha de la pieza se sale del tablero, ajustamos la columna
    if (piezaActual.columna + anchoPieza > numColumnas) {
      piezaActual.columna = numColumnas - anchoPieza;
    }
  }

  function reubicarPiezaColision() {
    // Comprobamos si, tras el giro, existe colisión.
    if (!hayColision(piezaActual, arrayCasillas)) {
      return; // No hay colisión, salimos sin cambios
    }

    // 1) Subimos la pieza una fila
    piezaActual.fila--;
    if (!hayColision(piezaActual, arrayCasillas)) {
      return; // Ajuste satisfactorio
    }
    // Revertimos
    piezaActual.fila++;

    // 2) Subimos la pieza dos filas
    piezaActual.fila -= 2;
    if (!hayColision(piezaActual, arrayCasillas)) {
      return; // Ajuste satisfactorio
    }
    // Revertimos
    piezaActual.fila += 2;

    // 3) Movemos la pieza una columna a la izquierda
    piezaActual.columna--;
    if (!hayColision(piezaActual, arrayCasillas)) {
      return;
    }
    // Revertimos
    piezaActual.columna++;

    // 4) Movemos la pieza dos columnas a la izquierda
    piezaActual.columna -= 2;
    if (!hayColision(piezaActual, arrayCasillas)) {
      return;
    }
    // Revertimos
    piezaActual.columna += 2;

    // 5) Movemos la pieza una columna a la derecha
    piezaActual.columna++;
    if (!hayColision(piezaActual, arrayCasillas)) {
      return;
    }
    // Revertimos
    piezaActual.columna--;

    // 6) Movemos la pieza dos columnas a la derecha
    piezaActual.columna += 2;
    if (!hayColision(piezaActual, arrayCasillas)) {
      return;
    }
    // Revertimos
    piezaActual.columna -= 2;

    // 7) Subir y desplazar (subir 1 y mover 1 izquierda, etc.) si aún quieres más casos.
    // En tu caso, si la "J" sigue sin encontrar posición, puedes probar más combinaciones:
    // Por ejemplo, sube 1 y mueve 1 izquierda, sube 1 y mueve 1 derecha, etc.

    // Si todas las pruebas han fallado, la pieza se queda como estaba.
    // No se hace nada, o podrías forzarla a un estado final (partida acabada).
  }

  useEffect(() => {
    if (piezaActual) {
      pintarPieza(piezaActual); // Pintamos la pieza solo si existe
    }
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
          {partidaTerminada && (
            <h2 className="text-danger">
              ¡PARTIDA FINALIZADA! No caben más piezas.
            </h2>
          )}
          <h3>Puntuación: {puntuacion}</h3>
          <h3>Filas Eliminadas: {lineasEliminadas}</h3>

          {/* Aquí mostramos la pieza siguiente */}
          <div className="panel-lateral">
            <h3>Siguiente Pieza</h3>
            {piezaSiguiente && <MiniMatriz matriz={piezaSiguiente.matriz} />}
          </div>

          {/* Aquí mostramos la pieza guardada */}
          <div className="panel-lateral mt-3">
            <h3>Pieza Guardada</h3>
            {piezaGuardada ? (
              <MiniMatriz matriz={piezaGuardada.matriz} />
            ) : (
              <p>Ninguna pieza guardada</p>
            )}
            <p className="text-secondary">
              Pulsa <strong>G</strong> para guardar/intercambiar la pieza actual
            </p>
          </div>

          {/* Al finalizar la partida se muestra el botón para guardar */}
          {pararPartida === true && (
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
