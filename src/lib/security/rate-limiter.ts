import net from "net";
import { redis } from "../redis";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();
const MAX_MEMORY_STORE_SIZE = 10000;

function cleanupMemoryStore(now: number) {
  for (const [key, record] of memoryStore.entries()) {
    if (now > record.resetAt) {
      memoryStore.delete(key);
    }
  }
  // Se ainda estiver acima do limite máximo, remove as entradas mais antigas (LRU simples)
  if (memoryStore.size > MAX_MEMORY_STORE_SIZE) {
    const keysToDelete = Array.from(memoryStore.keys()).slice(0, Math.floor(MAX_MEMORY_STORE_SIZE * 0.2));
    for (const k of keysToDelete) {
      memoryStore.delete(k);
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export async function checkRateLimit(
  identifier: string,
  limit: number = 30,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;

  // Purga proativa se o mapa crescer em rajadas de tráfego
  if (memoryStore.size > MAX_MEMORY_STORE_SIZE) {
    cleanupMemoryStore(now);
  }

  // Tentar usar Redis primeiro
  if (redis && redis.status === "ready") {
    try {
      const current = await redis.incr(key);
      if (current === 1) {
        await redis.expire(key, windowSeconds);
      }
      const ttl = await redis.ttl(key);
      const remaining = Math.max(0, limit - current);
      return {
        success: current <= limit,
        limit,
        remaining,
        reset: now + (ttl > 0 ? ttl * 1000 : windowSeconds * 1000),
      };
    } catch {
      // Falha do Redis, cai no fallback de memória
    }
  }

  // Fallback em memória
  const record = memoryStore.get(key);
  if (!record || now > record.resetAt) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    };
    memoryStore.set(key, newRecord);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: newRecord.resetAt,
    };
  }

  record.count += 1;
  const remaining = Math.max(0, limit - record.count);
  return {
    success: record.count <= limit,
    limit,
    remaining,
    reset: record.resetAt,
  };
}

export function getClientIp(headers: Headers): string {
  const trustProxy = process.env.TRUST_PROXY !== "false";
  if (trustProxy) {
    // 1. Cloudflare header prioritário quando atrás de proxy confiável
    const cfIp = headers.get("cf-connecting-ip")?.trim();
    if (cfIp && net.isIP(cfIp)) {
      return cfIp;
    }

    // 2. X-Real-IP
    const realIp = headers.get("x-real-ip")?.trim();
    if (realIp && net.isIP(realIp)) {
      return realIp;
    }

    // 3. X-Forwarded-For: usa o IP mais à direita adicionado pelo proxy confiável
    const forwarded = headers.get("x-forwarded-for");
    if (forwarded) {
      const parts = forwarded.split(",").map((p) => p.trim()).filter((p) => net.isIP(p));
      if (parts.length > 0) {
        return parts[parts.length - 1];
      }
    }
  }

  return "127.0.0.1";
}
