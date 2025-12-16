export default function OddsTable({ odds }) {
  return (
    <table className="odds-table">
      <thead>
        <tr>
          <th>Partida</th>
          <th>Vitória</th>
          <th>Empate</th>
          <th>Derrota</th>
        </tr>
      </thead>
      <tbody>
        {odds.map((o, i) => (
          <tr key={i}>
            <td>{o.match}</td>
            <td>{o.homeWin}</td>
            <td>{o.draw}</td>
            <td>{o.awayWin}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}