export default async function mpWebhook(req, res) {
  try {
    console.log("📩 Webhook Mercado Pago recebido");

    // Aqui você pode validar assinatura depois
    // Por enquanto apenas responde 200 para o MP não reenviar

    res.sendStatus(200);
  } catch (error) {
    console.error("Erro no webhook Mercado Pago:", error);
    res.sendStatus(500);
  }
}