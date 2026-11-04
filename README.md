# NOVA SHORT — NOVA RUNTIME

> SaaS profissional de alta performance para **encurtamento inteligente de links** com telemetria avançada e **downloader seguro de mídia** de plataformas líderes (YouTube, TikTok e Instagram).

---

## 🚀 Visão Geral

O **NOVA SHORT** é uma solução completa desenvolvida para o ecossistema **NOVA RUNTIME**, combinando duas ferramentas essenciais em uma experiência dark premium:

1. **Encurtador de Links de Alta Performance**:
   - Criação de links curtos e slugs personalizados (`/s/meu-link`).
   - Geração dinâmica de QR Code para compartilhamento rápido.
   - Redirecionamento instantâneo via HTTP 307 com coleta de telemetria anônima.
   - Proteção de links por senha e data de expiração.
   - Dashboard analítico com gráficos interativos de cliques, dispositivos, navegadores e origens de tráfego.

2. **Downloader de Mídia Seguro**:
   - Suporte a YouTube, TikTok e Instagram.
   - Análise prévia de links com extração de metadados (título, autor, duração, thumbnail).
   - Seleção de qualidade: Vídeo MP4 (1080p Full HD, 720p HD, 480p SD) e Áudio MP3 (320kbps, 192kbps).
   - Processamento assíncrono isolado com FFmpeg e filas BullMQ + Redis.
   - Barra de progresso em tempo real e download direto do arquivo final.
   - Compliance estrito com direitos autorais e termos de serviço das plataformas (sem evasão de DRM).

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: Next.js 15 (App Router, Server & Client Components) + React 19
- **Linguagem**: TypeScript strict mode
- **Estilização**: Tailwind CSS (Paleta customizada NOVA: `#080B12`, `#101622`, `#3B82F6`)
- **Banco de Dados**: PostgreSQL 16 + Prisma ORM
- **Filas & Cache**: Redis 7 + BullMQ (com fallback para fila assíncrona em memória)
- **Processamento de Mídia**: FFmpeg 8 + yt-dlp (execução segura sem interpolação de shell)
- **Validação de Schemas**: Zod
- **Autenticação**: JWT (`jose`) com cookies HTTPOnly e hash bcrypt
- **Containers**: Docker & Docker Compose
- **Testes**: Vitest

---

## 🔒 Segurança e Resiliência

- **Proteção contra SSRF (Server-Side Request Forgery)**: Validador rigoroso que rejeita esquemas não-HTTP/S, bloqueia requisições para `localhost`, nomes `.local`/`.internal`, endereços IPv4 e IPv6 privados (RFC 1918) e metadados de nuvem (AWS/GCP/Azure `169.254.169.254`).
- **Prevenção contra Injeção de Comandos**: Argumentos para `yt-dlp` e `ffmpeg` são passados exclusivamente como arrays de parâmetros via `execFile`, eliminando shell escapes.
- **Prevenção de Path Traversal**: Caminhos de arquivos temporários e downloads são normalizados e confinados estritamente dentro de `STORAGE_DIR`.
- **Rate Limiting**: Janela deslizante por IP para prevenir abuso nos endpoints de encurtamento, download e login administrativo.
- **Proteção de Privacidade (GDPR/LGPD)**: IPs de visitantes são anonimizados via hash criptográfico SHA-256 com salt antes do armazenamento.
- **Proteção de Credenciais**: Arquivos `.env` protegidos e ignorados pelo Git.

---

## 💻 Instalação e Execução no Fedora Linux

### Pré-requisitos no Fedora:
```bash
sudo dnf install -y nodejs npm ffmpeg python3 yt-dlp docker docker-compose
```

### Opção 1: Execução com Docker Compose (Recomendado para Produção)
Sobe toda a stack (Aplicação Next.js, PostgreSQL e Redis) com um único comando:

```bash
# 1. Clone o repositório e acesse a pasta
cd ~/Projetos/nova-short

# 2. Configure as variáveis de ambiente
cp .env.example .env

# 3. Suba os containers
docker compose up -d --build

# 4. A aplicação estará disponível em:
# http://localhost:3000
```

### Opção 2: Execução Nativa no Fedora (Desenvolvimento)
```bash
# 1. Instalar dependências
npm install

# 2. Gerar cliente do Prisma
npm run db:generate

# 3. Executar testes automatizados
npm test

# 4. Iniciar servidor de desenvolvimento
npm run dev

# Acesse no navegador: http://localhost:3000
```

---

## 📁 Estrutura do Projeto

```text
nova-short/
├── prisma/
│   └── schema.prisma         # Modelagem PostgreSQL (ShortLink, LinkClick, DownloadJob, AdminUser)
├── src/
│   ├── app/
│   │   ├── page.tsx          # Página Inicial com alternador Encurtador / Downloader
│   │   ├── encurtador/       # Página do Encurtador
│   │   ├── downloader/       # Página do Downloader
│   │   ├── historico/        # Histórico de Links e Downloads
│   │   ├── estatisticas/     # Dashboard analítico e rotas dinâmicas [slug]
│   │   ├── admin/            # Login e Painel Administrativo
│   │   ├── s/[slug]/         # Redirecionamento funcional e coleta de métricas
│   │   └── api/              # Endpoints REST (shorten, links, download, stats, admin)
│   ├── components/           # Componentes reativos (Forms, Charts, Modals, Navbar, Footer)
│   └── lib/
│       ├── security/         # SSRF validator, Rate limiter, Slug generator, Auth
│       ├── downloader/       # Extrator de metadados e conversor de mídia
│       ├── queue/            # Fila BullMQ com fallback assíncrono
│       ├── prisma.ts         # Singleton do Prisma ORM
│       └── redis.ts          # Conector Redis
├── tests/                    # Bateria de testes automatizados Vitest
├── docker-compose.yml        # Orquestração de containers (Next.js, Postgres, Redis)
├── Dockerfile                # Build multi-stage de produção
└── package.json
```

---

## 🧪 Testes Automatizados

Para executar os testes:
```bash
npm test
```
Resultados cobertos:
- Validação de endereços IP privados e bloqueio de SSRF.
- Geração e validação de slugs alfanuméricos e palavras reservadas.
- Limitação de taxa de requisições (Rate Limiter).
- Detecção e categorização de plataformas de mídia.

---

## 👤 Credenciais Padrão do Painel Administrativo

- **URL**: `http://localhost:3000/admin/login`
- **E-mail**: `admin@novaruntime.com`
- **Senha**: `admin_change_me_123` *(Altere no arquivo `.env` para produção)*

---

Desenvolvido para a **NOVA RUNTIME**.
