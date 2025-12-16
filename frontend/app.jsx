const API = (window.API_URL || "http://localhost:3000") + "/api/live";

const tabs = document.querySelectorAll(".tab");
const gamesEl = document.getElementById("games");

let active = "main";

const fetchGames = async (tab) => {
  try {
    const resp = await fetch(`${API}/${tab}`);
    const data = await resp.json();
    renderGames(data.games || []);
  } catch (err) {
    gamesEl.innerHTML = `<p>Erro ao carregar: ${err.message}</p>`;
  }
};

const renderGames = (games) => {
  if (!games.length) {
    gamesEl.innerHTML = "<p>Nenhum jogo encontrado.</p>";
    return;
  }
  gamesEl.innerHTML = "";
  games.forEach(g => {
    const d = document.createElement("div");
    d.className = "card" + (g.status && g.status.toUpperCase().includes("LIVE") ? " live" : "");
    d.innerHTML = `<strong>${g.competition}</strong><br>
      ${g.timeA} <span style="font-weight:600">${g.placar}</span> ${g.timeB}<br>
      <small>${g.status} • ${new Date(g.date).toLocaleString()}</small>`;
    gamesEl.appendChild(d);
  });
};

tabs.forEach(t => t.addEventListener("click", (e) => {
  tabs.forEach(x => x.classList.remove("active"));
  e.target.classList.add("active");
  active = e.target.dataset.tab;
  fetchGames(active);
}));

// auto refresh every 30s
setInterval(() => fetchGames(active), 30000);

// initial
fetchGames(active);