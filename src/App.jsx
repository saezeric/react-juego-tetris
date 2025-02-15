import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/bootstrap.scss";
import "./styles/custom.scss";
import { Header } from "./Components/Header";
import { Inicio } from "./Components/Inicio";
import { TablaPartidas } from "./Components/TablaPartidas";
import { Juego } from "./Components/Juego";
import { Ranking } from "./Components/Ranking";

export default function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="partidas" element={<TablaPartidas />} />
          <Route path="juego" element={<Juego />} />
          <Route path="ranking" element={<Ranking />} />
        </Routes>
      </Router>
    </>
  );
}
