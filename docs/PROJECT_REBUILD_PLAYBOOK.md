# Projeto Vertex US — Playbook de Reconstrução Completa

Guia operacional para reconstruir o ambiente do frontend Vertex US (Vite/React) + integrações de IA/streaming a partir do zero. Utilize este playbook junto com `CLAUDE.md`, `docs/DIRETRIZES_EXAMES.md` e a pasta `docs/streaming*` para detalhes complementares.

---

## 1. Visão Geral

| Item | Valor |
|------|-------|
| Frontend | Vite + React + Tailwind (TypeScript) |
| Porta Dev | `8198` (Vite) |
| Porta Pública | `8199` (Apache HTTPS → proxy p/ `127.0.0.1:8198`) |
| Streaming IA | Gemini via proxy `https://ultrassom.ai:8177/geminiCall` |
| Serviço local | `ultrassom-vite.service` (systemd) |
| Node | 20.x LTS |
| NPM | 10.x |
| Repositório | `git@github.com:Anderson-Barcellos/Vertex.git` |

---

## 2. Pré-Requisitos do Servidor

```bash
sudo apt update
sudo apt install -y build-essential curl git apache2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v && npm -v
```

- Certifique-se de que Apache possui `proxy`, `proxy_http`, `ssl`, `rewrite`, `headers` habilitados.
- Para streaming Gemini, confirme que a porta 8177 está roteando para o backend Python (ver `docs/STREAMING_FLOW.md`).

---

## 3. Clonagem e Instalação

```bash
git clone git@github.com:Anderson-Barcellos/Vertex.git
cd Vertex
npm install
```

### Variáveis de Ambiente (arquivo `.env.local`)

```
VITE_GEMINI_API_URL=/api/gemini
VITE_GEMINI_MODEL=gemini-2.5-pro
VITE_OPENAI_API_URL=/api/openai
VITE_OPENAI_MODEL=gpt-5-nano
```

- As chaves reais são gerenciadas pelo backend proxy. Somente os endpoints acima precisam existir.
- Toda nova página de exame deve seguir o checklist em `docs/DIRETRIZES_EXAMES.md`.

---

## 4. Execução Local (Desenvolvimento)

```bash
npm run dev -- --host 0.0.0.0 --port 8198 --strictPort
```

- Acesse `http://localhost:8198`.
- Apache pode servir a mesma build via `https://localhost:8199` (virtual host `vite-8137.conf` → `127.0.0.1:8198`).
- Utilize `npm run build` para gerar a pasta `dist/` (deploy estático).

### Serviço systemd

Arquivo: `/etc/systemd/system/ultrassom-vite.service`

```
[Unit]
Description=Ultrassom.ai Vite Dev Server
After=network.target

[Service]
Type=simple
WorkingDirectory=/root/PROJECT
User=root
Environment=NODE_ENV=development
Environment=PROJECT_ROOT=/root/PROJECT
Environment=HOST=0.0.0.0
Environment=PORT=8198
ExecStart=/usr/bin/npm run dev
Restart=always
RestartSec=5
KillSignal=SIGINT
TimeoutStopSec=20

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now ultrassom-vite.service
```

Verifique com `systemctl status ultrassom-vite.service`.

---

## 5. Proxy Apache (Resumido)

Arquivo ativo: `/etc/apache2/sites-enabled/vite-8137.conf`

```
<VirtualHost *:8199>
    ServerName ultrassom.ai
    SSLEngine On
    SSLCertificateFile /etc/letsencrypt/live/ultrassom.ai/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/ultrassom.ai/privkey.pem

    ProxyPreserveHost On
    RequestHeader set X-Forwarded-Proto "https"
    ProxyPass / http://127.0.0.1:8198/
    ProxyPassReverse / http://127.0.0.1:8198/

    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} =websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/(.*)$ ws://127.0.0.1:8198/$1 [P,L]
</VirtualHost>

Listen 8199 https
```

- Após ajustes rode `sudo apachectl configtest` e `sudo systemctl reload apache2`.
- Consulte `docs/APACHE_CONFIG_FINAL.md` para o mapeamento completo de virtual hosts.

---

## 6. Streaming Gemini / OpenAI

1. Backend Python deve expor o endpoint `/geminiCall` na porta 8177 (ver `docs/STREAMING_FLOW.md`).
2. Vite usa proxy definido em `vite.config.ts` (`/api/gemini` → `https://ultrassom.ai:8177`).
3. Para reconstruir o backend streaming consulte `docs/IMPLEMENTATION_STREAMING.md` + systemd do serviço Python.
4. OpenAI segue a mesma rota, bastando definir `VITE_OPENAI_API_URL` se ativo.

---

## 7. Layout & Guidelines

- Toda página de exame deve usar o layout centralizado descrito em `docs/DIRETRIZES_EXAMES.md`.
- Para campos específicos (ex.: Doppler de Carótidas) consulte a seção “Regras Específicas por Exame” no mesmo documento.
- Antes de abrir PR, confira `SelectedFindingsPanel` e `ReportCanvas` para garantir exibição do campo novo.

---

## 8. QA Rápido Pós-Reconstrução

1. `npm run dev` responde em `http://localhost:8198`.
2. `https://localhost:8199` espelha o conteúdo (via Apache).
3. `systemctl status ultrassom-vite.service` → ativo.
4. `curl -sk https://localhost:8199` retorna `200 OK`.
5. Testar exame Abdome + Carótidas:
   - Sidebar fixa sem wrap.
   - Painéis adaptam-se à altura (sem scrollbar interno).
   - Campos específicos (VPS, EMI, etc.) aparecem em “Achados Selecionados”.
6. Streaming Gemini:
   - Gatilho via UI (“Gerar IA”) mostra texto progressivo.
   - Cancelamento funciona (`AbortSignal`).

---

## 9. Recursos úteis

- `CLAUDE.md` – História das refatorações e links críticos.
- `docs/DIRETRIZES_EXAMES.md` – Checklist de layout/campos para novas páginas.
- `docs/APACHE_CONFIG_FINAL.md` – Estado atual dos virtual hosts.
- `docs/STREAMING_FLOW.md` / `docs/IMPLEMENTATION_STREAMING.md` – Toda a pipeline de IA.
- `docs/PROJECT_REBUILD_PLAYBOOK.md` (este arquivo) – Colado em runbooks/ops.

Mantenha este documento atualizado sempre que:
- Novos serviços systemd forem criados/modificados.
- Portas ou domínios mudarem.
- Workflow de build/deploy ganhar passos adicionais.
- Diretrizes de layout receberem atualização relevante.

