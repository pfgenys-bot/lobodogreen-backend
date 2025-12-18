import MercadoPago from "mercadopago";

const mercadopago = new MercadoPago({
  accessToken: process.env.MP_ACCESS_TOKEN
});

export default mercadopago;