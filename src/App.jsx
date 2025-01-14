import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./styles/bootstrap.scss";
import "./styles/custom.scss";
import { TablaPartidas } from "./Components/TablaPartidas";
import { Header } from "./Components/Header";

export default function App() {
  return (
    <>
      <Header />
      <TablaPartidas />
    </>
  );
}
