import { describe, it, expect } from "vitest";
import { detectPlatform, getBinaryName } from "@/lib/downloader/extractor";

describe("Downloader Platform Detection", () => {
  it("deve identificar links do YouTube", () => {
    expect(detectPlatform("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("youtube");
    expect(detectPlatform("https://youtu.be/dQw4w9WgXcQ")).toBe("youtube");
    expect(detectPlatform("https://youtube.com/shorts/dQw4w9WgXcQ")).toBe("youtube");
  });

  it("deve identificar links do TikTok", () => {
    expect(detectPlatform("https://www.tiktok.com/@user/video/1234567890")).toBe("tiktok");
    expect(detectPlatform("https://vm.tiktok.com/ZMxxxx/")).toBe("tiktok");
  });

  it("deve identificar links do Instagram", () => {
    expect(detectPlatform("https://www.instagram.com/reel/Cxxxxxx/")).toBe("instagram");
    expect(detectPlatform("https://instagram.com/p/Cxxxxxx/")).toBe("instagram");
  });

  it("deve rotular outras URLs genéricas", () => {
    expect(detectPlatform("https://vimeo.com/123456")).toBe("outros");
  });

  it("deve resolver nomes de binários de forma multiplataforma", () => {
    const ytDlp = getBinaryName("yt-dlp");
    const ffmpeg = getBinaryName("ffmpeg");
    if (process.platform === "win32") {
      expect(ytDlp).toBe("yt-dlp.exe");
      expect(ffmpeg).toBe("ffmpeg.exe");
    } else {
      expect(ytDlp).toBe("yt-dlp");
      expect(ffmpeg).toBe("ffmpeg");
    }
  });
});
