import dns from "dns/promises";
import net from "net";

const PRIVATE_IP_RANGES_V4 = [
  { start: ipToLong("0.0.0.0"), end: ipToLong("0.255.255.255") },       // 0.0.0.0/8
  { start: ipToLong("10.0.0.0"), end: ipToLong("10.255.255.255") },     // 10.0.0.0/8
  { start: ipToLong("100.64.0.0"), end: ipToLong("100.127.255.255") }, // 100.64.0.0/10 Carrier-grade NAT
  { start: ipToLong("127.0.0.0"), end: ipToLong("127.255.255.255") },   // 127.0.0.0/8
  { start: ipToLong("169.254.0.0"), end: ipToLong("169.254.255.255") }, // 169.254.0.0/16 Link-local / Cloud metadata
  { start: ipToLong("172.16.0.0"), end: ipToLong("172.31.255.255") },   // 172.16.0.0/12
  { start: ipToLong("192.0.0.0"), end: ipToLong("192.0.0.255") },       // 192.0.0.0/24 IETF Protocol Assignments
  { start: ipToLong("192.0.2.0"), end: ipToLong("192.0.2.255") },       // 192.0.2.0/24 TEST-NET-1
  { start: ipToLong("192.168.0.0"), end: ipToLong("192.168.255.255") }, // 192.168.0.0/16
  { start: ipToLong("198.18.0.0"), end: ipToLong("198.19.255.255") },   // 198.18.0.0/15 Benchmark
  { start: ipToLong("198.51.100.0"), end: ipToLong("198.51.100.255") }, // 198.51.100.0/24 TEST-NET-2
  { start: ipToLong("203.0.113.0"), end: ipToLong("203.0.113.255") },   // 203.0.113.0/24 TEST-NET-3
  { start: ipToLong("224.0.0.0"), end: ipToLong("239.255.255.255") },   // Multicast
  { start: ipToLong("240.0.0.0"), end: ipToLong("255.255.255.255") },   // Reserved
];

