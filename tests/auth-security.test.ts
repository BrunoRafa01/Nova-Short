import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, signAdminToken, verifyAdminToken } from "@/lib/security/auth";
import { getClientIp } from "@/lib/security/rate-limiter";
import { cleanExpiredDownloads } from "@/lib/queue/download-queue";

describe("Segurança de Autenticação e Sessão", () => {
  it("deve criar hash bcrypt seguro e verificar senhas corretamente", async () => {
    const password = "SuperSecretPassword123!";
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash.startsWith("$2a$") || hash.startsWith("$2b$")).toBe(true);

    const isMatch = await verifyPassword(password, hash);
    expect(isMatch).toBe(true);

    const isWrong = await verifyPassword("WrongPassword123!", hash);
    expect(isWrong).toBe(false);
  });

  it("deve assinar e verificar tokens JWT administrativos de forma íntegra", async () => {
    const payload = {
      sub: "admin-uuid-12345",
      email: "admin@novaruntime.com",
      role: "admin",
    };

    const token = await signAdminToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const verified = await verifyAdminToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.sub).toBe(payload.sub);
    expect(verified?.email).toBe(payload.email);
    expect(verified?.role).toBe(payload.role);
  });

  it("deve rejeitar tokens JWT forjados ou corrompidos", async () => {
    const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.corrompido.assinatura_invalida";
    const result = await verifyAdminToken(invalidToken);
    expect(result).toBeNull();
  });
});

describe("Proteção de Cabeçalhos e Rate Limiter IP Extraction", () => {
  it("deve extrair IP prioritário de cf-connecting-ip se for válido", () => {
    const headers = new Headers({
      "cf-connecting-ip": "203.0.113.195",
      "x-real-ip": "198.51.100.10",
      "x-forwarded-for": "192.0.2.1, 10.0.0.1",
    });

    const ip = getClientIp(headers);
    expect(ip).toBe("203.0.113.195");
  });

  it("deve validar e filtrar IPs de x-forwarded-for ignorando entradas maliciosas", () => {
    const headers = new Headers({
      "x-forwarded-for": "<script>alert(1)</script>, 198.51.100.45",
    });

    const ip = getClientIp(headers);
    expect(ip).toBe("198.51.100.45");
  });

  it("deve retornar fallback seguro caso nenhum cabeçalho possua IP válido", () => {
    const headers = new Headers({
      "x-forwarded-for": "malicious_string_injection",
      "x-real-ip": "fake_ip",
    });

    const ip = getClientIp(headers);
    expect(ip).toBe("127.0.0.1");
  });
});

describe("Rotina de Limpeza de Arquivos Expirados", () => {
  it("deve executar a função de limpeza de tarefas sem lançar exceções", async () => {
    const res = await cleanExpiredDownloads();
    expect(res).toBeDefined();
    expect(typeof res.removedFiles).toBe("number");
    expect(typeof res.updatedJobs).toBe("number");
  });
});
