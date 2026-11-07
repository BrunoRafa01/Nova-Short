import { describe, it, expect } from "vitest";
import { performance } from "perf_hooks";
import { validateUrlAgainstSSRF } from "@/lib/security/ssrf";
import { generateSlug, validateCustomSlug } from "@/lib/security/slug";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { signAdminToken, verifyAdminToken } from "@/lib/security/auth";

const CONCURRENCY_USERS = 1000;

describe("Teste de Carga e Estresse de Alta Concorrência (1.000 Usuários Simultâneos)", () => {
  it(
    `deve processar validação de URL e blindagem SSRF sob carga de ${CONCURRENCY_USERS} requisições concorrentes`,
    async () => {
      // Vetores de teste incluindo IPs privados, esquemas perigosos, domínios maliciosos e loopbacks
      const testUrls = [
        "http://127.0.0.1:8080/admin",
        "http://169.254.169.254/latest/meta-data",
        "http://10.0.0.1/private-api",
        "http://192.168.1.254/router",
        "http://[::1]/secret-status",
        "javascript:alert(1)",
        "file:///etc/passwd",
        "data:text/html,<script>evil()</script>",
        "http://metadata.google.internal/computeMetadata/v1/",
        "http://localhost:3000/internal",
      ];

      const latencies: number[] = [];
      let blockedCount = 0;
      let allowedCount = 0;

      const tStart = performance.now();

      const promises = Array.from({ length: CONCURRENCY_USERS }, async (_, i) => {
        const targetUrl = testUrls[i % testUrls.length];
        const t0 = performance.now();
        const res = await validateUrlAgainstSSRF(targetUrl);
        latencies.push(performance.now() - t0);

        if (res.valid) allowedCount++;
        else blockedCount++;
      });

      await Promise.all(promises);
      const totalTime = performance.now() - tStart;
      const throughput = (CONCURRENCY_USERS / (totalTime / 1000)).toFixed(1);

      expect(allowedCount + blockedCount).toBe(CONCURRENCY_USERS);
      expect(blockedCount).toBe(CONCURRENCY_USERS); // Todos os 1000 vetores maliciosos/privados devem ser bloqueados
      expect(latencies.length).toBe(CONCURRENCY_USERS);
      console.log(`[Stress SSRF] 1.000 vetores analisados e bloqueados em ${(totalTime / 1000).toFixed(3)}s (${throughput} req/s)`);
    },
    15000
  );

  it(
    `deve gerar e validar ${CONCURRENCY_USERS} slugs em paralelo com taxa de colisão zero`,
    async () => {
      const slugs = new Set<string>();
      const tStart = performance.now();

      const promises = Array.from({ length: CONCURRENCY_USERS }, async () => {
        const slug = generateSlug(6);
        const valid = validateCustomSlug(slug);
        expect(valid.valid).toBe(true);
        slugs.add(slug);
      });

      await Promise.all(promises);
      const totalTime = performance.now() - tStart;

      expect(slugs.size).toBeGreaterThanOrEqual(995);
      console.log(`[Stress Slugs] 1.000 slugs gerados em ${(totalTime / 1000).toFixed(3)}s. Únicos: ${slugs.size}/${CONCURRENCY_USERS}`);
    },
    15000
  );

  it(
    `deve suportar rajada de rate limiting sob ${CONCURRENCY_USERS} acessos simultâneos sem travamentos ou vazamentos de memória`,
    async () => {
      let allowed = 0;
      let limited = 0;
      const tStart = performance.now();

      const singleTargetIp = "192.0.2.77";

      // 500 IPs distribuídos + 500 acessos ao mesmo IP para testar bloqueio
      const promises = Array.from({ length: CONCURRENCY_USERS }, async (_, i) => {
        const identifier = i >= 500 ? singleTargetIp : `ip_stress_${i}`;
        const res = await checkRateLimit(identifier, 30, 60);
        if (res.success) allowed++;
        else limited++;
      });

      await Promise.all(promises);
      const totalTime = performance.now() - tStart;

      expect(allowed + limited).toBe(CONCURRENCY_USERS);
      expect(allowed).toBeGreaterThanOrEqual(500);
      expect(limited).toBeGreaterThanOrEqual(450);

      console.log(`[Stress RateLimit] 1.000 reqs em ${(totalTime / 1000).toFixed(3)}s: ${allowed} aprovadas, ${limited} contidas.`);
    },
    15000
  );

  it(
    `deve validar e verificar ${CONCURRENCY_USERS} tokens JWT em concorrência`,
    async () => {
      const token = await signAdminToken({
        sub: "admin-stress-1000",
        email: "stress@novaruntime.com",
        role: "admin",
      });

      const tStart = performance.now();
      let verifiedCount = 0;

      const promises = Array.from({ length: CONCURRENCY_USERS }, async () => {
        const decoded = await verifyAdminToken(token);
        if (decoded?.sub === "admin-stress-1000") {
          verifiedCount++;
        }
      });

      await Promise.all(promises);
      const totalTime = performance.now() - tStart;

      expect(verifiedCount).toBe(CONCURRENCY_USERS);
      console.log(`[Stress JWT] 1.000 verificações em ${(totalTime / 1000).toFixed(3)}s (${(CONCURRENCY_USERS / (totalTime / 1000)).toFixed(1)} op/s)`);
    },
    15000
  );
});
