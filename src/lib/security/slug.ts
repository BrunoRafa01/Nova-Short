import crypto from "crypto";

const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "app",
  "auth",
  "login",
  "logout",
  "register",
  "signup",
  "encurtador",
  "downloader",
  "historico",
  "estatisticas",
  "stats",
  "s",
  "u",
  "link",
  "links",
  "public",
  "assets",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "health",
  "terms",
  "privacy",
  "dashboard",
  "docs",
]);

const SLUG_ALPHABET = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateSlug(length: number = 6): string {
  const bytes = crypto.randomBytes(length);
  let slug = "";
  for (let i = 0; i < length; i++) {
    slug += SLUG_ALPHABET[bytes[i] % SLUG_ALPHABET.length];
  }
  return slug;
}

export function isValidSlugFormat(slug: string): boolean {
  if (!slug || typeof slug !== "string") return false;
  if (slug.length < 3 || slug.length > 32) return false;
  // Apenas letras, números, hífens e underscores
  return /^[a-zA-Z0-9_-]+$/.test(slug);
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}

export function validateCustomSlug(slug: string): { valid: boolean; error?: string } {
  const clean = slug.trim();
  if (!isValidSlugFormat(clean)) {
    return {
      valid: false,
      error: "O link personalizado deve conter entre 3 e 32 caracteres alfanuméricos (letras, números, hífens ou sublinhados).",
    };
  }
  if (isReservedSlug(clean)) {
    return {
      valid: false,
      error: "Este nome de link personalizado é uma palavra reservada do sistema.",
    };
  }
  return { valid: true };
}
