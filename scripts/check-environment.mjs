import os from "os";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("🔍 Verificando Compatibilidade do Ambiente Multiplataforma — NOVA SHORT\n");

const results = [];

function check(label, fn) {
  try {
    const detail = fn();
    results.push({ label, status: "OK", detail: detail || "Presente" });
    console.log(`  ✅ [OK] ${label}: ${detail || "Detectado"}`);
  } catch (err) {
    results.push({ label, status: "AVISO", detail: err.message });
    console.log(`  ⚠️ [AVISO] ${label}: ${err.message}`);
  }
}

// 1. Sistema Operacional
check("Sistema Operacional", () => {
  const platform = os.platform();
  const release = os.release();
  const arch = os.arch();
  let distro = "Desconhecido";
  if (platform === "linux") {
    try {
      const osRelease = fs.readFileSync("/etc/os-release", "utf8");
      const match = osRelease.match(/PRETTY_NAME="([^"]+)"/);
      if (match) distro = match[1];
    } catch {}
  } else if (platform === "win32") {
    distro = "Microsoft Windows";
  } else if (platform === "darwin") {
    distro = "Apple macOS";
  }
  return `${distro} (${platform} ${arch}, kernel ${release})`;
});

// 2. Node.js
check("Runtime Node.js", () => {
  const version = process.version;
  const major = parseInt(version.replace("v", "").split(".")[0], 10);
  if (major < 20) throw new Error(`Node.js ${version} é inferior ao mínimo recomendado (>= v20.x).`);
  return version;
});

// 3. Executável yt-dlp
check("Extrator yt-dlp", () => {
  const cmd = process.platform === "win32" ? "where yt-dlp" : "which yt-dlp";
  const binPath = execSync(cmd, { encoding: "utf8" }).trim().split("\n")[0];
  const version = execSync("yt-dlp --version", { encoding: "utf8" }).trim();
  return `${binPath} (v${version})`;
});

// 4. Conversor FFmpeg
check("Processador FFmpeg", () => {
  const cmd = process.platform === "win32" ? "where ffmpeg" : "which ffmpeg";
  const binPath = execSync(cmd, { encoding: "utf8" }).trim().split("\n")[0];
  const firstLine = execSync("ffmpeg -version", { encoding: "utf8" }).split("\n")[0];
  return `${binPath} (${firstLine.slice(0, 35)}...)`;
});

// 5. Python 3
check("Interpretador Python 3", () => {
  const cmd = process.platform === "win32" ? "where python" : "which python3";
  const binPath = execSync(cmd, { encoding: "utf8" }).trim().split("\n")[0];
  const version = execSync(`${binPath} --version`, { encoding: "utf8" }).trim();
  return `${binPath} (${version})`;
});

// 6. Diretório de Armazenamento Local
check("Permissão de Escrita no Storage", () => {
  const storageDir = path.resolve(process.env.STORAGE_DIR || "./storage/downloads");
  fs.mkdirSync(storageDir, { recursive: true });
  const testFile = path.join(storageDir, `.test_write_${Date.now()}.tmp`);
  fs.writeFileSync(testFile, "test-write-ok");
  fs.unlinkSync(testFile);
  return `${storageDir} (leitura/escrita OK)`;
});

console.log("\n✨ Relatório de Diagnóstico Concluído com Sucesso!");
