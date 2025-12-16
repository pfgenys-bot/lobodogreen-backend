// ORDENA POR % (99 → 60)
jogos.sort((a, b) => {
  const pa = calcularOddPercentual(a);
  const pb = calcularOddPercentual(b);
  return pb - pa;
});

// MONTA A TABELA
jogos.forEach(jogo => {
  const chance = calcularOddPercentual(jogo);

  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${jogo.home ?? "-"}</td>
    <td>${jogo.away ?? "-"}</td>
    <td>${jogo.score ?? "—"}</td>
    <td>${jogo.league ?? "-"}</td>
    <td><strong>${chance}%</strong></td>
  `;

  tabela.appendChild(row);
});