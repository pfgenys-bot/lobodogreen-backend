import crypto from "crypto";

const HMAC_SECRET = process.env.HMAC_SECRET || "dev_secret";

export function signLink(payload = {}, ttlSeconds = 300) {
  const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
  const data = {...payload, expires};
  const serialized = JSON.stringify(data);
  const sig = crypto.createHmac("sha256", HMAC_SECRET).update(serialized).digest("hex");
  const token = Buffer.from(JSON.stringify({data, sig})).toString("base64url");
  return token;
}

export function verifyLink(token) {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const { data, sig } = JSON.parse(raw);
    const serialized = JSON.stringify(data);
    const expected = crypto.createHmac("sha256", HMAC_SECRET).update(serialized).digest("hex");
    if (expected !== sig) return { valid: false, reason: "bad_sig" };
    if (Math.floor(Date.now() / 1000) > data.expires) return { valid: false, reason: "expired" };
    return { valid: true, data };
  } catch (err) {
    return { valid: false, reason: "invalid" };
  }
}