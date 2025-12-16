import fetch from "node-fetch";

fetch("http://localhost:3000/api/live")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error("Erro:", err));