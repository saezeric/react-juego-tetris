import { useState } from "react";
import misPartidas from "../partidas.json";

export function TablaPartidas() {
  const partidas = misPartidas;
  const [arrayPartidas, setArrayPartidas] = useState(misPartidas);

  const [ordenAscendente, setOrdenAscendente] = useState(false);

  function ordenarPartidas() {
    const partidasOrdenadas = [...arrayPartidas].sort((a, b) => {
      return ordenAscendente
        ? a.puntuacion - b.puntuacion
        : b.puntuacion - a.puntuacion;
    });
    setArrayPartidas(partidasOrdenadas);
    setOrdenAscendente(!ordenAscendente);
  }

  return (
    <div id="partidas" className="m-5 p-5 bg-dark">
      <h2 className="text-center text-light">Partidas</h2>
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
              <button onClick={ordenarPartidas} className="btn btn-dark">
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
              <button onClick={ordenarPartidas} className="btn btn-dark">
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
    </div>
  );
}
