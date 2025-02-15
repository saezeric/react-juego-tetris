import React from "react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="d-flex flex-column align-items-center justify-content-center">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/">
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/partidas">
                  Partidas
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/juego">
                  Juego
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/ranking">
                  Ranking
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div>
        <img
          src="/logo.png"
          alt="logo"
          width="160"
          className="d-block mx-auto"
        />
      </div>
    </header>
  );
}
