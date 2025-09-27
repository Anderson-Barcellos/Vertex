# 📋 Documentação do Projeto - Vertex US

**Data de Configuração:** 14 de Setembro de 2025
**Última Atualização:** 25 de Setembro de 2025
**Configurado por:** Claude + Vertex Team
**Projeto:** Sistema de Geração de Laudos Ultrassonográficos com IA
**Repositório GitHub:** https://github.com/Anderson-Barcellos/Vertex

## 🎯 Visão Geral

Sistema profissional de geração de laudos ultrassonográficos com interface intuitiva em três colunas, seguindo as diretrizes do Colégio Brasileiro de Radiologia (CBR) para documentação de achados médicos.

### Stack Tecnológica
- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite 7.1.5
- **Estilização:** Tailwind CSS v4 + Radix UI
- **Roteamento:** React Router DOM v7
- **Ícones:** Phosphor Icons + Lucide React
- **IA Integrada:**
  - Google Gemini AI (gemini-2.0-flash-exp) com streaming
  - OpenAI GPT-5 Nano com streaming
- **Markdown:** react-markdown + remark-gfm
- **Servidor Web:** Apache 2.4.62 (Reverse Proxy)
- **SSL:** Let's Encrypt (válido até 03/11/2025)
- **Domínio:** ultrassom.ai

## 🏗️ Arquitetura do Sistema

```
┌─────────────────┐
│   Cliente Web   │
│  (Navegador)    │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  Apache:8133    │ ◄── SSL/TLS (Let's Encrypt)
│  (Reverse Proxy)│ ◄── Headers de Segurança
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│   Vite:8134     │ ◄── Dev Server
│  (localhost)    │ ◄── Hot Module Replacement
└─────────────────┘
```

## 🔧 Configurações Implementadas

### 1. Portas e Acessos

| Serviço | Porta | Protocolo | Acesso |
|---------|-------|-----------|---------|
| Apache | 8133 | HTTPS | Externo (ultrassom.ai:8133) |
| Vite | 8134 | HTTP | Interno (localhost:8134) |

### 2. URLs de Acesso
- **Produção:** https://ultrassom.ai:8133
- **Local SSL:** https://localhost:8133
- **Desenvolvimento:** http://localhost:8134

### 3. Certificados SSL
- **Localização:** `/etc/letsencrypt/live/ultrassom.ai/`
- **Certificado:** `fullchain.pem`
- **Chave Privada:** `privkey.pem`
- **Validade:** Até 03 de Novembro de 2025

## 📁 Estrutura de Arquivos Importantes

### Configuração do Apache
**Arquivo:** `/etc/apache2/sites-available/ultrassom.ai-8133.conf`

```apache
<VirtualHost *:8133>
    ServerName ultrassom.ai
    ServerAlias www.ultrassom.ai

    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/ultrassom.ai/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/ultrassom.ai/privkey.pem

    # Security Headers
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"

    # Proxy Configuration
    ProxyPreserveHost On
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "8133"

    ProxyPass / http://localhost:8134/
    ProxyPassReverse / http://localhost:8134/

    # WebSocket proxy para HMR
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteRule ^/?(.*) "ws://localhost:8134/$1" [P,L]
</VirtualHost>

Listen 8133 https
```

### Configuração do Vite
**Arquivo:** `/root/US/ultrasound-report-ge/vite.config.ts`

```typescript
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 8134,
    host: '127.0.0.1',
    strictPort: true,
    proxy: {},
    hmr: {
      protocol: 'wss',
      host: 'ultrassom.ai',
      clientPort: 8133,
      port: 8134
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'ultrassom.ai',
      'www.ultrassom.ai',
      '.ultrassom.ai'
    ]
  }
});
```

## 🐛 Problemas Resolvidos

### 1. Remoção do Spark Template
- **Problema:** Spark forçava configurações e adicionava dependências desnecessárias
- **Solução:** Removido completamente, reduzindo de 472 para 420 pacotes

### 2. Erro de Variável Tailwind CSS
- **Problema:** `The --spacing(…) function requires that the --spacing theme variable exists`
- **Solução:** Adicionada variável `--spacing: 0.25rem` no arquivo `main.css`

### 3. Host Blocking do Vite
- **Problema:** `Blocked request. This host ("ultrassom.ai") is not allowed`
- **Solução:** Configurado `allowedHosts` no vite.config.ts

### 4. Configuração HTTPS/WSS
- **Problema:** HMR não funcionava através do proxy SSL
- **Solução:** Configurado WebSocket seguro (wss) com proxy correto

