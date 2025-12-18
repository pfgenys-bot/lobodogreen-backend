import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ alive: true });
});

export default router;