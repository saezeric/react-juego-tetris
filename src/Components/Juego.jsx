import React from "react";
import { Panel } from "./Panel";
import { modelos } from "../lib/modelos";
import { useState, useEffect, useContext } from "react";
import { nuevaPieza } from "../lib/nuevaPieza";
import UserContext from "../Contexts/UserContext";
import { Navigate } from "react-router-dom";
import { MiniMatriz } from "./MiniMatriz";
import { modeloPieza } from "../lib/modeloPieza";

export function Juego() {
  const [arrayCasillas, setArrayCasillas] = useState(modelos.matriz); // Estado que sirve para mostrar el panel de juego
  const [piezaActual, setPiezaActual] = useState(nuevaPieza()); // Estado que instancia una nueva pieza
  const [piezaSiguiente, setPiezaSiguiente] = useState(nuevaPieza()); // Estado que instanciara la siguiente pieza que utilizaremos
  let [puntuacion, setPuntuacion] = useState(0); // Estado que define la puntuacion
  let [pararPartida, setPararPartida] = useState(false); // Estado que define si la partida ha de pararse o no
  const [partidaTerminada, setPartidaTerminada] = useState(false); // Estado que setea el final de la partida cuando las piezas llegan al principio del panel
  const { arrayPartidas, setArrayPartidas } = useContext(UserContext); // Capturamos el arrayPartidas y el setArrayPartidas del UserContext
  const [redirigir, setRedirigir] = useState(false); // Estado que si es true, nos redirige a la pagina de tabla partidas para que veamos dichas partidas.
  const [tablero, setTablero] = useState(modelos.matrizClonada); // Clon de arrayCasillas
  let [colision, setColision] = useState(false); // Estado que identifica si existe colision o no
  // Estados para el modal y para la nueva partida (usados en registraPartida)
  const [modalVisible, setModalVisible] = useState(false); // Estado que setea la visibilidad del modal
  // Estado que facilita los campos vacios para nuestro modal, este permite guardar datos en TablaPartidas, concretamente una nueva partida
  const [nuevaPartida, setNuevaPartida] = useState({
    nick: "",
    puntuacion: "",
    fecha: "",
  });
  const [lineasEliminadas, setLineasEliminadas] = useState(0); // Estado que elimina las lineas ya completadas dentro del panel de juego
  const [piezaGuardada, setPiezaGuardada] = useState(null); // Estado que guarda una pieza cuando pulsamos un boton, concretamente la letra "G"
  const [nivel, setNivel] = useState(1); // Estado para setear el nivel de la partida, el nivel incrementara por cada 5 lineas eliminadas
  const [velocidad, setVelocidad] = useState(2000); // Estado que setea la velocidad de la pieza en partida, comenzaremos con 2 segundos

  // Funcion que reinicia la posicion al inicio del panel para nuestra pieza cada vez que utilizamos la funcion guardar pieza.
  function reiniciarPosicion(pieza) {
    pieza.fila = 0; // Indicamos la fila donde queremos que aparezca la pieza
    // Indicamos una columna aleatoria donde queremos que aparezca nuestra pieza
    pieza.columna = Math.floor(
      (arrayCasillas[0].length - pieza.matriz[0].length) / 2
    ); // Se realiza un calculo en el cual se resta el ancho de array casillas por el ancho de nuestra pieza
    return pieza; // Devolvemos pieza
  }

  // Funcion que almacena una pieza cuando pulsamos un boton, concretamente la letra G
  function guardarPieza() {
    // Condicional que verifica si pieza guardada existe o no
    if (!piezaGuardada) {
      borrarPieza(piezaActual); // Funcion que borrara todo rastro de nuestra pieza pintada por panel
      setPiezaGuardada(reiniciarPosicion(piezaActual)); // Estado que setea la nueva pieza guardada con la posicion reiniciada
      setPiezaActual(piezaSiguiente); // Estado que setea la nueva pieza actual con un estado llamado pieza siguiente
      setPiezaSiguiente(nuevaPieza()); // Estado que setea la nueva pieza siguiente gracias a la funcion nuevaPieza
    } else {
      borrarPieza(piezaActual); // Funcion que borrara todo rastro de nuestra pieza pintada por panel
      const temp = reiniciarPosicion(piezaActual); // Variable que almacena temporalmente la pieza actual con la posicion reiniciada
      setPiezaActual(reiniciarPosicion(piezaGuardada)); // Estado que setea la nueva pieza actual con un estado llamado pieza siguiente
      setPiezaGuardada(temp); // Estado que setea la nueva pieza guardada gracias a la constante temporal que creamos antes
    }
  }
  // ####################################################
  //     Insertar nuevas piezas a traves de un boton
  // ####################################################

  // Funcion que inserta una nueva pieza por pantalla cada vez que la anterior pieza colisiona
  function insertaNuevaPieza() {
    const nuevoTablero = arrayCasillas.map((fila) => [...fila]); // Constante que clona todas las filas del tablero actual
    setTablero(nuevoTablero); // Estado que setea un tablero completamente clonado
    const pieza = piezaSiguiente; // Constante que almacena como pieza la pieza que aparecia como siguiente en nuestro juego
    // Condiconal que comprueba si existe colision con nuestra ficha, en caso de existir una colision, detiene la partida por completo
    if (hayColision(pieza, arrayCasillas)) {
      // Si hay colisión, significa que no cabe. La partida acaba.
      console.log("No cabe la nueva pieza. Partida terminada.");
      setPararPartida(true); // Evita que se siga moviendo la pieza
      setPartidaTerminada(true); // Indica que la partida finaliza
      return; // Devuelve nada deteniendo cualquier evento
    }
    setPiezaActual(pieza); // Estado que setea la pieza actual
    setPiezaSiguiente(nuevaPieza()); // Estado que setea la siguiente pieza
  }

  // ####################################################
  //       Eliminar filas de piezas rellenadas
  // ####################################################

  // Funcion que elimina las lineas que se han completado de nuestro tablero
  function eliminarLineas() {
    // Hacemos una copia de arrayCasillas
    let nuevoTablero = [];
    // Bucle for que seteara todas las casillas de cada fila de mi tablero buscando tener el tablero completo copiado
    for (let f = 0; f < arrayCasillas.length; f++) {
      // Variable que almacena la copia de todas las filas
      let filaCopia = [];
      // Bucle for que se encarga de hacer push de todas las celdas dentro de nuestro array nuevoTablero
      for (let c = 0; c < arrayCasillas[f].length; c++) {
        // Fila copia [c] sera igual a cada una de las casillas que se recorran de la fila de arrayCasillas
        filaCopia[c] = arrayCasillas[f][c];
      }
      // Pusheamos todo a nuestro nuevo tablero
      nuevoTablero.push(filaCopia);
    }

    // Variable que detecta cuantas lineas se han eliminado a la vez al accionar la funcion
    let lineasEliminadasEstaVez = 0;

    // Recorremos hasta la penúltima fila (ignoramos la última que actúa como "suelo")
    for (let i = 0; i < nuevoTablero.length - 1; i++) {
      let filaCompleta = true; // Variable que se alamcena como true para verificar si la fila esta completa
      const colLen = nuevoTablero[i].length; // Constante que almacena la longitud del ancho del nuevo tablero
      // For que comprueba cada fila y celda de nuestro tablero, para detectar si hay alguna fila completamente pintada
      for (let j = 1; j < colLen - 1; j++) {
        // Condicional que verifica si la celda en la que nos encontramos es una celda vacia
        if (nuevoTablero[i][j] === 0) {
          filaCompleta = false; // Si la celda esta vacia, se almacena en filaCompleta un valor falso y se para el bucle por completo
          break;
        }
      }

      // Condicional que se acciona si fila completa es true
      if (filaCompleta) {
        // Contador que suma cuantas lineas se han eliminado esta vez
        lineasEliminadasEstaVez++; // Inicialmente eliminamos una fila ya que se ha cumplido la condicion de fila completa

        let filaVacia = []; // Creamos una fila vacia que utilizaremos para añadir arriba del todo del array
        // Bucle for que busca copiar una fila vacia de nuestra celda por completo
        for (let x = 0; x < colLen; x++) {
          // Condicional que copiara tanto las celdas de nuestro muro como las celdas vacias
          if (x === 0 || x === colLen - 1) {
            filaVacia[x] = nuevoTablero[i][x]; // Condicional que copia una celda de nuestro muro
          } else {
            filaVacia[x] = 0; // Condicional que copia una celda vacia
          }
        }

        // Creamos una variable para eliminar la fila pintada
        let tableroSinFila = [];
        // Bucle for que pusheara celda por celda a un array para filas eliminadas
        for (let r = 0; r < nuevoTablero.length; r++) {
          // Condicional que detecta en que fila hemos eliminado contenido
          if (r !== i) {
            tableroSinFila.push(nuevoTablero[r]); // Pusheamos cada celda en la variable
          }
        }

        // Array que añade una nueva fila
        let tableroConFilaNueva = [filaVacia];
        // Bucle for que recorre toda la fila y añade una nueva fila vacia
        for (let r = 0; r < tableroSinFila.length; r++) {
          // Pusheamos celda por celda
          tableroConFilaNueva.push(tableroSinFila[r]);
        }

        // Actualizamos el tablero con nuevo tablero
        nuevoTablero = tableroConFilaNueva;

        // Hacemos un decremento de i para verificar otra nueva fila desde 0
        i--;
      }
    }

    // Si se han eliminado líneas, actualizamos el tablero y sumamos puntos
    if (lineasEliminadasEstaVez > 0) {
      setArrayCasillas(nuevoTablero); // Seteamos el nuevo tablero en el array casillas
      setLineasEliminadas((prevLineas) => prevLineas + lineasEliminadasEstaVez); // Sumamos a las lines previas las lineas que hemos eliminado
      // Seteamos la nueva puntuacion
      setPuntuacion(
        (prevPuntuacion) => prevPuntuacion + lineasEliminadasEstaVez * 100
      ); // Seteamos la nueva puntuacion sumandola con la putuacion previa y multiplicandola por 100

      // Verificar si se han eliminado 5, 10, 15, 20... filas, la division dará 0 por lo que se incrementara el nivel
      if ((lineasEliminadas + lineasEliminadasEstaVez) % 5 === 0) {
        setNivel((prevNivel) => prevNivel + 1); // Seteamos el nuevo nivel mas el nivel anterior
        // Seteamos el nuevo estado de velocidad para nuestro juego
        setVelocidad((prevVelocidad) => {
          // Constante que almacenara la nueva velocidad restandola con la velocidad que teniamos anteriromente menos 200milisegundos menos
          const nuevaVelocidad = Math.max(200, prevVelocidad - 200); // Aumentar velocidad (mínimo 200ms)
          // Console.log que indica en que nivel estamos y a que velocidad vamos
          console.log(
            `Nivel aumentado a ${
              nivel + 1
            }. Nueva velocidad: ${nuevaVelocidad}ms`
          ); // Verificar la velocidad
          return nuevaVelocidad; // Devolvemos la nueva velocidad
        });
      }
    }
  }
  // ####################################################
  //     Deteccion de colisiones en el panel de juego
  // ####################################################
  function hayColision(piezaActual, tablero) {
    const numFilas = tablero.length; // Almacenamos el numero de filas que tenemos
    const numColumnas = tablero[0].length; // Almacenamos el numero de columnas que tenemos
    const filaPosterior = piezaActual.fila + 1; // Simulamos que bajamos la pieza una unidad
    const columnaD = piezaActual.columna + 1; // Constante que simulara la columna de la derecha
    const columnaI = piezaActual.columna - 1; // Constante que simulara la columna de la izquierda

    // Bucle que detectara si existe colision con nuestra pieza en cualquiera de los muros o en el suelo
    for (let i = 0; i < piezaActual.matriz.length; i++) {
      for (let j = 0; j < piezaActual.matriz[i].length; j++) {
        if (piezaActual.matriz[i][j] !== 0) {
          // Esta constante detecta si al realizar un siguiente movimiento bajar, la pieza colisionara o no, en caso de hacerlo colisiona y se para
          const fila = filaPosterior + i; // Constante que suma la simulacion de filaPosterior mas la altura de nuestra pieza
          const columnaDerecha = columnaD + j; // Constante que suma la simulacion de nuestra columna derecha con el ancho de nuestra pieza
          const columnaIzquierda = columnaI + j; // Constante que suma la simulacion de nuestra columna izquierda con el ancho de nuestra pieza
          // Si la celda se sale del límite inferior, hay colisión
          if (fila >= numFilas) {
            return true; // Si la fila donde se encontraria pieza al bajar es la misma o mayor a la fila donde se encuentra el suelo, activamos la colision
          }
          if (columnaIzquierda < 0) {
            return true; // Si la pieza toca la pared de la izquierda, se activa el evento de colision
          }
          if (columnaDerecha >= numColumnas) {
            return true; // Si la pieza toca la pared de la derecha, se activa el evento de colision
          }
          if (
            arrayCasillas[piezaActual.fila + i][piezaActual.columna + j] !==
              0 &&
            tablero[piezaActual.fila + i][piezaActual.columna + j] !== 0
          ) {
            return true; // Este condicional compara el tablero antiguo y el nuevo para no activar el evento colision al hacer aparecer una pieza por pantalla
          }
        }
      }
    }
    return false; // Se devuelve false en caso de que no se detecte ninguna colision
  }

  // #############################################################
  //    Imprimimos la matriz de nuestra ficha dentro del panel
  // #############################################################

  // Constante que pintara la nueva pieza por pantalla cada vez que se realice cualquier acción
  const pintarPieza = (piezaActual) => {
    // constante que almacena la nueva matriz del panel y que actualizara el panel con la nueva pieza
    const nuevaMatriz = [...arrayCasillas];

    // console.log(piezaActual.columna);
    // Recorremos la matriz de pieza actual y pintamos la nueva matriz en la zona que toca
    piezaActual.matriz.forEach((fila, indexFila) => {
      fila.forEach((celda, indexColumna) => {
        // Condicional que pintara unicamente las celdas que tengan color de nuestra pieza
        if (celda !== 0) {
          nuevaMatriz[piezaActual.fila + indexFila][
            piezaActual.columna + indexColumna
          ] = celda; // Nuestra nueva matriz será igual a la celda pintada en la que nos encontremos
        }
      });
    });
    //console.log("piezaActual.matriz:", piezaActual.matriz);
    // Seteamos el tablero nuevo con la pieza pintada
    setArrayCasillas(nuevaMatriz);
  };

  // ##################################################################################
  //    Si piezaActual se mueve o se gira, se elimina la estela que deja tras de si
  // ##################################################################################

  // Funcion que borra el rastro de nuestra pieza cuando esta se mueve, gira o es guardada
  function borrarPieza(piezaActual) {
    const nuevaMatriz = [...arrayCasillas]; // Copiamos la matriz del tablero

    // Recorremos la matriz de la pieza
    piezaActual.matriz.forEach((fila, indexFila) => {
      // Recorremos cada fila de la pieza, celda por celda
      fila.forEach((celda, indexColumna) => {
        // Si la celda no esta vacia daremos como valor a nuestra matriz una celda en blanco
        if (celda !== 0) {
          // La celda en la que nos encontramos sera igual a una celda vacia
          nuevaMatriz[piezaActual.fila + indexFila][
            piezaActual.columna + indexColumna
          ] = 0;
        }
      });
    });

    // Actualizamos el estado del tablero
    setArrayCasillas(nuevaMatriz);
  }

  // #########################################################
  //  Detectar cuando la pieza toca el suelo
  // #########################################################

  // Antigua funcion que detectaba si la pieza tocaba el suelo para mostrar un mensaje de se ha terminado la partida de forma temporal
  // function piezaTocaSuelo(piezaActual) {
  //   const suelo = arrayCasillas.length - 1; // Medimos el array y restamos uno para marcar como limite el suelo
  //   return piezaActual.fila + piezaActual.matriz.length >= suelo; // devolvemos piezaActual siempre que no colisionemos con suelo
  // }

  // ##########################################################
  //  Prepara la partida con la puntuación actual y la fecha,
  //   y activa el modal para que el usuario ingrese el nick
  // ##########################################################

  // Funcion que registrara una nueva partida dentro de nuestro TablaPartidas a traves de nuestro panel de juego
  function registraPartida() {
    const fechaActual = new Date(); // Constante que almacena la fecha actual de hoy
    const anio = fechaActual.getFullYear(); // Constante que almacena el año en el que estamos
    const mes = ("0" + (fechaActual.getMonth() + 1)).slice(-2); // Constante que almacena y concatena un 0 delante de nuestro numero de mes en caso de ser un mes de menos de dos digitos
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
    if (partidaTerminada == true || !piezaActual) {
      return;
    }
    // L'efecte a executar
    function controlTeclas(event) {
      event.preventDefault();
      if (event.key === "ArrowUp") {
        girar();
        event.preventDefault();
      }
      if (event.key === "ArrowDown") {
        bajar();
        event.preventDefault();
      }
      if (event.key === "ArrowRight") {
        moverDra();
        event.preventDefault();
      }
      if (event.key === "ArrowLeft") {
        moverIzq();
        event.preventDefault();
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

  // Efecto para que baje la pieza automaticamente cada 2 segundos
  useEffect(() => {
    let temporizador;
    if (!colision && piezaActual) {
      temporizador = setInterval(() => {
        bajar();
        console.log(velocidad);
      }, velocidad); // Usar la velocidad actual
    }
    return () => clearInterval(temporizador);
  }, [colision, piezaActual, velocidad]); // Añadir velocidad como dependencia

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
    if (partidaTerminada == true || !piezaActual) {
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
    if (partidaTerminada == true || !piezaActual) {
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
    const nuevaPiezaRotada = new modeloPieza({
      numero: piezaActual.numero,
      nombre: piezaActual.nombre,
      angulo: piezaActual.angulo,
      fila: piezaActual.fila,
      columna: piezaActual.columna,
    });
    // Creamos una copia candidata de la pieza y le aplicamos la rotación
    console.log("Pieza antes de girar:", piezaActual);
    nuevaPiezaRotada.girar(); // Si pulso la tecla girar, llamo a la funcion girar de modeloPieza
    reubicarPiezaBajar(nuevaPiezaRotada); // Evitar atravesar suelo al girar la ficha cerca del suelo
    reubicarPiezaDerecha(nuevaPiezaRotada); // Evitar atravesar el muro Derecho al girar la ficha
    reubicarPiezaColision(nuevaPiezaRotada);
    setPiezaActual(nuevaPiezaRotada); // seteamos la pieza actual dentro del state pieza actual
    puntuacion += 20; // sumamos puntos por cada giro
    setPuntuacion(puntuacion); // seteamos la puntuacion actualizada
  }

  // Funcion para reubicar pieza cuando giramos, esto evita romper el panel por debajo
  function reubicarPiezaBajar(piezaActual) {
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

  function reubicarPiezaDerecha(piezaActual) {
    const numColumnas = arrayCasillas[0].length - 1; // Número total de columnas del tablero
    const anchoPieza = piezaActual.matriz[0].length; // Asumimos que el ancho de la pieza es la longitud de la primera fila de la matriz
    // Si la parte derecha de la pieza se sale del tablero, ajustamos la columna
    if (piezaActual.columna + anchoPieza > numColumnas) {
      piezaActual.columna = numColumnas - anchoPieza;
    }
  }

  function reubicarPiezaColision(piezaActual) {
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
          <h3>Nivel: {nivel}</h3>

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
