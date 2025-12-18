import app from "./app.js";

console.log("🚀 SERVER.JS INICIADO");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ ESCUTANDO NA PORTA ${PORT}`);
});