### 5. React ErrorBoundary Bloqueando Renderização
- **Problema:** Tela em branco devido ao ErrorBoundary relançando erros em desenvolvimento
- **Solução:** Modificado `ErrorFallback.tsx` para apenas logar erros sem relançá-los

### 6. Achados Duplicados em Campos Dinâmicos
- **Problema:** Cada digitação adicionava novo achado duplicado na lista
- **Solução:** Implementado estado local e botão "Salvar" em `FindingDetailsEnhanced.tsx`

## 🚀 Comandos Úteis

### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
cd /root/US/ultrasound-report-ge
npm run dev

# Parar servidor na porta 8133
npm run kill

# Build para produção
npm run build
```

### Apache
```bash
# Testar configuração
apache2ctl configtest

# Recarregar Apache
systemctl reload apache2

# Ver logs
tail -f /var/log/apache2/ultrassom.ai-error.log
tail -f /var/log/apache2/ultrassom.ai-access.log

# Status do Apache
systemctl status apache2
```

### Verificação de Portas
```bash
# Ver o que está usando porta 8133
lsof -i :8133

# Ver o que está usando porta 8134
lsof -i :8134

# Matar processo na porta
fuser -k 8133/tcp
```

### Certificados SSL
```bash
# Verificar certificado
openssl s_client -connect localhost:8133 -servername ultrassom.ai

# Ver data de expiração
echo | openssl s_client -connect ultrassom.ai:8133 2>/dev/null | openssl x509 -noout -dates
```

## 🔐 Segurança

### Headers de Segurança Configurados
- `X-Content-Type-Options: nosniff` - Previne MIME type sniffing
- `X-Frame-Options: SAMEORIGIN` - Previne clickjacking
- `X-XSS-Protection: 1; mode=block` - Proteção XSS (navegadores antigos)

### Proxy Headers
- `X-Forwarded-Proto: https` - Indica protocolo original
- `X-Forwarded-Port: 8133` - Porta original
- `X-Forwarded-Host: ultrassom.ai:8133` - Host original
- `X-Forwarded-For` - IP do cliente

## 🚀 Novas Funcionalidades (24/09/2025)

### Integração com IA Avançada
1. **Gemini AI Streaming**
   - Modelo: gemini-2.0-flash-exp
   - Geração de laudos em tempo real
   - Impressão clínica automática durante seleção de achados
   - Sistema de callbacks para atualização progressiva

2. **OpenAI GPT-5 Nano**
   - Integração completa com streaming
   - Suporte a formato JSON estruturado
   - Seletor de modelo na interface
   - Indicador visual do modelo em uso

3. **Melhorias na Interface**
   - SelectedFindingsPanel movido para lado direito como painel flutuante
   - Altura adaptativa baseada no conteúdo
   - Animações verdes fade-in para novos itens
   - Correção do problema de fechamento do popup ao selecionar dropdowns
   - Detecção inteligente de portais Radix UI

4. **Controle de Versão**
   - Repositório Git inicializado
   - Push para GitHub privado: Anderson-Barcellos/Vertex
   - 104 arquivos versionados
   - 22.506+ linhas de código

### Correções de Bugs
- ✅ Popup lateral não fecha mais ao selecionar opções com campos extras
- ✅ WebSocket/HMR configurado corretamente para desenvolvimento local
- ✅ Removido fallback genérico que aparecia no campo superior
- ✅ Correção de sintaxe em componentes React com stopPropagation
- ✅ Importações corrigidas no geminiClient.ts

## 📝 Manutenção

### Renovação do Certificado SSL
O certificado Let's Encrypt expira em **03/11/2025**. Para renovar:
```bash
certbot renew
systemctl reload apache2
```

### Atualização de Dependências
```bash
cd /root/US/ultrasound-report-ge
npm update
npm audit fix
```

### Backup Recomendado
Arquivos importantes para backup:
- `/etc/apache2/sites-available/ultrassom.ai-8133.conf`
- `/root/US/ultrasound-report-ge/vite.config.ts`
- `/root/US/ultrasound-report-ge/package.json`
- `/etc/letsencrypt/` (certificados)

## 🔄 Como Reiniciar o Sistema

1. **Parar serviços:**
```bash
# Parar Vite (se estiver rodando)
pkill -f "node.*vite.*ultrasound"
```

2. **Iniciar Apache (se não estiver rodando):**
```bash
systemctl start apache2
```

3. **Iniciar Vite:**
```bash
cd /root/US/ultrasound-report-ge
npm run dev
```

4. **Verificar acesso:**
```bash
curl -I https://ultrassom.ai:8133
```

## 📊 Monitoramento

### Verificar se tudo está funcionando:
```bash
# Testar Apache
curl -I https://localhost:8133

