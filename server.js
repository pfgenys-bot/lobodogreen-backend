import app from "./app.js";

console.log("🚀 SERVER.JS INICIADO");

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 API rodando em http://0.0.0.0:${PORT}`);
});