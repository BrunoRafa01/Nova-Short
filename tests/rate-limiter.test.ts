import { describe, it, expect } from "vitest";
import { checkRateLimit } from "@/lib/security/rate-limiter";

describe("Rate Limiter", () => {
  it("deve permitir requisições dentro do limite configurado", async () => {
    const id = "test-user-ok-" + Date.now();
    const res1 = await checkRateLimit(id, 5, 10);
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(4);

    const res2 = await checkRateLimit(id, 5, 10);
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(3);
  });

  it("deve bloquear requisições que excedam o limite", async () => {
    const id = "test-user-blocked-" + Date.now();
    const limit = 3;

    for (let i = 0; i < limit; i++) {
      const res = await checkRateLimit(id, limit, 10);
      expect(res.success).toBe(true);
    }

    const blocked = await checkRateLimit(id, limit, 10);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });
});
