import React, { useState } from "react";
import UserContext from "./UserContext";
import misPartidas from "../partidas.json";

const UserProvider = ({ children }) => {
  // Declaración de estados globales
  const [arrayPartidas, setArrayPartidas] = useState(misPartidas);

  return (
    // Proveedor que pasa los estados y funciones a través de `value`
    <UserContext.Provider value={{ arrayPartidas, setArrayPartidas }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
