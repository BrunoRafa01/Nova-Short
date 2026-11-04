import Redis from "ioredis";

const globalForRedis = global as unknown as { redis: Redis | null };

let redisClient: Redis | null = null;

try {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  redisClient = globalForRedis.redis || new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
      if (times > 3) return null; // Não bloquear se Redis estiver offline
      return Math.min(times * 100, 1000);
    },
    lazyConnect: true,
  });

  redisClient.on("error", () => {
    // Tratamento silencioso de fallback para evitar quebras em dev offline
  });

  if (process.env.NODE_ENV !== "production") {
    globalForRedis.redis = redisClient;
  }
} catch {
  redisClient = null;
}

export const redis = redisClient;
