# 📋 Documentação Final - Configurações Apache Ativas

**Data:** 21 de Outubro de 2025  
**Status:** ✅ Sistema Otimizado e Funcional  
**Responsável:** Anders + Claude

---

## 📊 Resumo Executivo

Após limpeza completa de configurações legadas e redundantes, o sistema Apache agora possui **apenas 6 VirtualHosts ativos**, cada um dedicado a uma função específica:

- ✅ **1 Configuração Principal** (ultrassom.ai) com múltiplos proxies integrados
- ✅ **5 Configurações Especializadas** para serviços específicos
- ✅ **Todas testadas e funcionando corretamente**
- ✅ **SSL/TLS com Let's Encrypt**
- ✅ **Todos os backends conectados e respondendo**

---

## 🗂️ VirtualHosts Ativos - Tabela Completa

| # | Nome do Arquivo | Porta(s) | Destino Backend | Status | Notas |
|---|---|---|---|---|---|
| 1 | `ultrassom.ai-optimized.conf` | 80 / 443 | Múltiplos (veja abaixo) | ✅ Funcionando | **Principal - Todas as rotas** |
| 2 | `code-server.conf` | 8150 | `127.0.0.1:8180` | ✅ Funcionando | Editor VS Code com autenticação |
| 3 | `gemini-api.conf` | 8177 | `127.0.0.1:8176` | ✅ Funcionando | API Gemini/OpenAI - Streaming |
| 4 | `vite-8137.conf` | 8199 | `127.0.0.1:8198` | ✅ Funcionando | Vite Dev Server + HMR WebSocket |
| 5 | `voice-notes.ultrassom.ai.conf` | 8101 | `127.0.0.1:8110` | ✅ Funcionando | Transcrição e geração de laudos |
| 6 | `webapp-ultrassom.conf` | 8100 | `localhost:8102` | ✅ Funcionando | Webapp Backend - APIs de laudos |

---

## 🎯 Configuração Principal (ultrassom.ai-optimized.conf)

Esta é a **configuração mais importante** - agrupa múltiplos serviços:

### Portas
- **80 (HTTP)** → Redireciona para 443 HTTPS
- **443 (HTTPS)** → Proxy principal com roteamento inteligente

### Rotas de Proxy Ativas

| Rota | Backend | Tipo | SSL Propagado | CORS |
|---|---|---|---|---|
| `/laudos` | `/var/www/ultrassom-laudos` | Estático + SPA | ✅ Sim | Restrito |
| `/laudos-api/v2` | `localhost:8001/api/v2` | API SQLite | ✅ Sim | Restrito |
| `/laudos-api` | `localhost:8001/api` | API Filesystem | ✅ Sim | Restrito |
| `/api/transcribe` | `localhost:8102` | Transcrição | ✅ Sim | Restrito |
| `/api/generate-report` | `localhost:8102` | Gemini | ✅ Sim | Restrito |
| `/api/generate-report-openai` | `localhost:8102` | OpenAI | ✅ Sim | Restrito |
| `/ohif` | `localhost:8080` | OHIF Viewer | ✅ Sim | Restrito |
| `/dicom-web` | `localhost:8042` | DICOM-web | ✅ Sim | Restrito |
| `/orthanc/` | `localhost:8042` | Orthanc REST | ✅ Sim | Restrito |
| `/patients`, `/studies`, etc | `localhost:8042` | Orthanc API | ✅ Sim | Restrito |
| `/portainer` | `localhost:9000` | Portainer UI | ✅ Sim | Restrito |
| `/dicom-files` | `/root/CLAUDE/Dicom-PDF/Users` | Arquivos | ✅ Autenticação HTTP Basic | Restrito |

### Recursos Especiais

🔒 **Segurança**
- HSTS com preload (63.072.000 segundos)
- Content-Security-Policy com upgrade automático
- Headers: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection

⚡ **Performance**
- Compressão DEFLATE (HTML, CSS, JS, JSON, PDF)
- ProxyIOBufferSize: 131072 bytes
- SendFile + MMAP habilitados
- Cache de proxy inteligente para APIs

🔌 **WebSocket**
- Vite HMR: `/laudos` → `wss://localhost:5174`
- Orthanc: `/orthanc` → `wss://localhost:8042`
- Portainer: `/portainer` → `wss://localhost:9000`

📝 **Logs**
- `ultrassom_error.log` → Erros
- `ultrassom_access.log` → Requisições
- `ultrassom_ssl_error.log` → Erros SSL
- `ultrassom_ssl_access.log` → Requisições SSL

---

## 🔗 URLs Finais para Acessar o Projeto Vertex

### Ambiente de Produção (HTTPS via domínio)

