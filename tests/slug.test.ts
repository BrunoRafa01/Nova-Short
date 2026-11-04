import { describe, it, expect } from "vitest";
import { generateSlug, isValidSlugFormat, isReservedSlug, validateCustomSlug } from "@/lib/security/slug";

describe("Slug Generator and Validator", () => {
  it("deve gerar slugs com o comprimento especificado", () => {
    const s6 = generateSlug(6);
    expect(s6).toHaveLength(6);
    expect(isValidSlugFormat(s6)).toBe(true);

    const s10 = generateSlug(10);
    expect(s10).toHaveLength(10);
    expect(isValidSlugFormat(s10)).toBe(true);
  });

  it("deve validar formato alfanumérico aceitando hífens e underscores", () => {
    expect(isValidSlugFormat("meu-link-2026")).toBe(true);
    expect(isValidSlugFormat("promo_black_friday")).toBe(true);
    expect(isValidSlugFormat("link123")).toBe(true);

    // Caracteres proibidos
    expect(isValidSlugFormat("link com espaco")).toBe(false);
    expect(isValidSlugFormat("link/com/barra")).toBe(false);
    expect(isValidSlugFormat("link?query=1")).toBe(false);
    expect(isValidSlugFormat("ab")).toBe(false); // menos de 3 chars
  });

  it("deve identificar palavras reservadas do sistema", () => {
    expect(isReservedSlug("admin")).toBe(true);
    expect(isReservedSlug("ADMIN")).toBe(true);
    expect(isReservedSlug("api")).toBe(true);
    expect(isReservedSlug("downloader")).toBe(true);
    expect(isReservedSlug("encurtador")).toBe(true);
    expect(isReservedSlug("historico")).toBe(true);
    expect(isReservedSlug("estatisticas")).toBe(true);

    // Slugs não reservados
    expect(isReservedSlug("meu-projeto")).toBe(false);
    expect(isReservedSlug("campanha-nova")).toBe(false);
  });

  it("deve validar slug personalizado com erro descritivo", () => {
    const errFormat = validateCustomSlug("a");
    expect(errFormat.valid).toBe(false);
    expect(errFormat.error).toContain("entre 3 e 32");

    const errReserved = validateCustomSlug("admin");
    expect(errReserved.valid).toBe(false);
    expect(errReserved.error).toContain("palavra reservada");

    const success = validateCustomSlug("meu-link-oficial");
    expect(success.valid).toBe(true);
  });
});
