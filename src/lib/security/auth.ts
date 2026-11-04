import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ERRO CRÍTICO DE SEGURANÇA: JWT_SECRET não está definido nas variáveis de ambiente.");
    }
    // Em ambiente de teste/desenvolvimento local controlado
    const testSecret = process.env.VITEST ? "test_jwt_secret_must_be_32_characters_minimum_for_vitest!" : "";
    if (!testSecret) {
      throw new Error("JWT_SECRET é obrigatório. Defina uma chave segura de no mínimo 32 caracteres no arquivo .env.");
    }
    return new TextEncoder().encode(testSecret);
  }
  if (secret.length < 32) {
    throw new Error("JWT_SECRET fraco: a chave deve possuir no mínimo 32 caracteres.");
  }
  return new TextEncoder().encode(secret);
}

const COOKIE_NAME = "nova_admin_token";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface AdminPayload {
  sub: string;
  email: string;
  role: string;
}

export async function signAdminToken(payload: AdminPayload): Promise<string> {
  const secretKey = getSecretKey();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secretKey);
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      role: (payload.role as string) || "admin",
    };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
