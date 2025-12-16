// ===============================
// CONFIGURAÇÃO DA API
// ===============================
const API = "http://localhost:3000";

// ===============================
// ESTADO GLOBAL
// ===============================
let jogosCache = [];
let abaAtiva = "semana";

// ===============================
// UTILIDADES
// ===============================
function chanceAleatoria(min = 60, max = 90) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chanceParaOdd(chance) {
  return (100 / chance).toFixed(2);
}

// ===============================
// SIMULAÇÃO DE MERCADOS
// ===============================
function gerarMercados() {
  const over = chanceAleatoria(65, 85);
  const btts = chanceAleatoria(60, 80);
  const casa = chanceAleatoria(40, 60);
  const empate = chanceAleatoria(20, 30);
  const fora = chanceAleatoria(30, 50);

  return {
    over25: {
      chance: over,
      odd: chanceParaOdd(over)
    },
    btts: {
      chance: btts,
      odd: chanceParaOdd(btts)
    },
    resultado: {
      casa: { chance: casa, odd: chanceParaOdd(casa) },
      empate: { chance: empate, odd: chanceParaOdd(empate) },
      fora: { chance: fora, odd: chanceParaOdd(fora) }
    }
  };
}

function ordenarPorChance(lista) {
  return lista.sort((a, b) => b.over25.chance - a.over25.chance);
}

// ===============================
// RENDERIZAÇÃO
// ===============================
function renderizarJogos(jogos) {
  const container = document.getElementById("lista-jogos");
  if (!container) return;

  container.innerHTML = "";

  jogos.forEach(jogo => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="info">
        <div class="teams">${jogo.home} x ${jogo.away}</div>
        <div class="league">${jogo.league}</div>

        <div class="source">
          ⚽ Over 2.5: ${jogo.over25.chance}% (Odd ${jogo.over25.odd})
        </div>

        <div class="source">
          ⚽ Ambas Marcam: ${jogo.btts.chance}% (Odd ${jogo.btts.odd})
        </div>

        <div class="source">
          🏆 Casa ${jogo.resultado.casa.odd} |
          🤝 Empate ${jogo.resultado.empate.odd} |
          🚩 Fora ${jogo.resultado.fora.odd}
        </div>
      </div>

      <div class="right">
        <div class="score">${jogo.score}</div>
      </div>
    `;

    container.appendChild(card);
  });
}

// ===============================
// FUNÇÃO PRINCIPAL
// ===============================
async function carregarJogos() {
  const container = document.getElementById("lista-jogos");
  if (container) container.innerHTML = "<p>Carregando jogos...</p>";

  try {
    const res = await fetch(`${API}/api/games`);
    const jogos = await res.json();

    jogosCache = jogos.map(jogo => {
      const mercados = gerarMercados();
      return {
        ...jogo,
        ...mercados
      };
    });

    renderizarJogos(ordenarPorChance(jogosCache));

  } catch (e) {
    console.error(e);
    if (container) container.innerHTML = "<p>Erro ao carregar</p>";
  }
}

// ===============================
// EVENTOS
// ===============================
document.getElementById("btn-atualizar")
  ?.addEventListener("click", carregarJogos);

// ===============================
// INIT
// ===============================
carregarJogos();