import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export function authRequired(req, res, next) {
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({error:"unauth"});
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({error:"invalid"});
  }
}

export function adminOnly(req,res,next){
  if(req.user?.role !== "admin") return res.status(403).json({error:"denied"});
  next();
}