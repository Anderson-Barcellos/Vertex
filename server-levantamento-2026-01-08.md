# Levantamento de Serviços, Portas e Apache2 — 08/01/2026

## 1. Visão geral do host
- Sistema: Ubuntu 24.10 (kernel 6.11.0-29-generic), virtualização KVM.
- Uptime: ~12 semanas.
- Disco raiz: 193G (38% usado). Memória: 15Gi (7.0Gi usados, 3.6Gi livres). Swap: 8Gi (6.3Gi usados).

## 2. Portas em escuta (ss -tulnp)
### Expostas em 0.0.0.0 / :: (acesso externo)
- 22/tcp `sshd`
- 25/tcp `postfix`
- 80/tcp, 443/tcp `apache2` (reverse proxy principal)
- 8177/tcp `apache2` (proxy TLS Gemini API)
- 5001/tcp `docker-proxy` (container transcription-frontend →5000)
- 4242/tcp, 8042/tcp `docker-proxy` (Orthanc)
- 5002/tcp `node` (ultrassom-vite.service)
- 8001/tcp `python3` (Laudos API)
- 8112/tcp `node` (Mood Pharma frontend)
- 8113/tcp `node` (Mood Pharma API)
- 8176/tcp `python` (Gemini API backend)
- 8200/tcp `node` (Vertex V2 dev)
- 8201/tcp `node` (Vertex V2 HMR)
- 8850/tcp `node` (Speech service)
- 3000/3003/3004/3010/3020/3021/3100/32845/33979/36745/36955/37071/37527/37657/37717/38333/38715/38769/38809/39589/39787/41261/42129/44111/44307/45675/46231/46547 `node` (diversos servidores Vite/Express e tooling dev expostos)

### Restritas a loopback (127.0.0.1)
- 5432/tcp PostgreSQL
- 8285/tcp Code Server (VS Code Web)
- 45137, 38871, 43255, 46621, 45709, 53847, 36893, 38995, 34601 (language servers / tooling)

### UDP
- 53/udp `systemd-resolve` em 127.0.0.53 e 127.0.0.54

## 3. Serviços systemd em execução (amostra)
- `apache2.service` — HTTP reverse proxy (80/443) e porta 8177.
- `postgresql@15-main.service` — banco local (5432 loopback).
- `docker.service`, `containerd.service` — runtime containers.
- `fail2ban.service` — ativo.
- `postfix@-.service` — MTA ouvindo 25/tcp público.
- Frontends/Backends Node (ports principais):
  - `vertex-v2.service` — Vite/Node (8200/8201).
  - `ultrassom-vite.service` — porta 5002.
  - `mood-pharma-tracker.service` (8112), `mood-pharma-api.service` (8113).
  - `stt.service` — 3000 (frontend) + 3003 (API).
  - `cogniread.service` — 3010 (auth básica via Apache).
  - `raven-matrices.service` — 3004.
  - `chathub.service` (3020) e `chathub-api.service` (3021).
- `gemini-api.service` — backend 8176 (proxiado em 8177 TLS, Python).
- `webapp-ultrassom.service` — porta não confirmada (possivelmente frontend Node).
- Outros serviços de aplicação:
  - `laudos` API (FastAPI) na porta 8001.
  - Ultrassom API referenciada no Apache em 8102 (não havia listener na coleta).
- Outros: `vscode-web-8285.service`, `qemu-guest-agent.service`, `fwupd`, `unattended-upgrades`.

## 4. Containers Docker (docker ps)
- `orthanc-server` — Ports 4242/tcp, 8042/tcp (expostos 0.0.0.0). Saúde OK.
- `transcription-backend` — sem portas publicadas (usa rede interna?).
- `transcription-frontend` — 5001->5000/tcp mapeado público.
- `postgres-orthanc` — 5432 interno (não exposto).

## 5. Apache2 — portas, vhosts e regras
- Listen: 80 (HTTP), 443 (HTTPS), 8177 (Gemini API TLS proxy). Fonte: `/etc/apache2/ports.conf`.
- VHosts ativos (`apache2ctl -S`):
  - `ultrassom.ai` :80 (redirect→443) e :443 (principal).
  - `vertex.ultrassom.ai` :80→443 redirect, :443 proxy para 8201.
  - `ultrassom.ai` :8177 proxy dedicado Gemini API.