function ipToLong(ip: string): number {
  return ip
    .split(".")
    .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

export function isPrivateIPv4(ip: string): boolean {
  if (!net.isIPv4(ip)) return false;
  const long = ipToLong(ip);
  return PRIVATE_IP_RANGES_V4.some((range) => long >= range.start && long <= range.end);
}

export function isPrivateIPv6(ip: string): boolean {
  if (!net.isIPv6(ip)) return false;
  const normalized = ip.toLowerCase();

  // IPv4-mapped IPv6 (ex: ::ffff:127.0.0.1 ou ::ffff:169.254.169.254)
  if (normalized.startsWith("::ffff:")) {
    const ipv4Part = normalized.slice(7);
    if (net.isIPv4(ipv4Part)) {
      return isPrivateIPv4(ipv4Part);
    }
  }

  // Loopback e Não-especificado
  if (normalized === "::1" || normalized === "::" || normalized === "0000:0000:0000:0000:0000:0000:0000:0001") {
    return true;
  }

  // Link-local: fe80::/10 (fe8, fe9, fea, feb)
  if (/^fe[89ab]/i.test(normalized)) {
    return true;
  }

  // Unique local addresses (ULA): fc00::/7 (fc e fd)
  if (/^f[cd]/i.test(normalized)) {
    return true;
  }

  // Documentation prefix: 2001:db8::/32
  if (normalized.startsWith("2001:db8:") || normalized.startsWith("2001:0db8:")) {
    return true;
  }

  // Discard prefix: 100::/64
  if (normalized.startsWith("100::") || normalized.startsWith("0100::")) {
    return true;
  }

  return false;
}

export function isPrivateIp(ip: string): boolean {
  return isPrivateIPv4(ip) || isPrivateIPv6(ip);
}

const DANGEROUS_SCHEMES = [
  "javascript:",
  "data:",
  "file:",
  "blob:",
  "vbscript:",
  "about:",
  "chrome:",
  "view-source:",
];

const MALICIOUS_DOMAINS = [
  "grabify.link",
  "iplogger.org",
  "iplogger.com",
  "2no.co",
  "yip.su",
  "blasze.com",
  "linkexpansor.com",
];

export function isMaliciousOrDangerousUrl(urlStr: string): { dangerous: boolean; reason?: string } {
  if (!urlStr || typeof urlStr !== "string") {
    return { dangerous: true, reason: "URL inválida ou ausente." };
  }

  const lower = urlStr.toLowerCase().trim();
  for (const scheme of DANGEROUS_SCHEMES) {
    if (lower.startsWith(scheme)) {
      return { dangerous: true, reason: `Esquema de URL proibido por motivos de segurança (${scheme}).` };
    }
  }

  try {
    const parsed = new URL(urlStr);
    const host = parsed.hostname.toLowerCase();

    // Bloqueia domínios maliciosos conhecidos
    for (const malDomain of MALICIOUS_DOMAINS) {
      if (host === malDomain || host.endsWith("." + malDomain)) {
        return { dangerous: true, reason: "Domínio identificado em listas de proteção contra phishing e rastreamento malicioso." };
      }
    }

    // Detecção de ataques homógrafos Punycode
    if (host.startsWith("xn--")) {
      return { dangerous: true, reason: "Domínios codificados em Punycode são restritos para prevenir ataques de homógrafo/phishing." };
    }

    // Prevenção de loop de encurtamento no próprio domínio
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    try {
      const appHost = new URL(appUrl).hostname.toLowerCase();
      if (host === appHost && (parsed.pathname.startsWith("/s/") || parsed.pathname.startsWith("/api/"))) {
        return { dangerous: true, reason: "Não é permitido encurtar links recursivos da própria plataforma NOVA SHORT." };
      }
    } catch {}

  } catch {
    return { dangerous: true, reason: "Formato de URL inválido." };
  }

  return { dangerous: false };
}

export interface SSRFValidationResult {
  valid: boolean;
  error?: string;
  sanitizedUrl?: string;
}

export async function validateUrlAgainstSSRF(inputUrl: string): Promise<SSRFValidationResult> {
  if (!inputUrl || typeof inputUrl !== "string") {
    return { valid: false, error: "URL inválida ou ausente." };
  }

  // Verificação contra esquemas maliciosos, phishing e domínios perigosos
  const dangerCheck = isMaliciousOrDangerousUrl(inputUrl);
  if (dangerCheck.dangerous) {
    return { valid: false, error: dangerCheck.reason };
  }

  let parsed: URL;
  try {
    parsed = new URL(inputUrl);
  } catch {
    return { valid: false, error: "Formato de URL inválido. Certifique-se de incluir http:// ou https://" };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { valid: false, error: "Protocolo não permitido. Apenas HTTP e HTTPS são aceitos." };
  }

  if (parsed.username || parsed.password) {
    return { valid: false, error: "URLs contendo credenciais de autenticação não são permitidas." };
  }

  const rawHostname = parsed.hostname.toLowerCase();
  // Remove colchetes de endereços IPv6 (ex: "[::1]" -> "::1")
  const hostname = rawHostname.replace(/^\[|\]$/g, "");

  // Bloqueio de domínios óbvios locais
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname === "metadata.google.internal"
  ) {
    return { valid: false, error: "Acesso a endereços locais ou internos é estritamente proibido." };
  }

  // Se o hostname for diretamente um endereço IP
  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) {
      return { valid: false, error: "Acesso a endereços IP privados ou reservados é proibido." };
    }
  } else {
    // Resolução DNS do hostname para checar o IP de destino
    try {
      const addresses = await dns.lookup(hostname, { all: true });
      if (!addresses || addresses.length === 0) {
        return { valid: false, error: "Não foi possível resolver o domínio informado." };
      }

      for (const addr of addresses) {
        if (isPrivateIp(addr.address)) {
          return { valid: false, error: "O domínio aponta para um endereço de rede privado ou interno restrito." };
        }
      }
    } catch {
      return { valid: false, error: "Falha na resolução de DNS para o domínio informado." };
    }
  }

  return {
    valid: true,
    sanitizedUrl: parsed.toString(),
  };
}
