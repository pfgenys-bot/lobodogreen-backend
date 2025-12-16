import axios from "axios";

const MP_TOKEN = process.env.MP_ACCESS_TOKEN;

export async function createPreference(items = [], external_reference = "") {
  const url = "https://api.mercadopago.com/checkout/preferences";

  const res = await axios.post(
    url,
    {
      items,
      external_reference
    },
    {
      headers: {
        Authorization: `Bearer ${MP_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

  return res.data;
}