- Módulos carregados (`apache2ctl -M`): proxy (http/wstunnel/html), ssl, rewrite, headers, deflate, cache/cache_disk, ratelimit, macro, oauth2, php, status, etc. MPM: prefork.
- Arquivo principal: `/etc/apache2/sites-available/ultrassom.ai-optimized.conf` (~1000 linhas). Principais blocos/proxies:
  - Redireciona HTTP→HTTPS; HSTS e CSP global (upgrade-insecure-requests, default-src self+https, scripts/styles com unsafe-inline/eval permitido).
  - WebSocket rewrites para Vite HMR (/laudos, /mood, /chathub, /stt, /cogniread, /raven, /terminal, /portainer, /code, Orthanc, etc.).
  - Frontend laudos estático `/laudos` (alias /var/www/ultrassom-laudos) com cache agressivo para assets.
  - APIs laudos: `/laudos-api/v2` e `/laudos-api` → http://localhost:8001 (FastAPI). Limite 10MB; cache de proxy habilitado (CacheEnable disk /laudos-api/).
  - Ultrassom AI APIs: `/api/transcribe`, `/api/generate-report`, `/api/generate-report-openai` → http://localhost:8102.
  - Speech service `/speech` → http://localhost:8850.
  - STT app `/stt` → front 3000, API 3003; limita upload a 50MB.
  - Mood Pharma `/mood` → front 8112, API 8113.
  - ChatHub `/chathub` → front 3020, API 3021.
  - CogniRead `/cogniread` → front 3010; exige Basic Auth via `/etc/apache2/.htpasswd-cogniread`.
  - Raven `/raven` → front 3004.
  - WebSSH `/terminal` → front 3030, backend 3100 (socket.io), com WebSocket.
  - OHIF `/ohif` → 3005 (Docker) e Orthanc endpoints `/dicom-web`, macros Orthanc REST e `/orthanc/` UI → 8042; integra script `/orthanc-ohif-integration.js`.
  - Portainer `/portainer` → 9000.
  - VS Code Web `/code/` → 127.0.0.1:8285 com Basic Auth (`.htpasswd_codeserver`), CSP custom permissiva, remove X-Frame-Options, força Secure nos cookies.
  - DICOM files `/dicom-files` (alias /root/CLAUDE/Dicom-PDF/Users) com Basic Auth (`.htpasswd-medical`) e cache privado.
  - Maintenance flag: se `/var/www/maintenance.enable` existir, retorna `/maintenance.html` 503.
  - Logs: `ultrassom_ssl_error.log`, `ultrassom_ssl_access.log`; logs HTTP 80 separados.
- Subdomínio `vertex.ultrassom.ai` (`/etc/apache2/sites-available/vertex.ultrassom.ai.conf`): proxy raiz → http://localhost:8201, websocket upgrade, HSTS, cabeçalhos de segurança básicos, redireciona :80→:443.
- Gemini API (`/etc/apache2/sites-available/gemini-api.conf`): vhost :8177 com TLS (cert ultrassom.ai) proxiando para 127.0.0.1:8176; inclui endpoints /geminiCall, /openaiCall, /claudeCall e WebSocket; headers básicos.
- Documentação local: `/etc/apache2/APACHE.md` (atualizado 2026-01-04) descreve mapa de serviços, portas reservadas e scripts `check-port.sh`.

## 6. Firewall
- `ufw` não instalado.
- `iptables -L -n`: política INPUT=ACCEPT; regras explícitas mínimas (ACCEPT 22/tcp; DROP para IP 13.115.183.227; chains DOCKER* presentes com várias DROP genéricas). Superfície ampla por default.

## 7. Pacotes pendentes (apt list --upgradable)
- libpq5 17.5 → 18.1 (PGDG 22.04 repo)
- postgresql-15, postgresql-client-15, postgresql-common (várias) — updates disponíveis (PGDG jammy em host 24.10).

## 8. Timers relevantes (systemd list-timers)
- `certbot.timer` diário (última execução 12:06 hoje).
- `sysstat-*`, `logrotate`, `fwupd-refresh`, `update-notifier-download`, `apt-daily*` ativos.
- `vscode-web-8285-keepalive.timer`, `sonaris-sync.timer` etc. em poucos minutos intervalares.

## 9. Observações rápidas (sem mudanças aplicadas)
- Muitas portas Node/Python expostas em 0.0.0.0; depender do Apache como proxy seria mais seguro se mover para loopback.
- Firewall permissivo (INPUT ACCEPT) aumenta superfície de ataque; hardening recomendado.
- OS 24.10 está EOL desde jul/2025; planejar migração para 24.04 LTS ou 25.04 quando disponível.
- Swap alto (6.3/8 GiB) sugere pressão de RAM; revisar carga dos múltiplos Vite/Node dev servers.
