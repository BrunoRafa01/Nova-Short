#!/usr/bin/env node
// Rotina de Retenção e Expurgo Automático de Mídias Temporárias (Nova Short)

import { existsSync, readdirSync, statSync, unlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, "..");
const STORAGE_DIR = join(ROOT_DIR, "storage");
const MAX_AGE_MS = 2 * 60 * 60 * 1000; // 2 horas de retenção para mídias temporárias

console.log("🧹 [RETENÇÃO NOVA-SHORT] Iniciando expurgo automático de mídias temporárias...");

if (existsSync(STORAGE_DIR)) {
  const now = Date.now();
  let purged = 0;

  try {
    const files = readdirSync(STORAGE_DIR);
    for (const f of files) {
      if (f === "backups" || f.startsWith(".")) continue;
      const fullPath = join(STORAGE_DIR, f);
      const stat = statSync(fullPath);
      if (stat.isFile() && now - stat.mtimeMs > MAX_AGE_MS) {
        unlinkSync(fullPath);
        purged += 1;
      }
    }
    console.log(`✅ [RETENÇÃO] Limpeza concluída: ${purged} arquivo(s) temporário(s) expurgado(s).`);
  } catch (err) {
    console.error("❌ [RETENÇÃO] Erro ao limpar arquivos:", err.message);
  }
} else {
  console.log("ℹ️ [RETENÇÃO] Diretório storage não encontrado ou vazio.");
}
