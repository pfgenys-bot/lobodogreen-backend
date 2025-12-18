import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.post("/mercadopago", express.json(), async (req,res) => {
  // verify (ipn/notification). For simplicity we trust MP (production: verify signature)
  const { body } = req;
  // Example: body.type, body.data.id -> call MP API to fetch payment
  // Fetch payment details and update purchases table
  // If payment approved: grant entitlements to user
  res.status(200).send("ok");
});

export default router;