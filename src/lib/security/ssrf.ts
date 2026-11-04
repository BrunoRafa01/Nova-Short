import dns from "dns/promises";
import net from "net";

const PRIVATE_IP_RANGES_V4 = [
  { start: ipToLong("0.0.0.0"), end: ipToLong("0.255.255.255") },       // 0.0.0.0/8
  { start: ipToLong("10.0.0.0"), end: ipToLong("10.255.255.255") },     // 10.0.0.0/8
  { start: ipToLong("127.0.0.0"), end: ipToLong("127.255.255.255") },   // 127.0.0.0/8
  { start: ipToLong("169.254.0.0"), end: ipToLong("169.254.255.255") }, // 169.254.0.0/16 (Link-local & AWS/GCP metadata)
  { start: ipToLong("172.16.0.0"), end: ipToLong("172.31.255.255") },   // 172.16.0.0/12
  { start: ipToLong("192.168.0.0"), end: ipToLong("192.168.255.255") }, // 192.168.0.0/16
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
  if (normalized === "::1" || normalized === "::") return true;
  // fe80::/10 link-local
  if (normalized.startsWith("fe8") || normalized.startsWith("fe9") || normalized.startsWith("fea") || normalized.startsWith("feb")) {
    return true;
  }
  // fc00::/7 unique local
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) {
    return true;
  }
  return false;
}

export function isPrivateIp(ip: string): boolean {
  return isPrivateIPv4(ip) || isPrivateIPv6(ip);
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

  const hostname = parsed.hostname.toLowerCase();

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
