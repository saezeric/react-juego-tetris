export function Ranking() {
  return (
    <>
      <div id="info" className="container mt-5">
        <div id="partidas" className="m-5 p-5 bg-dark">
          <h2 className="text-center text-light">Ranking</h2>
          <table className="table table-dark align-middle">
            <thead>
              <tr className="bg-dark">
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fs-2">1</td>
                <td>
                  <img src="" alt="avatar" />
                </td>
                <td>ANDER</td>
                <td>1255</td>
              </tr>
              <tr>
                <td className="fs-2">2</td>
                <td>
                  <img src="" alt="avatar" />
                </td>
                <td>ANDER</td>
                <td>1255</td>
              </tr>
              <tr>
                <td className="fs-2">3</td>
                <td>
                  <img src="" alt="avatar" />
                </td>
                <td>ANDER</td>
                <td>1255</td>
              </tr>
            </tbody>
            <tfoot></tfoot>
          </table>
        </div>
      </div>
    </>
  );
}
