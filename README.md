<p align="center">
  <img src="docs/images/banner.svg" alt="NOVA SHORT Banner" width="100%" />
</p>

<p align="center">
  <strong>Plataforma SaaS Profissional de Encurtamento Inteligente de Links &amp; Downloader de Mídia de Alta Performance</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-7.0-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/BullMQ-Asynchronous-E34F26?style=for-the-badge&logo=rabbitmq&logoColor=white" alt="BullMQ" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Fedora_Linux-Tested-51A2DA?style=for-the-badge&logo=fedora&logoColor=white" alt="Fedora" />
</p>

---

## 🌟 Demonstração Visual & Telas do Sistema

### 1. Interface Principal & Encurtador Inteligente
> Experiência dark futurista com alternador de ferramentas, suporte a slug personalizado, prazos de expiração, proteção por senha e geração instantânea de QR Code com download em PNG.

<p align="center">
  <img src="docs/images/hero.png" alt="Tela Principal do Encurtador" width="92%" style="border-radius: 12px; border: 1px solid #1E293B;" />
</p>

---

### 2. Downloader de Mídia Seguro (YouTube, TikTok, Instagram)
> Inspeção dinâmica com extração em tempo real de metadados (título, autor, thumbnail, duração), seletor de resolução (1080p, 720p, 480p) ou extração de áudio MP3 (320kbps e 192kbps), fila assíncrona BullMQ e barra de progresso em tempo real.

<p align="center">
  <img src="docs/images/downloader.png" alt="Downloader de Mídia" width="92%" style="border-radius: 12px; border: 1px solid #1E293B;" />
</p>

---

### 3. Histórico Centralizado & Gerenciamento de Links
> Gestão completa dos links criados, contagem de cliques, atalho para visualização do QR Code, cópia rápida para área de transferência e remoção segura.

<p align="center">
  <img src="docs/images/historico.png" alt="Histórico de Links" width="92%" style="border-radius: 12px; border: 1px solid #1E293B;" />
</p>

---

### 4. Telemetria & Estatísticas Analíticas
> Métricas com gráficos interativos que acompanham a evolução de cliques diários, distribuição por navegadores, tipos de dispositivos (Mobile, Desktop, Tablet) e origens de tráfego.

<p align="center">
  <img src="docs/images/estatisticas.png" alt="Estatísticas Analíticas" width="92%" style="border-radius: 12px; border: 1px solid #1E293B;" />
</p>

---

### 5. Painel Administrativo com Acesso Protegido
> Autenticação segura via cookies HTTPOnly com JWT assinado e painel central para monitoramento de infraestrutura, volume de tráfego e integridade dos workers de conversão.

<p align="center">
  <img src="docs/images/admin-login.png" alt="Login Administrativo" width="92%" style="border-radius: 12px; border: 1px solid #1E293B;" />
</p>

---

## ⚡ Arquitetura da Solução

```mermaid
flowchart TD
    Client["Navegador / Dispositivo"] -->|HTTP/S| App["Next.js 15 App Router"]
    
    subgraph Core ["NOVA SHORT Core Engine"]
        SSRF["Escudo SSRF & Sanitizer"]
        RateLimit["Rate Limiter (Sliding Window)"]
        ShortenerEngine["Motor de Encurtamento & QR Code"]
        DownloaderEngine["Extrator yt-dlp & FFmpeg"]
    end
    
    App --> SSRF
    SSRF --> RateLimit
    RateLimit --> ShortenerEngine
    RateLimit --> DownloaderEngine
    
    subgraph Data ["Camada de Dados & Filas"]
        Postgres[("PostgreSQL 16\n(Prisma ORM)")]
        RedisQueue[("Redis 7\n(BullMQ & Cache)")]
        DiskStorage[("Storage Local Isolado\n(Downloads TTL)")]
    end
    
    ShortenerEngine --> Postgres
    ShortenerEngine --> RedisQueue
    DownloaderEngine --> RedisQueue
    DownloaderEngine --> DiskStorage
    DownloaderEngine --> Postgres
```

---

## 🛡️ Pilares de Segurança & Compliance

