// controllers/paymentsController.js

import { createPreference } from "../services/payments/createPreference.js";

export async function createPayment(req, res) {
  try {
    const preference = await createPreference(
      [
        {
          title: "Plano Odds Futebol",
          quantity: 1,
          currency_id: "BRL",
          unit_price: 29.9
        }
      ],
      "ORDER_" + Date.now()
    );

    return res.json({
      status: "ok",
      init_point: preference.init_point
    });
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    return res.status(500).json({ error: "Erro ao criar pagamento" });
  }
}

export async function getPayments(req, res) {
  return res.json({
    payments: [],
    message: "Lista de pagamentos (mock)"
  });
}