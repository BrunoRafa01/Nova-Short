import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import crypto from "crypto";

const execFileAsync = promisify(execFile);

export interface MediaFormatOption {
  formatId: string;
  type: "video" | "audio";
  extension: string;
  quality: string;
  resolution?: string;
  fileSizeApprox?: number;
  label: string;
}

export interface MediaMetadata {
  id: string;
  title: string;
  thumbnail: string;
  duration: number; // segundos
  author: string;
  platform: string;
  availableFormats: MediaFormatOption[];
}

export function detectPlatform(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (host.includes("youtube.com") || host.includes("youtu.be")) return "youtube";
    if (host.includes("tiktok.com")) return "tiktok";
    if (host.includes("instagram.com")) return "instagram";
    return "outros";
  } catch {
    return "desconhecido";
  }
}

export async function analyzeMediaUrl(url: string): Promise<MediaMetadata> {
  const platform = detectPlatform(url);

  // Argumentos robustos para yt-dlp sem injeção de shell
  const args = [
    "--dump-json",
    "--no-warnings",
    "--no-check-certificates",
    "--skip-download",
    "--socket-timeout", "15",
    "--force-ipv4",
    "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    url,
  ];

  try {
    const { stdout } = await execFileAsync("yt-dlp", args, {
      timeout: 30000,
      maxBuffer: 15 * 1024 * 1024,
    });

    const info = JSON.parse(stdout);

    const title = info.title || "Mídia sem título";
    const thumbnail = info.thumbnail || info.thumbnails?.[0]?.url || "";
    const duration = Math.round(Number(info.duration) || 0);
    const author = info.uploader || info.channel || info.creator || "Criador";

    const availableFormats: MediaFormatOption[] = [
      {
        formatId: "bestvideo[height<=1080]+bestaudio/best[height<=1080]/best",
        type: "video",
        extension: "mp4",
        quality: "1080p",
        resolution: "1920x1080",
        label: "Vídeo 1080p Full HD (MP4)",
      },
      {
        formatId: "bestvideo[height<=720]+bestaudio/best[height<=720]/best",
        type: "video",
        extension: "mp4",
        quality: "720p",
        resolution: "1280x720",
        label: "Vídeo 720p HD (MP4)",
      },
      {
        formatId: "bestvideo[height<=480]+bestaudio/best[height<=480]/best",
        type: "video",
        extension: "mp4",
        quality: "480p",
        resolution: "854x480",
        label: "Vídeo 480p SD (MP4)",
      },
      {
        formatId: "bestaudio/best",
        type: "audio",
        extension: "mp3",
        quality: "320k",
        label: "Áudio Alta Fidelidade (MP3 320kbps)",
      },
      {
        formatId: "bestaudio/best",
        type: "audio",
        extension: "mp3",
        quality: "192k",
        label: "Áudio Padrão (MP3 192kbps)",
      },
    ];

    return {
      id: info.id || crypto.randomUUID(),
      title,
      thumbnail,
      duration,
      author,
      platform,
      availableFormats,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (errorMsg.includes("Unsupported URL")) {
      throw new Error("A plataforma ou formato desta URL não é suportada.");
    }
    if (errorMsg.includes("Private video") || errorMsg.includes("Sign in")) {
      throw new Error("Este conteúdo é privado ou requer autenticação na plataforma de origem.");
    }
    throw new Error(`Falha ao inspecionar a mídia: ${errorMsg.slice(0, 150)}`);
  }
}

export interface DownloadResult {
  filePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export async function processMediaDownload(
  url: string,
  type: "video" | "audio",
  quality: string,
  outputDir: string,
  jobId: string,
  onProgress?: (progress: number) => void
): Promise<DownloadResult> {
  // Garantir existência da pasta de destino
  await fs.mkdir(outputDir, { recursive: true });

  const isAudio = type === "audio";
  const extension = isAudio ? "mp3" : "mp4";
  const safeFilename = `nova_${jobId}.${extension}`;
  const targetPath = path.join(outputDir, safeFilename);

  // Prevenir Path Traversal
  if (!targetPath.startsWith(path.resolve(outputDir))) {
    throw new Error("Caminho de arquivo inválido.");
  }

  const args: string[] = [
    "--no-warnings",
    "--no-check-certificates",
    "--socket-timeout", "20",
    "--force-ipv4",
    "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  ];

  if (isAudio) {
    args.push(
      "-f", "bestaudio/best",
      "-x",
      "--audio-format", "mp3",
      "--audio-quality", quality === "320k" ? "0" : "2",
      "-o", targetPath,
      url
    );
  } else {
    let formatFilter = "bestvideo[height<=1080]+bestaudio/best[height<=1080]/best";
    if (quality === "1080p") {
      formatFilter = "bestvideo[height<=1080]+bestaudio/best[height<=1080]/best";
    } else if (quality === "720p") {
      formatFilter = "bestvideo[height<=720]+bestaudio/best[height<=720]/best";
    } else if (quality === "480p") {
      formatFilter = "bestvideo[height<=480]+bestaudio/best[height<=480]/best";
    }

    args.push(
      "-f", formatFilter,
      "--merge-output-format", "mp4",
      "-o", targetPath,
      url
    );
  }

  if (onProgress) onProgress(25);

  try {
    await execFileAsync("yt-dlp", args, {
      timeout: 180000, // 3 minutos max
      maxBuffer: 25 * 1024 * 1024,
    });

    if (onProgress) onProgress(85);

    // Verificar se o arquivo foi criado no caminho esperado ou com pequenas variações
    let finalPath = targetPath;
    if (!fsSync.existsSync(finalPath)) {
      // Buscar se yt-dlp gerou com extensão diferente e renomear/ajustar
      const candidates = [
        path.join(outputDir, `nova_${jobId}.mp4`),
        path.join(outputDir, `nova_${jobId}.mp3`),
        path.join(outputDir, `nova_${jobId}.m4a`),
        path.join(outputDir, `nova_${jobId}.webm`),
      ];
      const found = candidates.find((c) => fsSync.existsSync(c));
      if (found) {
        finalPath = found;
      } else {
        throw new Error("Arquivo de mídia final não foi encontrado no disco após processamento.");
      }
    }

    const stats = await fs.stat(finalPath);
    if (onProgress) onProgress(100);

    return {
      filePath: finalPath,
      fileName: path.basename(finalPath),
      fileSize: stats.size,
      mimeType: isAudio ? "audio/mpeg" : "video/mp4",
    };
  } catch (err: unknown) {
    // Limpeza de resíduos
    await fs.unlink(targetPath).catch(() => {});
    throw new Error(`Erro ao baixar a mídia: ${err instanceof Error ? err.message : String(err)}`);
  }
}
