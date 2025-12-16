import { useEffect, useState } from "react";
import GameCard from "./components/GameCard.jsx";

const API = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export default function App() {
  const [tab, setTab] = useState("pro"); // pro | free | today | week
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("percent_desc");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/games?mode=${tab}&sort=${sort}`);
      const data = await res.json();
      setGames(data);
    } catch (err) {
      console.error("load err", err);
      setGames([]);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, [tab, sort]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="logoCircle"><img src="/logo.png" alt="Lobo" /></div>
          <div className="title">LOBO DO GREEN — A SORTE OBEDECE QUEM TEM VISÃO</div>
        </div>
        <div className="actions">
          <button onClick={() => load()} className="btn">🔄 Atualizar</button>
        </div>
      </header>

      <nav className="tabs">
        <button className={tab==="pro"?"active":""} onClick={()=>setTab("pro")}>PRO (%)</button>
        <button className={tab==="free"?"active":""} onClick={()=>setTab("free")}>SEM % (livre)</button>
        <button className={tab==="today"?"active":""} onClick={()=>setTab("today")}>HOJE</button>
        <button className={tab==="week"?"active":""} onClick={()=>setTab("week")}>SEMANA</button>
        <select value={sort} onChange={e=>setSort(e.target.value)} className="selectSort">
          <option value="percent_desc">Ordenar: % decrescente</option>
          <option value="odd_desc">Ordenar: odd (maior)</option>
        </select>
      </nav>

      <main className="content">
        {loading ? <div className="loading">Carregando jogos…</div> :
          games.length === 0 ? <div className="empty">Nenhum jogo encontrado.</div> :
          games.map((g,i) => <GameCard key={i} game={g} />)
        }
      </main>

    </div>
  );
}