import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./styles/bootstrap.scss";
import "./styles/custom.scss";
import { Header } from "./Components/Header";
import { Inicio } from "./Components/Inicio";
import { TablaPartidas } from "./Components/TablaPartidas";
import { Juego } from "./Components/Juego";

export default function App() {
  return (
    <>
      <Header />
      <Inicio />
      <TablaPartidas />
      <Juego />
    </>
  );
}