| Mecanismo de Segurança | Implementação | Proteção Contra |
| :--- | :--- | :--- |
| **Filtro SSRF Rigoroso** | `src/lib/security/ssrf.ts` | Bloqueia loopback (`127.0.0.1`), RFC 1918 (`10.x`, `172.16.x`, `192.168.x`) e metadados de nuvem (`169.254.169.254`). |
| **Imunidade a Command Injection** | `src/lib/downloader/extractor.ts` | Uso estrito de `child_process.execFile` com array de argumentos, sem interpolação de shell. |
| **Prevenção de Path Traversal** | `src/lib/downloader/extractor.ts` | Normalização e verificação de limites de diretório em `STORAGE_DIR`. |
| **Anonimização LGPD/GDPR** | `src/app/s/[slug]/route.ts` | Endereços IP de visitantes recebem hash SHA-256 com salt antes do registro de telemetria. |
| **Limitação de Taxa (Rate Limit)** | `src/lib/security/rate-limiter.ts` | Limite de requisições por janela deslizante por IP via Redis com fallback em memória. |
| **Compliance de Direitos Autorais** | Termos & Isolamento | Focado em conteúdos autorizados e próprios; não burla DRM ou acessos protegidos. |

---

## 🚀 Instalação e Execução

### Pré-requisitos (Fedora Linux):
```bash
sudo dnf install -y nodejs npm ffmpeg python3 yt-dlp docker docker-compose
```

### 🐳 Opção 1: Inicialização com Docker Compose (Recomendado)
Sobe a aplicação completa com PostgreSQL 16 e Redis 7 com isolamento total em containers:

```bash
# 1. Clone o repositório
git clone git@github.com:BrunoRafa01/Nova-Short.git
cd Nova-Short

# 2. Configure as variáveis de ambiente
cp .env.example .env

# 3. Suba todos os serviços
docker compose up -d --build

# Acesse: http://localhost:3000
```

### 💻 Opção 2: Execução Nativa no Fedora (Desenvolvimento)
```bash
# 1. Instalar dependências
npm install

# 2. Gerar Prisma Client
npm run db:generate

# 3. Executar bateria de testes automatizados
npm test

# 4. Iniciar servidor Next.js
npm run dev
```

---

## ⚙️ Variáveis de Ambiente (`.env`)

| Variável | Padrão | Descrição |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | URL pública da aplicação para composição dos links curtos. |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/nova_short` | String de conexão do PostgreSQL. |
| `REDIS_URL` | `redis://localhost:6379` | String de conexão do Redis para o BullMQ e cache. |
| `JWT_SECRET` | *(Chave segura)* | Chave de assinatura dos tokens JWT da administração. |
| `ADMIN_DEFAULT_EMAIL` | `admin@novaruntime.com` | E-mail administrativo padrão do sistema. |
| `ADMIN_DEFAULT_PASSWORD` | `admin_change_me_123` | Senha administrativa padrão inicial. |
| `STORAGE_DIR` | `./storage/downloads` | Diretório isolado para processamento temporário de mídias. |
| `DOWNLOAD_MAX_FILE_SIZE_MB`| `250` | Tamanho máximo permitido para processamento de arquivo em MB. |

---

## 🧪 Suíte de Testes Automatizados

O projeto conta com testes unitários e de integração desenvolvidos com **Vitest**:

```bash
npm test
```

Saída da verificação:
```text
 ✓ tests/slug.test.ts (4 tests)
 ✓ tests/downloader.test.ts (4 tests)
 ✓ tests/ssrf.test.ts (6 tests)
 ✓ tests/rate-limiter.test.ts (2 tests)

Test Files  4 passed (4)
Tests       16 passed (16)
Duration    565ms
```

---

## 🔑 Acesso Administrativo Inicial

- **URL**: `http://localhost:3000/admin/login`
- **E-mail**: `admin@novaruntime.com`
- **Senha**: `admin_change_me_123`

---

## 📄 Licença e Créditos

Desenvolvido com excelência técnica para o ecossistema **NOVA RUNTIME**.  
Autor: **Bruno Rafa** ([@BrunoRafa01](https://github.com/BrunoRafa01))