```
Produção:          https://ultrassom.ai
Frontend Laudos:   https://ultrassom.ai/laudos
API v2 (SQLite):   https://ultrassom.ai/laudos-api/v2
API v1 (FS):       https://ultrassom.ai/laudos-api
Gemini Streaming:  https://ultrassom.ai/api/generate-report
OpenAI Streaming:  https://ultrassom.ai/api/generate-report-openai
Transcrição:       https://ultrassom.ai/api/transcribe
```

### Ambiente de Desenvolvimento (HTTPS via localhost)

```
Frontend Vite:     https://localhost:8199
VS Code Server:    https://localhost:8150 (requer senha)
Gemini API:        https://localhost:8177/geminiCall
Voice Notes:       https://localhost:8101
Backend Webapp:    https://localhost:8100
```

### Ambiente Local (HTTP - sem SSL)

```
Vite Dev (HTTP):   http://localhost:8198
Gemini Python:     http://localhost:8176
Orthanc:           http://localhost:8042
OHIF Viewer:       http://localhost:8080
Portainer:         http://localhost:9000
Code Server:       http://localhost:8180
Voice Notes:       http://localhost:8110
Backend Laudos:    http://localhost:8001
Backend Webapp:    http://localhost:8102
PostgreSQL:        localhost:5432
```

---

## 🐛 Status dos Backends

| Backend | Porta | Processo | Status | Comando |
|---|---|---|---|---|
| Vite Dev Server | 8198 | node | ✅ Ativo | `npm run dev` |
| Vite HMR (HTTP) | 5173 | node | ✅ Ativo | Automático |
| Gemini API (Python) | 8176 | python | ✅ Ativo | Systemd |
| Code Server | 8180 | node | ✅ Ativo | Systemd |
| Voice Notes Backend | 8110 | node | ✅ Ativo | Systemd |
| Laudos Backend | 8001 | python3 | ✅ Ativo | Systemd |
| Laudos Webapp | 8102 | node | ✅ Ativo | Systemd |
| Orthanc (DICOM) | 8042 | docker | ✅ Ativo | Docker |
| OHIF Viewer | 8080 | docker | ✅ Ativo | Docker |
| Portainer | 9000 | docker | ✅ Ativo | Docker |
| PostgreSQL | 5432 | postgres | ✅ Ativo | Systemd |

---

## 📋 Arquivos Desabilitados (Limpeza)

Os seguintes arquivos foram **removidos** ou **não estão em sites-enabled**:

```
❌ ultrassom.ai-8133.conf (substituído por optimized)
❌ ultrassom-8123.conf
❌ ultrassom-8105.conf
❌ ultrassom-web.conf
❌ vite-8135.conf
❌ vertex-ultrassom-dev.conf
❌ vertex-ultrassom.conf
❌ flowsimulator.conf
❌ farma.conf
❌ laudos-simple.conf
❌ laudos-ssl.conf
❌ laudos-ultrassom-8300.conf
❌ 000-default.conf
❌ 000-default-le-ssl.conf (OBSOLETO)
```

**Razão:** Duplicação de funcionalidades, portas conflitantes, configurações desatualizadas.

---

## ✅ O Que Foi Corrigido

### 1. **Consolidação de Configurações**
- ❌ Antes: 35+ arquivos de configuração conflitantes
- ✅ Depois: 6 arquivos dedicados, sem conflitos

### 2. **Propagação de SSL Corrigida**
- ✅ Headers `X-Forwarded-SSL: on` em todos os proxies
- ✅ Rewrite automático de `http://` para `https://` em responses
- ✅ Protocolos WSS para WebSocket seguro

### 3. **WebSocket Funcional**
- ✅ Vite HMR via WSS seguro
- ✅ Orthanc WebSocket
- ✅ Portainer WebSocket
- ✅ Code Server WebSocket

### 4. **CORS Seguro**
- ✅ Restrito apenas ao domínio `https://ultrassom.ai`
- ✅ Métodos apropriados por endpoint
- ✅ Headers de autenticação suportados

### 5. **Performance Otimizada**
- ✅ Compressão em todos os tipos de conteúdo
- ✅ Buffers maiores para streaming
- ✅ SendFile/MMAP para arquivos estáticos
- ✅ Cache de proxy inteligente

### 6. **Segurança Reforçada**
- ✅ HSTS com preload
- ✅ Content-Security-Policy
- ✅ Headers de segurança completos
- ✅ Autenticação HTTP Basic em áreas sensíveis

---

## 🚀 Comandos Úteis para Anders

### Verificar Status

```bash
# Apache está rodando?
systemctl status apache2

# Teste rápido de configuração
apache2ctl configtest

# Ver quais portas Apache está ouvindo
netstat -tulpn | grep apache2

# Ver todos os VirtualHosts ativos
apache2ctl -S
```

### Recarregar Configurações

