// backend/server.js
import app from "./app.js";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 API do DODÔ rodando em http://localhost:${PORT}`);
});