import React, { useContext } from "react";
import UserContext from "../Contexts/UserContext";

export function Ranking() {
  const { arrayPartidas } = useContext(UserContext);

  // Creamos una copia del array de partidas y lo ordenamos de mayor a menor puntuación
  const ranking = [...arrayPartidas].sort(
    (a, b) => b.puntuacion - a.puntuacion
  );

  return (
    <div className="container mt-5">
      <div id="ranking" className="m-5 p-5 bg-dark">
        <h2 className="text-center text-light">Ranking de Mejores Jugadores</h2>
        <table className="table table-dark">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nick</th>
              <th>Puntuación</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((partida, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{partida.nick}</td>
                <td>{partida.puntuacion}</td>
                <td>{partida.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
