import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const dbPath = process.env.DB_PATH || path.join(process.cwd(), "data", "database.sqlite");
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

export const db = new Database(dbPath);

// helper: run migrations manually if needed elsewhere
export const runSql = (sql) => db.exec(sql);