# Testar Vite direto
curl -I http://localhost:8134

# Testar domínio
curl -I https://ultrassom.ai:8133
```

### Resposta esperada:
```
HTTP/1.1 200 OK
Server: Apache/2.4.62 (Ubuntu)
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
```

## 🎨 Componentes do Sistema

### Principais Funcionalidades
1. **Landing Page com Modalidades** - 8 tipos de exames ultrassonográficos
2. **Layout em 3 Colunas** - Navegação, achados selecionados e canvas do relatório
3. **Navegação por Órgãos** - Menu lateral com órgãos abdominais
4. **Seleção de Achados Patológicos** - Checkboxes categorizados com campos dinâmicos
5. **Campos Dinâmicos CBR** - Medidas, localização e severidade conforme diretrizes
6. **Múltiplas Instâncias** - Suporte para múltiplas lesões por achado
7. **Painel Flutuante Minimizável** - Seleção de órgão com click-outside
8. **Geração de Relatório Estruturado** - Compilação automática com IA
9. **Integração com IA** - Preparado para Gemini AI (futuro)

### Estrutura de Diretórios
```
/root/US/ultrasound-report-ge/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Sidebar.tsx     # Navegação lateral de órgãos
│   │   ├── OrganSection.tsx # Seção de achados por órgão
│   │   ├── FindingDetailsEnhanced.tsx # Campos dinâmicos
│   │   ├── SelectedFindingsPanel.tsx # Painel de achados
│   │   └── ReportCanvas.tsx # Canvas do relatório
│   ├── pages/              # Páginas da aplicação
│   │   ├── LandingPage.tsx # Página inicial
│   │   └── AbdomeTotalExam.tsx # Exame abdome total
│   ├── data/               # Dados dos órgãos
│   │   └── organs.ts       # Definições CBR
│   ├── services/           # Lógica de negócio
│   ├── styles/             # Estilos CSS
│   └── types/              # TypeScript types
├── vite.config.ts          # Configuração Vite
├── tailwind.config.js      # Configuração Tailwind
└── package.json            # Dependências
```

### Componentes Principais

#### 1. **LandingPage.tsx**
- 8 modalidades de exame (Abdome Total ativo, outros em breve)
- Grid responsivo com cards de seleção
- Navegação via React Router

#### 2. **AbdomeTotalExam.tsx**
- Layout de 3 colunas
- Gerenciamento de estado dos achados
- Painel flutuante minimizável
- Click-outside detection

#### 3. **FindingDetailsEnhanced.tsx**
- Campos dinâmicos baseados no tipo de achado
- Dropdowns de localização específicos por órgão
- Suporte a múltiplas instâncias
- Seguindo diretrizes CBR:
  - Fígado: Segmentos I-VIII, IVa, IVb
  - Rins: Polo superior/médio/inferior, cortical/medular
  - Pâncreas: Cabeça, corpo, cauda
  - Bexiga: Cúpula, paredes, trígono
  - Aorta: Porções e diâmetros

#### 4. **SelectedFindingsPanel.tsx**
- Sidebar fixa de achados selecionados
- Exibição hierárquica por órgão
- Detalhes de medidas e localização
- Órgãos normais em badges
- Alinhado com os cartões A4 do canvas

#### 5. **ExamStatisticsPanel.tsx** (NOVO - 25/09/2025)
- Painel flutuante de estatísticas do exame
- Posicionado abaixo do SelectedFindingsPanel
- Métricas em formato de linhas com separadores
- Barra de progresso visual da cobertura do exame
- Animações fade-in verdes para valores atualizados
- Design dark theme consistente

## 📊 Melhorias Implementadas (15/09/2025)

### Interface e UX
1. **Landing Page Profissional**
   - 8 modalidades de exame em grid responsivo
   - Apenas "Abdome Total" disponível inicialmente
   - Roteamento com React Router DOM v7

2. **Layout Otimizado em 3 Colunas**
   - Coluna 1: Navegação de órgãos (dark theme)
   - Coluna 2: Painel de achados selecionados
   - Coluna 3: Canvas do relatório (A4 simulado)

3. **Painel Flutuante Inteligente**
   - Minimiza automaticamente ao clicar fora
   - Reabre ao clicar em qualquer área do painel minimizado
   - Transições suaves com Tailwind

### Funcionalidades Médicas (CBR)
1. **Campos Dinâmicos por Tipo de Achado**
   - `hasSeverity`: Dropdown leve/moderado/acentuado
   - `hasMeasurement`: Campo de medidas em cm/mm
   - `hasLocation`: Dropdowns específicos por órgão
   - `hasQuantity`: Contador de lesões

2. **Suporte a Múltiplas Instâncias**
   - Adicionar várias lesões do mesmo tipo
   - Cada lesão com suas próprias medidas
   - Interface de edição com botão "Salvar"

3. **Localizações Anatômicas Específicas**
   - Fígado: Segmentos hepáticos I-VIII
   - Rins: Polos e regiões cortico-medulares
   - Pâncreas: Divisões anatômicas
   - Bexiga: Regiões vesicais
   - Aorta: Porções e medidas de diâmetro

## 🚧 Roadmap Futuro

### Próximas Implementações
- [ ] Integração com Gemini AI para geração de laudos
- [ ] Outras modalidades de exame (Tireoide, Pélvico, etc.)
- [ ] Sistema de templates de laudos
- [ ] Exportação em PDF formatado
- [ ] Histórico de pacientes
- [ ] Assinatura digital

## 🤝 Suporte e Contato

Para questões sobre esta configuração, consulte este documento ou execute novos comandos com Claude.

---

**Última atualização:** 15 de Setembro de 2025
**Versão:** 2.0.0
**Status:** ✅ Sistema Operacional com Interface Otimizada

## \ud83d\udd27 Configura\u00e7\u00e3o de APIs (ATUALIZADO 24/09/2025)

### Vari\u00e1veis de Ambiente (.env)
```env
# Gemini AI - Google
VITE_GEMINI_API_KEY=sua_chave_gemini_aqui