```bash
# Recarregar (sem desconectar clientes)
systemctl reload apache2

# Reiniciar (mata tudo e recomeça)
systemctl restart apache2

# Parar o Apache
systemctl stop apache2

# Iniciar o Apache
systemctl start apache2
```

### Habilitar/Desabilitar Sites

```bash
# Habilitar um site
a2ensite nome-do-arquivo.conf
systemctl reload apache2

# Desabilitar um site
a2dissite nome-do-arquivo.conf
systemctl reload apache2

# Verificar sites habilitados
ls -la /etc/apache2/sites-enabled/
```

### Habilitar/Desabilitar Módulos

```bash
# Habilitar módulo SSL
a2enmod ssl

# Desabilitar módulo
a2dismod nome-do-modulo

# Verificar módulos habilitados
apache2ctl -M | sort
```

### Monitoramento de Logs

```bash
# Erro SSL
tail -f /var/log/apache2/ultrassom_ssl_error.log

# Acesso SSL
tail -f /var/log/apache2/ultrassom_ssl_access.log

# Ver últimas linhas (não follow)
tail -50 /var/log/apache2/ultrassom_ssl_error.log

# Buscar erro específico
grep "502" /var/log/apache2/ultrassom_ssl_access.log | wc -l

# Ver todos os logs
ls -lh /var/log/apache2/
```

### Testar Conectividade

```bash
# Testar HTTP → HTTPS redirect
curl -I http://ultrassom.ai

# Testar HTTPS
curl -I https://ultrassom.ai

# Testar com certificado autossinado
curl -k -I https://localhost:443

# Testar porta específica
curl -k -I https://localhost:8199

# Testar rota de proxy
curl -I https://ultrassom.ai/laudos

# Testar com headers
curl -I -H "Accept-Encoding: gzip" https://ultrassom.ai
```

### Certificados SSL

```bash
# Ver data de expiração
echo | openssl s_client -connect ultrassom.ai:443 2>/dev/null | openssl x509 -noout -dates

# Testar certificado localmente
echo | openssl s_client -connect localhost:443 -servername ultrassom.ai 2>/dev/null | openssl x509 -noout -dates

# Renovar certificado (automático com certbot)
certbot renew

# Renovar e recarregar Apache
certbot renew --post-hook "systemctl reload apache2"

# Ver certificado ativo
ls -la /etc/letsencrypt/live/ultrassom.ai/
```

### Troubleshooting Rápido

```bash
# Apache não iniciava? Teste config primeiro
apache2ctl configtest

# Erro 502 Bad Gateway? Verifica se backend está rodando
netstat -tulpn | grep 8102

# WebSocket não funciona? Teste com curl
curl -i -N -H "Connection: upgrade" -H "Upgrade: websocket" https://ultrassom.ai/laudos

# Porta em uso? Vê quem está usando
lsof -i :443
lsof -i :8100

# Matar processo na porta (cuidado!)
fuser -k 8100/tcp

# Aumentar limite de conexões (se necessário)
ulimit -n 10000
```

### Backup de Configurações

```bash
# Backup de todas as configs
tar -czf backup-apache-$(date +%Y%m%d).tar.gz /etc/apache2/

# Backup de um site específico
cp /etc/apache2/sites-available/ultrassom.ai-optimized.conf{,.backup}

# Restaurar de backup
tar -xzf backup-apache-20251021.tar.gz
```

### Editar Configurações

```bash
# Editar configuração principal
nano /etc/apache2/sites-available/ultrassom.ai-optimized.conf

# Editar depois de salvar, recarregar Apache
systemctl reload apache2

# Se der erro, voltar ao backup
cp /etc/apache2/sites-available/ultrassom.ai-optimized.conf.backup /etc/apache2/sites-available/ultrassom.ai-optimized.conf
systemctl reload apache2
```

---

## 📌 Checklist Final

- ✅ Apache respondendo em 80 e 443
- ✅ Todas as 6 configurações habilitadas
- ✅ Frontend `/laudos` carregando
- ✅ APIs respondendo (v1 e v2)
- ✅ SSL propagado para backends
- ✅ WebSocket funcionando
- ✅ CORS restrito ao domínio
- ✅ Logs sendo gerados corretamente
- ✅ Certificado válido até 03/11/2025
- ✅ Todos os backends conectados

---

## 📞 Próximos Passos

1. **Monitorar logs** nos próximos dias
2. **Renovação de certificado** → Agendada automaticamente via `certbot`
3. **Escalação de recursos** → Avaliar se ProxyIOBufferSize precisa aumentar
4. **Adicionar novas rotas** → Usar o template de `<Location>` já existente

---

**Versão:** 1.0  
**Última Atualização:** 21 de Outubro de 2025  
**Status:** ✅ Pronto para Produção

