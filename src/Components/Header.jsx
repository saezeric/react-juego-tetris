import React from "react";

export function Header() {
  return (
    <header className="d-flex flex-column align-items-center justify-content-center">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top w-100">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <a className="nav-link text-white" href="/">
                  Inicio
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="partidas">
                  Partidas
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="juego">
                  Juego
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="ranking">
                  Ranking
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="mt-5 pt-5">
        <img
          src="/logo.png"
          alt="logo"
          width="200"
          className="d-block mx-auto"
        />
      </div>
    </header>
  );
}
