import { describe, it, expect } from "vitest";
import {
  anonymizeIp,
  validatePasswordStrength,
  encryptSensitiveField,
  decryptSensitiveField,
  sanitizeInput,
  getCompliance40Requirements,
  logSecurityEvent,
} from "../src/lib/security/compliance";

describe("Compliance & Security Suite: 40 Requirements", () => {
  it("anonymizes IPv4 and IPv6 addresses correctly for LGPD compliance", () => {
    expect(anonymizeIp("192.168.1.100")).toBe("192.168.***.***");
    expect(anonymizeIp("10.0.0.1")).toBe("10.0.***.***");
    expect(anonymizeIp("2001:0db8:85a3:0000:0000:8a2e:0370:7334")).toBe("2001:0db8:85a3:****:****:****");
    expect(anonymizeIp(null)).toBe("0.0.0.0");
  });

  it("validates password strength according to NIST/OWASP routine", () => {
    expect(validatePasswordStrength("weak").valid).toBe(false);
    expect(validatePasswordStrength("NoNumberOrSymbol!").valid).toBe(false);
    expect(validatePasswordStrength("nonumbersymbol").valid).toBe(false);
    expect(validatePasswordStrength("Password123!").valid).toBe(true);
    expect(validatePasswordStrength("S3cure#NovaShort2026").valid).toBe(true);
  });

  it("encrypts and decrypts sensitive data fields with AES-256-GCM", () => {
    const sensitive = "cpf:123.456.789-00;secret_token:abc-xyz";
    const encrypted = encryptSensitiveField(sensitive);
    expect(encrypted).toContain("enc:");
    expect(encrypted).not.toBe(sensitive);

    const decrypted = decryptSensitiveField(encrypted);
    expect(decrypted).toBe(sensitive);
  });

  it("sanitizes user input to prevent XSS attacks", () => {
    const malicious = '<script>alert("hacked")</script>';
    const safe = sanitizeInput(malicious);
    expect(safe).not.toContain("<script>");
    expect(safe).toContain("&lt;script&gt;");
  });

  it("logs security events with anonymized IP and timestamps", () => {
    const event = logSecurityEvent("TEST_ALERT", { code: 999 }, "177.18.29.40", "Mozilla/5.0");
    expect(event.id).toBeDefined();
    expect(event.type).toBe("TEST_ALERT");
    expect(event.ip_anonymized).toBe("177.18.***.***");
    expect(event.timestamp).toBeDefined();
  });

  it("contains all 40 requirements mapped with 100% compliant status", () => {
    const reqs = getCompliance40Requirements();
    expect(reqs.length).toBe(40);
    const nonCompliant = reqs.filter((r) => r.status !== "IMPLEMENTADO");
    expect(nonCompliant.length).toBe(0);
  });
});
