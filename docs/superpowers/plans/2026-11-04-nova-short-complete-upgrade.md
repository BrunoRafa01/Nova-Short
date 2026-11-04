# Plano de Atualização Completa — NOVA SHORT SaaS

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Realizar a modernização completa visual, técnica, multiplataforma e de segurança do NOVA SHORT SaaS, corrigindo documentação, imagens, favicon, paleta de cores, vulnerabilidades e publicando na branch principal do GitHub.

**Architecture:** Next.js 15 App Router com TypeScript Strict Mode, Tailwind CSS com tokens de design system, PostgreSQL via Prisma ORM, BullMQ/Redis para processamento assíncrono de mídias, yt-dlp & FFmpeg com sanitização rigorosa e proteção SSRF/RCE.

**Tech Stack:** Next.js 15.1, React 19, TypeScript, Tailwind CSS, Prisma, BullMQ, Redis, Vitest, yt-dlp, FFmpeg.

**Spec:** Requisitos obrigatórios de atualização visual, README, segurança (OWASP), testes, suporte multiplataforma (com foco em Fedora Linux) e entrega no GitHub.

## Global Constraints
- Node.js >= 20.x compatível com Fedora, Ubuntu, Debian, Arch, Windows 10/11 e macOS.
- Sem quebra de funcionalidades existentes (encurtamento, downloader, telemetria, admin).
- Todas as credenciais, tokens e `.env` devem permanecer protegidos e ignorados pelo Git.
- Imagens do README devem carregar perfeitamente no GitHub.
- 100% dos testes e `npm run build` devem passar sem erros.

## Review Focus
1. `QRCodeModal` type error que impede `npm run build` (`qrCodeDataUrl` vs `qrCodeUrl`).
2. Broken banner no GitHub devido a `docs/images/banner.png` não rastreado no git.
3. Vulnerabilidades de autorização em `/api/links/[id]` (exclusão arbitrária de links).
4. Timing attacks no login administrativo e flag injection em executáveis `yt-dlp`.
5. Reflected XSS em `/s/[slug]/route.ts` via interpolação de strings em HTML.

---

### Task 1: Correção Imediata do Build e Componentes Reativos
- [ ] Atualizar `src/components/QRCodeModal.tsx` para aceitar `qrCodeUrl` e `qrCodeDataUrl`.
- [ ] Atualizar `src/app/historico/page.tsx` para usar propriedades padronizadas.
- [ ] Executar `npm run build` e confirmar que o erro de tipagem foi sanado.

### Task 2: Auditoria e Fortalecimento de Segurança (OWASP)
- [ ] Sanitizar inputs e aplicar escape HTML em `src/app/s/[slug]/route.ts` contra Reflected XSS.
- [ ] Implementar comparação em tempo constante (`crypto.timingSafeEqual`) no login administrativo.
- [ ] Proteger `/api/links/[id]` contra deleção não autorizada (IDOR) exigindo autenticação administrativa ou token do criador.
- [ ] Proteger chamadas ao `yt-dlp` e `ffmpeg` em `src/lib/downloader/extractor.ts` com delimitador `"--"` contra flag/command injection.
- [ ] Configurar cabeçalhos HTTP de segurança estritos em `next.config.ts` (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
- [ ] Ampliar testes de segurança em `tests/` para cobrir XSS escape, timing safe compare e validações de proteção.

### Task 3: Identidade Visual, Ícone (Favicon) e Paleta de Cores Moderna
- [ ] Criar ícone moderno do app em SVG e PNG (`public/icon.svg`, `public/favicon.ico`, `src/app/icon.png`, `public/apple-touch-icon.png`).
- [ ] Configurar metadados de ícones em `src/app/layout.tsx`.
- [ ] Refinar paleta de cores e design tokens (Obsidian Dark com acentos Cyber Sapphire/Azure e gradientes neon) em `tailwind.config.ts` e `src/app/globals.css`.
- [ ] Adicionar menu responsivo mobile na `Navbar.tsx` para garantir navegação completa em smartphones.
- [ ] Padronizar botões, estados de hover, loading e badges em todos os componentes.

### Task 4: Compatibilidade Multiplataforma (Fedora, Linux, Windows, macOS)
- [ ] Garantir que caminhos em `src/lib/downloader/extractor.ts` e `src/lib/queue/download-queue.ts` usem `path.join`/`path.resolve` de forma agnóstica de SO.
- [ ] Tratar nomes de executáveis no Windows (`yt-dlp.exe`, `ffmpeg.exe`) com fallback automático.
- [ ] Validar compatibilidade no Fedora Linux (comandos dnf, permissões de armazenamento, dependências).
- [ ] Criar script de verificação de ambiente multiplataforma (`scripts/check-environment.mjs`).

### Task 5: Capturas de Tela Reais e Renovação Completa do README.md
- [ ] Iniciar o servidor e capturar screenshots reais atualizadas da interface (Hero, Downloader, Histórico, Estatísticas, Admin).
- [ ] Rastrear `docs/images/banner.png` e todas as novas imagens no Git para eliminar qualquer imagem quebrada no GitHub.
- [ ] Reformular completamente o `README.md` com padrão de excelência de repositórios open-source e SaaS profissionais:
  - Badges elegantes e funcionais.
  - Tabela de conteúdos interativa.
  - Diagrama de arquitetura Mermaid.
  - Tabela de pilares de segurança e auditoria OWASP.
  - Guia de instalação completo para Fedora Linux, Ubuntu, Windows e macOS.
  - Guia de Docker Compose e variáveis de ambiente documentadas sem vazamento de dados.

### Task 6: Validação de Qualidade e Execução de Testes
- [ ] Executar `npm test` e registrar 100% de aprovação.
- [ ] Executar `npm run build` e validar geração dos bundles de produção.
- [ ] Verificar integridade do `.gitignore` garantindo que `.env` e chaves privadas nunca sejam commitados.

### Task 7: Commit e Push para a Branch Principal (`main`)
- [ ] Adicionar alterações com `git add`.
- [ ] Criar commit descritivo e organizado seguindo Conventional Commits.
- [ ] Enviar as alterações para o GitHub com `git push origin main`.
- [ ] Elaborar o relatório final detalhado com todos os 10 tópicos exigidos.
