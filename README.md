<p align="center">
  <img src="https://raw.githubusercontent.com/BrunoRafa01/Nova-Short/main/docs/images/banner.png" alt="NOVA SHORT Banner" width="100%" />
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
  <img src="https://img.shields.io/badge/OWASP-Hardened-10B981?style=for-the-badge&logo=shield&logoColor=white" alt="Security" />
</p>

---

## 📑 Índice de Navegação

1. [Visão Geral & Proposta](#-visão-geral)
2. [Demonstração Visual & Telas do Sistema](#-demonstração-visual--telas-do-sistema)
3. [Funcionalidades Principais](#-funcionalidades-principais)
4. [Arquitetura da Solução](#-arquitetura-da-solução)
5. [Auditoria de Segurança & OWASP Top 10](#-auditoria-de-segurança--owasp-top-10)
6. [Compatibilidade Multiplataforma Certificada](#-compatibilidade-multiplataforma-certificada)
   - [Fedora Linux (Atenção Especial)](#-fedora-linux-atenção-especial)
   - [Ubuntu & Debian](#-ubuntu--debian)
   - [Windows 10 & 11](#-windows-10--windows-11)
   - [macOS](#-macos)
7. [Instalação e Execução](#-instalação-e-execução)
   - [Opção 1: Docker Compose (Recomendada)](#-opção-1-inicialização-com-docker-compose-recomendado)
   - [Opção 2: Execução Nativa](#-opção-2-execução-nativa-no-ambiente-local)
8. [Variáveis de Ambiente](#-variáveis-de-ambiente-env)
9. [Suíte de Testes & Validação](#-suíte-de-testes-automatizados)
10. [Diagnóstico de Ambiente](#-diagnóstico-automático-de-ambiente)
11. [Créditos e Licença](#-créditos-e-licença)

---

## 🚀 Visão Geral

O **NOVA SHORT** é uma solução de software como serviço (SaaS) desenvolvida para unir duas demandas fundamentais da web moderna em uma única plataforma enterprise:

1. **Encurtador Inteligente de URLs**: Redirecionamento instantâneo com suporte a slugs personalizados, controle rigoroso de validade temporal (expiração), proteção por senha via bcrypt, geração instantânea de QR Code vetorial e rastreamento de telemetria analítica com conformidade LGPD/GDPR (hash SHA-256 anônimo).
2. **Downloader de Mídia de Alta Fidelidade**: Extração e conversão segura de vídeo e áudio provenientes de YouTube, TikTok e Instagram, integrando o poder do `yt-dlp` e processamento de codecs H.264/AAC via `FFmpeg`, coordenados por filas assíncronas BullMQ sobre Redis.

Construído sob uma arquitetura resiliente no **Next.js 15 App Router** com tipagem estrita **TypeScript** e identidade visual exclusiva **Obsidian & Cyber Sapphire**, o sistema foi submetido a uma auditoria completa de segurança e validação multiplataforma com ênfase em **Fedora Linux**.

---

## 🌟 Demonstração Visual & Telas do Sistema

> Todas as imagens abaixo são capturas reais e atualizadas do sistema em execução na resolução de alta fidelidade.

### 1. Interface Principal & Encurtador Inteligente
> Design moderno em tema dark obsidian com alternador dinâmico de ferramentas, opções avançadas de slug customizado, expiração, proteção por senha e geração instantânea de QR Code com download em PNG.

<p align="center">
  <img src="https://raw.githubusercontent.com/BrunoRafa01/Nova-Short/main/docs/images/hero.png" alt="Tela Principal do Encurtador" width="95%" />
</p>

---

### 2. Downloader de Mídia Seguro (YouTube, TikTok, Instagram)
> Inspeção dinâmica com extração em tempo real de metadados (título, autor, thumbnail, duração), seletor de resolução (1080p Full HD, 720p HD, 480p SD) ou extração de áudio MP3 (320kbps e 192kbps), fila assíncrona BullMQ e barra de progresso em tempo real.

<p align="center">
  <img src="https://raw.githubusercontent.com/BrunoRafa01/Nova-Short/main/docs/images/downloader.png" alt="Downloader de Mídia" width="95%" />
</p>

---

### 3. Histórico Centralizado & Gerenciamento de Atividades
> Gestão completa dos links criados e mídias convertidas, visualização e download de QR Code, atalhos de cópia rápida e remoção protegida por controle de acesso administrativo.

<p align="center">
  <img src="https://raw.githubusercontent.com/BrunoRafa01/Nova-Short/main/docs/images/historico.png" alt="Histórico de Links e Downloads" width="95%" />
</p>

---

### 4. Telemetria & Estatísticas Analíticas
> Painel analítico com gráficos interativos que acompanham a evolução de cliques, distribuição por navegadores, tipos de dispositivos (Mobile, Desktop, Tablet) e origens de tráfego.

<p align="center">
  <img src="https://raw.githubusercontent.com/BrunoRafa01/Nova-Short/main/docs/images/estatisticas.png" alt="Estatísticas Analíticas" width="95%" />
</p>

---

### 5. Painel Administrativo com Acesso Protegido
> Autenticação segura via cookies HTTPOnly com JWT assinado (algoritmo HS256) e painel central para monitoramento de infraestrutura, volume de tráfego e integridade dos workers de conversão.

<p align="center">
  <img src="https://raw.githubusercontent.com/BrunoRafa01/Nova-Short/main/docs/images/admin-login.png" alt="Login Administrativo" width="95%" />
</p>

---

## ⚡ Funcionalidades Principais

| Módulo | Recursos Principais |
| :--- | :--- |
| **Encurtamento de Links** | Geração automática de slugs randômicos seguros (6 caracteres) ou personalizados, validação rigorosa de URL de destino contra SSRF, prazos de expiração configuráveis, criptografia de senha via bcrypt e criação instantânea de QR Code. |
| **Downloader de Vídeo & Áudio** | Detecção automática da plataforma de origem (YouTube, TikTok, Instagram), extração assíncrona com `yt-dlp`, normalização de codecs H.264 e AAC para compatibilidade universal em players de vídeo, suporte a resoluções até 1080p e conversão de áudio para MP3 (192kbps e 320kbps). |
| **Filas & Processamento em Segundo Plano** | Fila distribuída com BullMQ e Redis para processamento concorrente e não-bloqueante de conversões de mídia pesadas, com fallback em memória controlado para ambientes locais. |
| **Telemetria e Privacidade** | Coleta de métricas anônimas com hash salgado de IP (SHA-256) em estrita conformidade com LGPD/GDPR, identificação de navegador, dispositivo e referenciador. |
| **Controle de Acesso Administrativo** | Login restrito com proteção contra ataques de temporização (*timing attacks*) via `crypto.timingSafeEqual`, emissão de tokens JWT assinados armazenados em cookies `HttpOnly`, `SameSite=Lax` e `Secure`. |
| **Interface Moderna e Responsiva** | Design System exclusivo Obsidian & Cyber Sapphire, navegação móvel adaptativa com menu gaveta animado, estados de carregamento reativos e zero dependência de templates genéricos. |

---

## 🛡️ Auditoria de Segurança & OWASP Top 10

O NOVA SHORT foi projetado sob o princípio de **Secure by Design**. A tabela abaixo detalha as proteções implementadas contra os principais vetores de vulnerabilidade:

| Vetor de Ataque | Status | Mecanismo de Proteção Implementado |
| :--- | :---: | :--- |
| **Server-Side Request Forgery (SSRF)** | **Mitigado** | Resolução DNS de hostnames com bloqueio de endereços IPv4 e IPv6 privados (RFC 1918, RFC 3927, Loopback `127.0.0.1`, ULA, link-local, metadados de nuvem `169.254.169.254` e IPv4-mapped IPv6). Bloqueio de esquemas perigosos (`file:`, `data:`, `javascript:`, `about:`). |
| **Remote Code Execution (RCE) / Command Injection** | **Mitigado** | Execução de binários externos (`yt-dlp`, `ffmpeg`) estritamente via `child_process.execFile` sem inicialização de shell. Enforço de argumento delimitador `--` antes da URL do usuário para impedir injeção de flags maliciosas. |
| **Path Traversal / Arbitrary File Read** | **Mitigado** | Validação rígida de identificadores de download com expressão regular UUID v4 (`/^[0-9a-fA-F-]{36}$/`). Verificação determinística de prefixo de diretório com `path.resolve` sobre `STORAGE_DIR`. |
| **Cross-Site Scripting (XSS)** | **Mitigado** | Escape estruturado de HTML (`escapeHtml`) em todas as páginas de status e redirecionamento, renderização reativa segura em React 19 e Content-Security-Policy (CSP) estrito. |
| **Cross-Site Request Forgery (CSRF)** | **Mitigado** | Cookies de sessão administrativa configurados com atributo `SameSite=Lax`, validação de cabeçalhos de origem (`Origin` e `Referer`) em operações mutantes. |
| **SQL Injection (SQLi)** | **Mitigado** | Todas as interações com a base de dados PostgreSQL são mediadas pelo **Prisma ORM**, utilizando consultas parametrizadas e tipagem estrita de schemas sem interpolação de strings em consultas cruas. |
| **Quebra de Autenticação & Timing Attacks** | **Mitigado** | Comparação em tempo constante através de `crypto.timingSafeEqual` sobre digests SHA-256 no login administrativo. Senhas de links e administradores criptografadas com `bcryptjs` (custo 12). |
| **IDOR (Insecure Direct Object References)** | **Mitigado** | Rotas de exclusão e mutação de links (`DELETE /api/links/[id]`) exigem sessão administrativa autenticada via cookie assinado. |
| **Rate Limiting & Ataques de Força Bruta** | **Mitigado** | Limitador de taxa baseado em janela deslizante por endereço IP via Redis com fallback em memória, limitando requisições em rotas críticas (`/api/shorten`, `/api/download/start`, `/api/admin/login`). |
| **Segurança de Cabeçalhos HTTP** | **Mitigado** | `Strict-Transport-Security` (HSTS), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` e CSP robusto configurados globalmente no `next.config.ts`. |
| **Exposição de Segredos** | **Mitigado** | Arquivo `.gitignore` rigoroso impedindo envio de arquivos `.env`, chaves `.pem`, certificados ou logs. Remoção de dados sensíveis e hashes nas respostas da API pública. |

---

## 🏗️ Arquitetura da Solução

```mermaid
flowchart TD
    Client["Navegador / Dispositivo Cliente"] -->|HTTP/S com Headers de Segurança| App["Next.js 15 App Router"]
    
    subgraph Security ["Camada de Blindagem & Segurança"]
        SSRF["Escudo SSRF (Filtro RFC1918 / IPv6 / DNS Lookup)"]
        RateLimit["Rate Limiter (Janela Deslizante Redis/Memória)"]
        AuthShield["Auth Shield (JWT HS256 + Timing Safe Compare)"]
    end
    
    App --> SSRF
    SSRF --> RateLimit
    RateLimit --> AuthShield
    
    subgraph CoreEngine ["Motores de Negócio"]
        ShortenerEngine["Motor de Encurtamento, QR Code & Slugs"]
        DownloaderEngine["Extrator yt-dlp & Transcoder FFmpeg"]
    end
    
    AuthShield --> ShortenerEngine
    AuthShield --> DownloaderEngine
    
    subgraph DataStorage ["Persistência & Filas"]
        Postgres[("PostgreSQL 16\n(Links, Cliques, Jobs via Prisma)")]
        RedisQueue[("Redis 7\n(Filas BullMQ & Cache de Rate Limit)")]
        DiskStorage[("Storage Local Isolado\n(Mídias Temporárias com TTL)")]
    end
    
    ShortenerEngine --> Postgres
    ShortenerEngine --> RedisQueue
    DownloaderEngine --> RedisQueue
    DownloaderEngine --> DiskStorage
    DownloaderEngine --> Postgres
```

---

## 💻 Compatibilidade Multiplataforma Certificada

O sistema é 100% agnóstico de sistema operacional e foi testado e validado nas principais plataformas:

### 🔵 Fedora Linux (Atenção Especial)
O ambiente oficial de referência deste repositório é o **Fedora Linux**.

1. **Instalação de pré-requisitos via `dnf`**:
```bash
sudo dnf install -y nodejs npm ffmpeg python3 yt-dlp docker docker-compose
```

2. **Verificação do ambiente no Fedora**:
```bash
npm run env:check
```

3. **Codecs no Fedora (RPM Fusion)**:
Caso necessite de suporte ampliado a formatos proprietários no sistema operacional:
```bash
sudo dnf install https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm
sudo dnf install https://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
sudo dnf install -y ffmpeg ffmpeg-libs
```

---

### 🟠 Ubuntu & Debian
```bash
# 1. Dependências do sistema
sudo apt-get update
sudo apt-get install -y nodejs npm ffmpeg python3 curl

# 2. Instalar versão mais recente do yt-dlp
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

---

### 🟦 Windows 10 & Windows 11
O projeto trata caminhos de arquivo via `path.join`/`path.resolve` e detecta automaticamente os executáveis `yt-dlp.exe` e `ffmpeg.exe`:

1. **Instalação via Winget (Prompt de Comando ou PowerShell)**:
```powershell
winget install OpenJS.NodeJS.LTS
winget install Gyan.FFmpeg
winget install yt-dlp.yt-dlp
winget install Docker.DockerDesktop
```

2. **Instalação via Chocolatey**:
```powershell
choco install nodejs-lts ffmpeg yt-dlp
```

---

### 🍏 macOS
Totalmente compatível com processadores Apple Silicon (M1/M2/M3/M4) e Intel:

```bash
brew install node ffmpeg yt-dlp python3
```

---

## 🚀 Instalação e Execução

### 🐳 Opção 1: Inicialização com Docker Compose (Recomendado)
Sobe a aplicação completa com PostgreSQL 16, Redis 7 e Next.js com isolamento total em containers:

```bash
# 1. Clonar o repositório
git clone git@github.com:BrunoRafa01/Nova-Short.git
cd Nova-Short

# 2. Configurar as variáveis de ambiente
cp .env.example .env

# 3. Construir e iniciar os containers
docker compose up -d --build

# 4. Acessar a aplicação
# Interface Web: http://localhost:3000
```

---

### 💻 Opção 2: Execução Nativa no Ambiente Local

```bash
# 1. Instalar as dependências do projeto
npm install

# 2. Configurar o arquivo de ambiente
cp .env.example .env

# 3. Gerar o cliente Prisma
npm run db:generate

# 4. Aplicar o schema no banco de dados (quando PostgreSQL estiver ativo)
npm run db:push

# 5. Executar o script de diagnóstico de compatibilidade
npm run env:check

# 6. Executar os testes automatizados
npm test

# 7. Iniciar o servidor de desenvolvimento
npm run dev
# Ou para produção:
npm run build && npm start
```

---

## ⚙️ Variáveis de Ambiente (`.env`)

Copie o arquivo `.env.example` para `.env` e configure os parâmetros:

| Variável | Padrão Recomendado | Descrição |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | URL canônica da aplicação para montagem dos links curtos. |
| `NODE_ENV` | `development` / `production` | Ambiente de execução da aplicação. |
| `DATABASE_URL` | `postgresql://user:pass@localhost:5432/nova_short?schema=public` | String de conexão JDBC/Prisma com o PostgreSQL. |
| `REDIS_URL` | `redis://localhost:6379` | String de conexão com a instância Redis para BullMQ e rate limit. |
| `JWT_SECRET` | *(Chave segura >= 32 caracteres)* | Segredo criptográfico para assinatura e verificação de tokens JWT. |
| `ADMIN_DEFAULT_EMAIL` | `admin@novaruntime.com` | E-mail administrativo inicial para acesso ao painel. |
| `ADMIN_DEFAULT_PASSWORD` | *(Defina uma senha forte)* | Senha para login inicial no painel administrativo. |
| `STORAGE_DIR` | `./storage/downloads` | Diretório isolado para armazenamento temporário das mídias baixadas. |
| `DOWNLOAD_MAX_FILE_SIZE_MB` | `250` | Limite máximo em megabytes para arquivos processados. |
| `RATE_LIMIT_SHORTEN_PER_MIN` | `30` | Limite de encurtamentos por minuto por IP. |
| `RATE_LIMIT_DOWNLOAD_PER_MIN` | `10` | Limite de downloads iniciados por minuto por IP. |

> **IMPORTANTE:** Nunca comite arquivos `.env` com dados de produção. O `.gitignore` do projeto já está configurado para proteger todos os arquivos de variáveis de ambiente.

---

## 🧪 Suíte de Testes Automatizados

O projeto utiliza **Vitest** com testes unitários e de integração de alta velocidade:

```bash
npm test
```

Saída de execução verificada:
```text
 ✓ tests/slug.test.ts (4 tests)
 ✓ tests/downloader.test.ts (5 tests)
 ✓ tests/ssrf.test.ts (7 tests)
 ✓ tests/rate-limiter.test.ts (2 tests)
 ✓ tests/auth-security.test.ts (7 tests)

Test Files  5 passed (5)
Tests       25 passed (25)
Duration    1.36s
```

---

## 🔍 Diagnóstico Automático de Ambiente

Para verificar se o seu sistema operacional atende a todos os requisitos necessários para execução plena do downloader e do encurtador, execute:

```bash
npm run env:check
```

Saída de diagnóstico (executada em Fedora Linux):
```text
🔍 Verificando Compatibilidade do Ambiente Multiplataforma — NOVA SHORT

  ✅ [OK] Sistema Operacional: Fedora Linux 44 (linux x64)
  ✅ [OK] Runtime Node.js: v22.23.4
  ✅ [OK] Extrator yt-dlp: /usr/bin/yt-dlp (v2026.08.19)
  ✅ [OK] Processador FFmpeg: /usr/bin/ffmpeg (version 8.1.3)
  ✅ [OK] Interpretador Python 3: /usr/bin/python3 (Python 3.14.8)
  ✅ [OK] Permissão de Escrita no Storage: ./storage/downloads (leitura/escrita OK)

✨ Relatório de Diagnóstico Concluído com Sucesso!
```

---

## 🔑 Acesso Administrativo Inicial

1. Navegue até `http://localhost:3000/admin/login`.
2. Informe o e-mail definido na variável `ADMIN_DEFAULT_EMAIL`.
3. Informe a senha definida na variável `ADMIN_DEFAULT_PASSWORD`.
4. Uma vez logado, você terá acesso à telemetria global, monitoramento das filas de download e gerenciamento de links ativos.

---

## 📄 Créditos e Licença

Desenvolvido para o ecossistema **NOVA RUNTIME**.  
Autor: **Bruno Rafa** ([@BrunoRafa01](https://github.com/BrunoRafa01))

Distribuição sob licença de portfólio e software de demonstração profissional. Consulte o autor para termos de uso comercial.
