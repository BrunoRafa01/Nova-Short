import { describe, it, expect } from "vitest";
import { isPrivateIp, isPrivateIPv4, isPrivateIPv6, validateUrlAgainstSSRF } from "@/lib/security/ssrf";

describe("SSRF Security Validator", () => {
  it("deve detectar e bloquear corretamente endereços IPv4 privados e reservados", () => {
    expect(isPrivateIPv4("127.0.0.1")).toBe(true);
    expect(isPrivateIPv4("127.255.255.255")).toBe(true);
    expect(isPrivateIPv4("10.0.0.1")).toBe(true);
    expect(isPrivateIPv4("10.255.255.255")).toBe(true);
    expect(isPrivateIPv4("172.16.0.1")).toBe(true);
    expect(isPrivateIPv4("172.31.255.255")).toBe(true);
    expect(isPrivateIPv4("192.168.1.1")).toBe(true);
    expect(isPrivateIPv4("169.254.169.254")).toBe(true); // AWS / GCP metadata
    expect(isPrivateIPv4("0.0.0.0")).toBe(true);

    // IPs públicos válidos
    expect(isPrivateIPv4("8.8.8.8")).toBe(false);
    expect(isPrivateIPv4("1.1.1.1")).toBe(false);
    expect(isPrivateIPv4("142.250.190.46")).toBe(false);
  });

  it("deve detectar e bloquear endereços IPv6 privados, loopback e IPv4-mapped", async () => {
    expect(isPrivateIPv6("::1")).toBe(true);
    expect(isPrivateIPv6("fe80::1")).toBe(true);
    expect(isPrivateIPv6("fc00::1")).toBe(true);
    expect(isPrivateIPv6("::ffff:127.0.0.1")).toBe(true);
    expect(isPrivateIPv6("::ffff:7f00:1")).toBe(true);
    expect(isPrivateIPv6("::ffff:169.254.169.254")).toBe(true);
    expect(isPrivateIPv6("::ffff:a9fe:a9fe")).toBe(true);
    expect(isPrivateIPv6("::ffff:10.0.0.1")).toBe(true);
    expect(isPrivateIPv6("2001:4860:4860::8888")).toBe(false);
    expect(isPrivateIPv6("::ffff:8.8.8.8")).toBe(false);

    const mappedLoopback = await validateUrlAgainstSSRF("http://[::ffff:127.0.0.1]/");
    expect(mappedLoopback.valid).toBe(false);
    const mappedMetadata = await validateUrlAgainstSSRF("http://[::ffff:169.254.169.254]/latest/meta-data/");
    expect(mappedMetadata.valid).toBe(false);
  });

  it("deve detectar esquemas perigosos e domínios maliciosos", async () => {
    const dataUrl = await validateUrlAgainstSSRF("data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==");
    expect(dataUrl.valid).toBe(false);

    const blobUrl = await validateUrlAgainstSSRF("blob:https://example.com/uuid");
    expect(blobUrl.valid).toBe(false);

    const grabify = await validateUrlAgainstSSRF("https://grabify.link/track123");
    expect(grabify.valid).toBe(false);

    const iplogger = await validateUrlAgainstSSRF("http://iplogger.org/2abcde");
    expect(iplogger.valid).toBe(false);

    const punycode = await validateUrlAgainstSSRF("https://xn--pple-43d.com/login");
    expect(punycode.valid).toBe(false);
  });

  it("deve rejeitar URLs com esquemas não permitidos", async () => {
    const fileResult = await validateUrlAgainstSSRF("file:///etc/passwd");
    expect(fileResult.valid).toBe(false);

    const jsResult = await validateUrlAgainstSSRF("javascript:alert(1)");
    expect(jsResult.valid).toBe(false);

    const gopherResult = await validateUrlAgainstSSRF("gopher://127.0.0.1:6379");
    expect(gopherResult.valid).toBe(false);
  });

  it("deve rejeitar URLs apontando para localhost ou nomes internos", async () => {
    const resLocalhost = await validateUrlAgainstSSRF("http://localhost:3000/api");
    expect(resLocalhost.valid).toBe(false);

    const resMeta = await validateUrlAgainstSSRF("http://metadata.google.internal/computeMetadata/v1/");
    expect(resMeta.valid).toBe(false);

    const resIpLocal = await validateUrlAgainstSSRF("http://127.0.0.1:8080");
    expect(resIpLocal.valid).toBe(false);

    const resMetaIp = await validateUrlAgainstSSRF("http://169.254.169.254/latest/meta-data/");
    expect(resMetaIp.valid).toBe(false);
  });

  it("deve rejeitar URLs com credenciais embutidas", async () => {
    const credsResult = await validateUrlAgainstSSRF("https://user:password@exemplo.com");
    expect(credsResult.valid).toBe(false);
  });

  it("deve permitir endereços IP públicos válidos sem necessidade de DNS", async () => {
    const validResult = await validateUrlAgainstSSRF("https://8.8.8.8/dns-query");
    expect(validResult.valid).toBe(true);
    expect(validResult.sanitizedUrl).toBe("https://8.8.8.8/dns-query");
  });
});
