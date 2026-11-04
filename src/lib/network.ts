import os from "os";

/**
 * Obtém o endereço IPv4 da máquina na rede local (Wi-Fi ou Ethernet)
 * para permitir acesso e testes via smartphones na mesma rede.
 */
export function getNetworkIp(): string {
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === "IPv4" && !iface.internal) {
          return iface.address;
        }
      }
    }
  } catch {
    // fallback
  }
  return "localhost";
}

/**
 * Determina a URL base pública ou de rede local para geração de QR Codes e Links Encurtados.
 * Se estiver rodando localmente, utiliza o IP da rede local (ex: http://172.16.100.28:3000)
 * para que smartphones (como iPhone) possam escanear o QR Code e acessar sem erro.
 */
export function getBaseAppUrl(requestHost?: string | null): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;

  // 1. Em produção com domínio público configurado
  if (
    process.env.NODE_ENV === "production" &&
    envUrl &&
    !envUrl.includes("localhost") &&
    !envUrl.includes("127.0.0.1")
  ) {
    return envUrl.replace(/\/$/, "");
  }

  // 2. Se a requisição veio diretamente de um IP de rede ou host específico (ex: celular acessou pelo IP)
  if (
    requestHost &&
    !requestHost.includes("localhost") &&
    !requestHost.includes("127.0.0.1")
  ) {
    const cleanHost = requestHost.split(",")[0].trim();
    const protocol = cleanHost.includes("https") ? "https" : "http";
    return `${protocol}://${cleanHost}`;
  }

  // 3. Em desenvolvimento: se a URL do .env contiver IP local, use-a
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl.replace(/\/$/, "");
  }

  // 4. Auto-detectar IP da rede local para suportar escaneamento por celulares no mesmo Wi-Fi
  const localIp = getNetworkIp();
  if (localIp && localIp !== "localhost" && localIp !== "127.0.0.1") {
    return `http://${localIp}:3000`;
  }

  return "http://localhost:3000";
}
