# Systemd Service - Pendência de Configuração

## Status Atual
O serviço systemd foi criado mas falha ao iniciar com exit code 1.

## Arquivo de Serviço
**Local:** `/etc/systemd/system/vertex-v2.service`

```ini
[Unit]
Description=Vertex V2 Vite Dev Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/PROJECT/vertex-v2
ExecStart=/usr/bin/npm run dev
Restart=always
RestartSec=10
StandardOutput=append:/var/log/vertex-v2/vertex.log
StandardError=append:/var/log/vertex-v2/error.log
Environment="NODE_ENV=development"
Environment="PATH=/usr/bin:/bin:/usr/local/bin"

[Install]
WantedBy=multi-user.target
```

## Problema Identificado
O serviço está falhando porque provavelmente não consegue encontrar o npm/node no ambiente restrito do systemd.

## Solução Proposta

### Opção 1: Usar caminho absoluto do Node
1. Encontrar o caminho absoluto do node:
   ```bash
   which node
   # geralmente: /usr/local/bin/node ou /usr/bin/node
   ```

2. Atualizar o ExecStart para chamar node diretamente:
   ```ini
   ExecStart=/usr/local/bin/node /usr/local/bin/npm run dev
   # ou
   ExecStart=/usr/local/bin/node /root/PROJECT/vertex-v2/node_modules/.bin/vite
   ```

### Opção 2: Script wrapper
1. Criar script `/root/PROJECT/vertex-v2/start-dev.sh`:
   ```bash
   #!/bin/bash
   cd /root/PROJECT/vertex-v2
   /usr/local/bin/npm run dev
   ```

2. Dar permissão de execução:
   ```bash
   chmod +x /root/PROJECT/vertex-v2/start-dev.sh
   ```

3. Atualizar o serviço:
   ```ini
   ExecStart=/root/PROJECT/vertex-v2/start-dev.sh
   ```

### Opção 3: Usar npx com caminho completo
```ini
ExecStart=/usr/local/bin/npx vite --host 0.0.0.0 --port 8200
```

## Passos para Implementar a Correção

1. **Verificar logs do erro:**
   ```bash
   journalctl -u vertex-v2.service -n 50
   ```

2. **Identificar caminho correto do node/npm:**
   ```bash
   which node
   which npm
   ```

3. **Editar o serviço:**
   ```bash
   systemctl edit vertex-v2.service
   ```

4. **Recarregar e testar:**
   ```bash
   systemctl daemon-reload
   systemctl restart vertex-v2.service
   systemctl status vertex-v2.service
   ```

## Configuração Adicional Recomendada

### Variáveis de Ambiente
Adicionar ao serviço:
```ini
Environment="NODE_PATH=/usr/local/lib/node_modules"
Environment="HOME=/root"
```

### Logging Melhorado
Criar diretório de logs se não existir:
```bash
mkdir -p /var/log/vertex-v2
```

### Monitoramento
Adicionar notificações em caso de falha:
```ini
[Service]
RestartSec=10
StartLimitInterval=600
StartLimitBurst=5
OnFailure=notify-admin@%i.service
```

## Alternativa: PM2
Considerar usar PM2 para gerenciamento de processos Node.js:

```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicação
pm2 start npm --name "vertex-v2" -- run dev

# Salvar configuração
pm2 save

# Gerar script de inicialização
pm2 startup systemd
```

## Status de Implementação
- [x] Serviço criado
- [x] Serviço habilitado
- [ ] Corrigir problema de PATH
- [ ] Testar inicialização automática
- [ ] Configurar logs adequadamente
- [ ] Documentar solução final

## Notas
- O servidor dev do Vite já está rodando em processos bash paralelos
- Porta configurada: 8200 (vertex.ultrassom.ai)
- Múltiplas instâncias npm run dev detectadas em background