import React from "react";
import { useState, useContext } from "react";
import UserContext from "../Contexts/UserContext";
// import misPartidas from "../partidas.json";

export function TablaPartidas() {
  // const [arrayPartidas, setArrayPartidas] = useState(misPartidas);
  const { arrayPartidas, setArrayPartidas } = useContext(UserContext);
  const [ordenAscendente, setOrdenAscendente] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaPartida, setNuevaPartida] = useState({
    nick: "",
    puntuacion: "",
    fecha: "",
  });

  function ordenarNombre() {
    const nombresOrdenados = [...arrayPartidas].sort((a, b) => {
      return ordenAscendente
        ? a.nick.localeCompare(b.nick)
        : b.nick.localeCompare(a.nick);
    });
    setArrayPartidas(nombresOrdenados);
    setOrdenAscendente(!ordenAscendente);
  }

  function ordenarPartidas() {
    const partidasOrdenadas = [...arrayPartidas].sort((a, b) => {
      return ordenAscendente
        ? a.puntuacion - b.puntuacion
        : b.puntuacion - a.puntuacion;
    });
    setArrayPartidas(partidasOrdenadas);
    setOrdenAscendente(!ordenAscendente);
  }

  function ordenarFecha() {
    const fechasOrdenadas = [...arrayPartidas].sort((a, b) => {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      return ordenAscendente ? fechaA - fechaB : fechaB - fechaA;
    });
    setArrayPartidas(fechasOrdenadas);
    setOrdenAscendente(!ordenAscendente);
  }

  function actualizarFormularioPartida(e) {
    const { name, value } = e.target;
    setNuevaPartida({ ...nuevaPartida, [name]: value });
  }

  function agregarPartida() {
    setArrayPartidas([...arrayPartidas, nuevaPartida]);
    setNuevaPartida({ nick: "", puntuacion: "", fecha: "" });
    setModalVisible(false);
  }

  return (
    <div className="container mt-5">
      <div id="partidas" className="m-5 p-5 bg-dark">
        <h2 className="text-center text-light">Partidas</h2>

        {/* Botón para abrir el modal */}
        <button
          className="btn btn-primary mb-3"
          onClick={() => setModalVisible(true)}
        >
          Agregar Partida
        </button>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscador"
            aria-label="Buscador"
            aria-describedby="button-addon2"
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <table className="table table-dark">
          <thead>
            <tr>
              <th></th>
              <th>
                Nick{" "}
                <button onClick={ordenarNombre} className="btn btn-dark">
                  <i className="bi bi-arrow-up-square"></i>
                </button>
              </th>
              <th>
                Puntuación{" "}
                <button onClick={ordenarPartidas} className="btn btn-dark">
                  <i className="bi bi-arrow-up-square"></i>
                </button>
              </th>
              <th>
                Fecha{" "}
                <button onClick={ordenarFecha} className="btn btn-dark">
                  <i className="bi bi-arrow-up-square"></i>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {arrayPartidas.map((partida, index) => (
              <tr key={index}>
                <td></td>
                <td>{partida.nick}</td>
                <td>{partida.puntuacion}</td>
                <td>{partida.fecha}</td>
              </tr>
            ))}
          </tbody>
          <tfoot></tfoot>
        </table>
        {/* Modal para agregar nueva partida */}
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
      </div>
    </div>
  );
}
