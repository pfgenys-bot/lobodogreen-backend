const BASE_URL = 'http://localhost:3000/api'; // ajuste se necessário

export async function fetchLiveGames() {
  const res = await fetch(`${BASE_URL}/live`);
  return res.json();
}

export async function fetchTodayGames() {
  const res = await fetch(`${BASE_URL}/today`);
  return res.json();
}

export async function fetchGameDetail(id) {
  const res = await fetch(`${BASE_URL}/games/${id}`);
  return res.json();
}