# OpenAI - GPT-5 Nano
VITE_OPENAI_API_KEY=sua_chave_openai_aqui
```

## \ud83c\udf86 Novas Funcionalidades Implementadas em 24/09/2025

- \u2705 **Integra\u00e7\u00e3o Gemini AI com streaming completo**
- \u2705 **Integra\u00e7\u00e3o OpenAI GPT-5 Nano com streaming**
- \u2705 **Corre\u00e7\u00e3o do bug de fechamento do popup ao selecionar dropdowns**
- \u2705 **Reposit\u00f3rio GitHub privado criado e configurado**
- \u2705 **104 arquivos versionados com 22.506+ linhas de c\u00f3digo**

## \ud83c\udf06 Novas Funcionalidades Implementadas em 25/09/2025

### Melhorias na Interface e UX
1. **Bot\u00f5es R\u00e1pidos "Normal" na Sidebar**
   - Bot\u00e3o CheckCircle ao lado de cada \u00f3rg\u00e3o na navega\u00e7\u00e3o
   - Marca \u00f3rg\u00e3os como normais com apenas 1 clique (antes eram 2-3)
   - Feedback visual imediato com \u00edcone verde preenchido
   - Evita abertura desnecess\u00e1ria do painel flutuante

2. **Reposicionamento do SelectedFindingsPanel**
   - Movido para alinhar com os cart\u00f5es A4 (mt-32)
   - Melhor aproveitamento do espa\u00e7o vertical
   - Alinhamento visual mais harm\u00f4nico com o canvas do relat\u00f3rio

3. **Novo ExamStatisticsPanel**
   - Painel de estat\u00edsticas do exame em formato de linhas
   - Posicionado abaixo do SelectedFindingsPanel
   - Exibe m\u00e9tricas em tempo real:
     - Achados registrados
     - \u00d3rg\u00e3os com achados
     - \u00d3rg\u00e3os normais
     - Barra de cobertura do exame com gradiente
   - Anima\u00e7\u00f5es suaves com efeito verde para novos valores
   - Estilo consistente com o design dark do sistema

4. **Corre\u00e7\u00f5es de Layout**
   - Corre\u00e7\u00e3o do problema de centraliza\u00e7\u00e3o vertical com `min-h-full`
   - Remo\u00e7\u00e3o dos cards de estat\u00edsticas do ReportCanvas
   - Organiza\u00e7\u00e3o dos pain\u00e9is flutuantes em container flex

**Reposit\u00f3rio GitHub:** https://github.com/Anderson-Barcellos/Vertex
**Vers\u00e3o Atual:** 3.1.0
