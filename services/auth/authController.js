import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../../db.js"; // your sqlite wrapper

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export async function signup(req, res) {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({error:"invalid"});
  const pwHash = await bcrypt.hash(password, 10);
  // insert user...
  const stmt = db.prepare("INSERT INTO users(email,password_hash,name,is_verified) VALUES (?, ?, ?, 0)");
  const info = stmt.run(email, pwHash, name || null);
  // give 3 free odds
  const ent = db.prepare("INSERT INTO entitlements(user_id,type,amount) VALUES (?, 'FREE_ODD', 3)");
  ent.run(info.lastInsertRowid);
  res.json({ok:true});
}

export async function login(req,res) {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if(!user) return res.status(401).json({error:"invalid"});
  const ok = await bcrypt.compare(password, user.password_hash);
  if(!ok) return res.status(401).json({error:"invalid"});
  const token = jwt.sign({uid:user.id, role:user.role}, JWT_SECRET, {expiresIn:"1h"});
  const refresh = jwt.sign({uid:user.id}, JWT_REFRESH_SECRET, {expiresIn:"30d"});
  res.json({token, refresh});
}