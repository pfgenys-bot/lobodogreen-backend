import express from "express";
import { authRequired } from "../services/auth/authMiddleware.js";
import { signLink, verifyLink } from "../services/security/linkSigner.js";
import { db } from "../db.js";

const router = express.Router();

/**
 * POST /api/protected/generate
 * body: { gameId, provider }
 */
router.post("/generate", authRequired, (req, res) => {
  try {
    const { gameId, provider } = req.body;
    const userId = req.user.uid;

    if (!gameId || !provider) {
      return res.status(400).json({ error: "missing_params" });
    }

    // check entitlement
    const ent = db
      .prepare(
        `SELECT * FROM entitlements
         WHERE user_id = ? AND amount > 0
         ORDER BY expires_at IS NULL, expires_at
         LIMIT 1`
      )
      .get(userId);

    if (!ent) {
      return res.status(402).json({ error: "no_credits" });
    }

    // consume 1 credit
    db.prepare(
      "UPDATE entitlements SET amount = amount - 1 WHERE id = ?"
    ).run(ent.id);

    // create signed token (5 min)
    const token = signLink({ userId, gameId, provider }, 300);

    // audit log
    db.prepare(
      `INSERT INTO link_requests
       (user_id, game_id, provider, signed_token, expires_at, used)
       VALUES (?, ?, ?, ?, datetime('now','+5 minutes'), 0)`
    ).run(userId, gameId, provider, token);

    return res.json({ token });
  } catch (err) {
    console.error("Erro ao gerar link protegido:", err);
    return res.status(500).json({ error: "internal_error" });
  }
});

/**
 * GET /api/protected/r/:token
 */
router.get("/r/:token", (req, res) => {
  try {
    const token = req.params.token;

    const ok = verifyLink(token);
    if (!ok.valid) {
      return res.status(401).send("Invalid or expired link");
    }

    // check if already used
    const used = db
      .prepare(
        "SELECT used FROM link_requests WHERE signed_token = ?"
      )
      .get(token);

    if (!used || used.used) {
      return res.status(410).send("Link already used");
    }

    const { provider, gameId } = ok.data;

    // 🔒 redirect seguro (mock por enquanto)
    const redirectUrl = getProviderUrl(provider, gameId);

    // mark as used
    db.prepare(
      "UPDATE link_requests SET used = 1 WHERE signed_token = ?"
    ).run(token);

    return res.redirect(302, redirectUrl);
  } catch (err) {
    console.error("Erro ao redirecionar link protegido:", err);
    return res.status(500).send("Internal error");
  }
});

/**
 * 🔧 MOCK — você pode trocar depois por lógica real
 */
function getProviderUrl(provider, gameId) {
  const map = {
    bet365: "https://www.bet365.com/",
    sportingbet: "https://www.sportingbet.com/",
    pixbet: "https://www.pixbet.com/"
  };

  return map[provider] || "https://www.google.com";
}

export default router;