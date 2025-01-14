export function Inicio() {
  return (
    <>
      <section className="container mt-5 bg-opacity-50 bg-dark p-2 text-light">
        <div id="intro" className="text-center p-5">
          <p>
            Tetris és un videojoc de tipus trencaclosques. Fou inventat per
            l'enginyer informàtic rus Aleksei Pàjitnov l'any 1984,[1] mentre
            treballava a l'Acadèmia de Ciències de Moscou.
          </p>
          <h2>Instruccions:</h2>
          <p>Pots moure les peces fent servir les fletxes d'esquerra i dreta</p>
          <p>Amb la fletxa avall pots girar la peça</p>
          <p>
            '<strong>Ñ</strong>' per canviar la peça actual per la peça que està
            a punt de sortir (que pots veure a la columna de la dreta)
          </p>
          <p>
            Al final de la partida podràs desar la teva puntuació, i verue el
            ranking de jugadors
          </p>
          <button className="btn btn-success fs-1 mt-5">JUGAR</button>
        </div>
      </section>
    </>
  );
}
