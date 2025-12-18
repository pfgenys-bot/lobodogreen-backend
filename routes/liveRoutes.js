import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ status: "live routes OK" });
});

export default router;