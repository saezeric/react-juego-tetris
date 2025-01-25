export function colorPieza({ numero }) {
  const colores = [
    "bg-white",
    "bg-black",
    "bg-primary",
    "bg-secondary",
    "bg-success",
    "bg-danger",
    "bg-warning",
    "bg-info",
    "bg-light",
    "bg-dark",
  ];

  return colores[numero];
}
