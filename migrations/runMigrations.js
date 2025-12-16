import fs from "fs";
import path from "path";
import { db } from "../db.js";

export const runMigrationsIfNeeded = async () => {
  try {
    // Corrigido: removido "backend" do caminho
    const sqlPath = path.join(process.cwd(), "migrations", "init.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");
    db.exec(sql);
    console.log("✅ Migrations applied.");
  } catch (err) {
    console.error("Error running migrations", err);
  }
};

// If run directly
if (process.argv[1] && process.argv[1].endsWith("runMigrations.js")) {
  runMigrationsIfNeeded();
}