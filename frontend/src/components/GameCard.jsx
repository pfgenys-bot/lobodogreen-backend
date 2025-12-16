import { useState } from "react";

export default function GameCard({ game }) {
  const [stake, setStake] = useState("");
  const markets = game.odds ? Object.entries(game.odds).sort((a,b)=>b[1]-a[1]) : [];

  // calcular retorno para uma odd
  function calcReturn(odd) {
    const v = parseFloat(stake);
    if (!v || !odd) return "-";
    return (v * odd).toFixed(2);
  }

  return (
    <div className="card">
      <div className="left">
        <div className="teams">{game.home} <span className="vs">vs</span> {game.away}</div>
        <div className="meta">{game.league} • {new Date(game.date || "").toLocaleString()}</div>
      </div>

      <div className="center">
        <div className="percent">{game.percent ? `${game.percent}%` : "—"}</div>
        {markets.length > 0 ? (
          <div className="markets">
            {markets.map(([k,v]) => (
              <div className="market" key={k}>
                <div className="mname">{k.replace(/_/g," ").toUpperCase()}</div>
                <div className="mval">{v}</div>
              </div>
            ))}
          </div>
        ) : <div className="nomarkets">Sem odds manuais</div>}
      </div>

      <div className="right">
        <input value={stake} onChange={e=>setStake(e.target.value)} placeholder="R$ stake" />
        {markets[0] ? (
          <div className="return">Retorno: R$ {calcReturn(markets[0][1])}</div>
        ) : <div className="return">—</div>}
      </div>
    </div>
  );
}