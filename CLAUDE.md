# Vertex V2 - Documentação Claude

**Sistema de Geração de Laudos Ultrassonográficos com IA**  
**Versão:** 2.0.0 | **Status:** Em Produção  
**Repositório:** https://github.com/Anderson-Barcellos/Vertex

---

## 🧠 Sistema de Memória (Recuperação de Contexto)

### ⚙️ Configuração Automática
A variável `CLAUDE_PROJECT_PATH` é configurada dinamicamente:
```bash
# No ~/.bashrc (já configurado):
export CLAUDE_PROJECT_PATH="/root/.claude/projects/$(basename $PWD)"

# Se estiver em /root/PROJECT/vertex-v2:
# → CLAUDE_PROJECT_PATH="/root/.claude/projects/vertex-v2"
```

### 📝 Comandos Disponíveis
```bash
/memorypack                      # Indexa conversas do projeto atual
/memsearch "termo específico"    # Buscar soluções antigas
/memlist vertex --limit 5        # Ver conversas recentes
/memview arquivo.jsonl           # Recuperar conversa completa
/memstats                        # Estatísticas do banco
```

**Usar quando:**
- Usuário menciona "como fizemos antes"
- Preciso recuperar implementação específica
- Verificar padrões já estabelecidos
- Buscar erros já resolvidos

---

## Contexto do Projeto

Sistema web para geração automatizada de laudos ultrassonográficos com IA (Gemini/OpenAI), seguindo diretrizes médicas brasileiras (CBR, SBACV, BI-RADS).

### Stack Principal
- **Frontend:** React 19 + TypeScript 5.9
- **Build:** Vite 7.2.0  
- **Estilização:** Tailwind CSS v4 + Radix UI
- **IA:** Gemini 2.5 Pro + OpenAI GPT-4
- **Dev Server:** http://localhost:8200

---

## Arquitetura de Componentes

```
src/
├── pages/modern/          # Páginas de exames (modern design)
│   ├── AbdomeTotalExamModern.tsx
│   ├── CarotidExamModern.tsx  
│   ├── ThyroidEchodopplerModern.tsx
│   ├── BreastUltrasoundExamModern.tsx
│   ├── ArterialExamModern.tsx
│   ├── VenousExamModern.tsx
│   └── AbdominalWallExamModern.tsx
├── components/
│   ├── original/          # Componentes core
│   │   ├── OrganSection.tsx           # Seção de achados (estado persistente)
│   │   ├── FindingDetailsGeneric.tsx  # Renderiza extraFields dinâmicos
│   │   ├── Sidebar.tsx               # Navegação lateral
│   │   └── ReportCanvas.tsx          # Canvas do laudo
│   ├── shared/           # Componentes compartilhados
│   │   └── FloatingOrganPanelModern.tsx  # Painel flutuante
│   └── ui/              # Componentes UI base (Radix)
├── services/
│   ├── geminiStreamService.ts    # Streaming Gemini (backend)
│   ├── openaiStreamService.ts    # Streaming OpenAI
│   ├── unifiedAIService.ts      # Interface unificada
│   └── promptBuilder.ts         # Construção de prompts
├── data/
│   ├── organs.ts                 # Abdome total
│   ├── carotidOrgans.ts         # Carótidas
│   ├── thyroidOrgans.ts         # Tireóide
│   ├── breastUltrasoundOrgans.ts # Mama (BI-RADS)
│   ├── arterialOrgans.ts        # Doppler arterial (5 seções)
│   ├── venousOrgans.ts          # Doppler venoso (5 seções)
│   └── abdominalWallOrgans.ts   # Parede abdominal/hérnias
└── hooks/
    ├── useDropdownGuard.ts       # Previne fechar painel em dropdown
    └── useOutsidePointerDismiss.ts # Click-outside com proteção input
```

---

## Comandos Essenciais

```bash
# Desenvolvimento
npm run dev              # Inicia servidor dev (porta 8200)

# Git
git status              # Ver mudanças
git add -A             # Adicionar todas mudanças
git commit -m "..."    # Commit
git push origin master # Push para GitHub

# Verificação
curl -s http://localhost:8200/ | head -5  # Testar servidor
```

---

## Funcionalidades Recentes (Nov 2025)

### Persistência de Estado em Painéis Flutuantes
- **Problema:** Dados perdidos ao minimizar/trocar órgão
- **Solução:** Estado elevado para componentes pais
- **Arquivos:** `OrganSection.tsx`, `FloatingOrganPanelModern.tsx`, todos exames modernos
- **Benefício:** Dados temporários preservados durante navegação

### Sistema de Prompt Backend (Gemini)
- **Local:** `geminiStreamService.ts`
- **Prompt:** Radiologista com 20 anos experiência
- **Referências:** NASCET, Gray-Weale, EMI
- **Endpoint:** `/api/gemini` (proxy local)

### Doppler Venoso (Novo Exame)
- **Rota:** `/venous-exam`
- **Features:** TVP, insuficiência, classificação CEAP
- **Status:** Implementado e funcional

### Refatoração Doppler MMII (Nov 2025)
- **Arterial:** 12 seções → 5 seções (~260 linhas)
- **Venoso:** 19 seções → 5 seções (~280 linhas)
- **Padrão:** Bilateralidade como campo dropdown ("Lado: D/E")
- **Segmentos Arterial:** Aorto-Ilíaco, Femoral, Poplíteo, Infrapoplíteo, Observações
- **Segmentos Venoso:** Sistema Profundo, Safênico, Perfurantes, Panturrilha, Observações

### FindingDetailsGeneric
- **Arquivo:** `components/original/FindingDetailsGeneric.tsx`
- **Função:** Renderiza `extraFields` dinamicamente (select, text, textarea)
- **Uso:** Substitui componentes específicos por finding details

### Fix: Painel não fecha com input focado
- **Hook:** `useOutsidePointerDismiss.ts`
- **Comportamento:** Se input/textarea está focado, clique fora não minimiza

### US Parede Abdominal (Novo Exame)
- **Rota:** `/abdominal-wall-exam`
- **Foco:** Hérnias (inguinal, umbilical, incisional, epigástrica)
- **Campos:** Óstio, saco herniário, conteúdo, redutibilidade

### Melhorias UX (Nov 2025)
Implementações de acessibilidade e animações fluidas em `modern-design.css`:

- **Acessibilidade Motion:** `@media (prefers-reduced-motion)` desativa animações
- **Focus States:** `:focus-visible` com outline accent para navegação por teclado
- **Progress Circle:** SVG animado com `stroke-dashoffset` transition na Sidebar
- **Indicador Unsaved:** Classe `.has-unsaved-data` com glow animado
- **Dropdown Animations:** Entrada com `scaleY` + stagger delay nos items
- **Skeleton Loading:** Shimmer effect para estados de carregamento
- **Ripple Effect:** `.ripple-container` para feedback visual em cliques
- **Stagger Animation:** `.stagger-item` com delays incrementais (usado na Landing)
- **Panel Expand:** Animação elástica `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Count Animation:** `.count-up` com pop effect na porcentagem

**Arquivos afetados:**
- `src/styles/modern-design.css` - Classes CSS novas
- `src/components/original/Sidebar.tsx` - Progress circle animado
- `src/components/shared/FloatingOrganPanelModern.tsx` - Panel expand
- `src/pages/v2/LandingPageModern.tsx` - Cards com stagger + acessibilidade

---

## Padrões de Código

### Componentes de Exame
Todos os exames modernos seguem o mesmo padrão:

```typescript
// Estado essencial
const [selectedFindings, setSelectedFindings] = useState<SelectedFinding[]>([]);
const [normalOrgans, setNormalOrgans] = useState<string[]>([]);
const [tempFindingDetails, setTempFindingDetails] = useState<...>({}); // Persistência

// Handlers obrigatórios
handleOrganSelect()
handleFindingChange()
handleNormalChange()
handleTempDetailsChange()  // Para persistência
getTempDetails()          // Para recuperar estado
```

### FloatingOrganPanelModern
Props essenciais:
```typescript
tempDetails={getTempDetails(currentOrgan.id)}
onTempDetailsChange={handleTempDetailsChange}
```

### Geração de Laudos com IA
```typescript
// Sempre usar o service unificado
import { unifiedAIService } from '@/services/unifiedAIService';

// Gerar com streaming
await unifiedAIService.generateReport(data, {
  model: 'gemini',  // ou 'openai'
  onChunk: (text) => setGeneratedReport(text),
  onComplete: () => setIsGenerating(false)
});
```

---

## Diretrizes de Desenvolvimento

### Sempre:
- Preservar estado ao minimizar/trocar componentes
- Usar streaming para geração de laudos
- Seguir padrões existentes dos exames modernos
- Manter nomenclatura consistente (Modern suffix)
- Commitar com mensagens descritivas

### Nunca:
- Criar novos exames sem seguir estrutura moderna
- Modificar `geminiStreamService` sem testar prompt
- Usar estado local quando deveria ser elevado
- Esquecer de adicionar persistência em novos exames

---

## Troubleshooting

### Painel fecha ao selecionar dropdown
**Solução:** Implementado `useDropdownGuard` + `useOutsidePointerDismiss`

### Estado perdido ao minimizar
**Solução:** Estado `tempFindingDetails` nos componentes pais

### Painel fecha ao preencher input e clicar fora
**Solução:** `useOutsidePointerDismiss` verifica `document.activeElement` antes de fechar

### CORS na API
**Solução:** Usar proxy `/api/gemini` ao invés de URL direta

---

## Sistema de Autenticação (Nov 2025)

### Arquivos
- `src/contexts/AuthContext.tsx` - Provider de autenticação
- `src/pages/LoginPage.tsx` - Tela de login
- `src/components/ProtectedRoute.tsx` - Proteção de rotas

### Credenciais
- **Usuário:** anders
- **Senha:** vertex2025

### Funcionalidades
- Sessão persistente via localStorage
- Todas as rotas protegidas exceto `/login`
- Botão de logout na Landing Page

---

## Melhorias em Campos Médicos (Nov 2025)

### Doppler Arterial
- **ITB (Índice Tornozelo-Braquial)** com classificação SBACV
- ITB pós-exercício com tempo de recuperação

### Abdome Total - Campos Condicionais
- Esteatose: distribuição + atenuação hepática
- Colelitíase: tipo + mobilidade + sombra acústica
- Hidronefrose: lado + causa provável + medida pelve
- Aneurisma: morfologia + trombo mural + extensão
- Novos achados: hepatopatia crônica, vesícula porcelana, Murphy US+, pancreatite aguda/crônica, Bosniak, nefropatia parenquimatosa

### Tireóide - TI-RADS Automático
- Função `calculateTIRADS()` exportada
- Campo de TI-RADS calculado nos nódulos
- Recomendações automáticas (PAAF/seguimento)

### Doppler Venoso
- Manobras provocativas (Valsalva, compressão, ortostatismo)
- Tempo de refluxo em todos os achados de insuficiência

### Parede Abdominal
- Visibilidade dinâmica (repouso, Valsalva, tosse)
- Manobra realizada em todas as hérnias

---

## Contexto Médico

**Desenvolvido por:** Dr. Anderson (Anders)  
**Especialidades:** Neuropsiquiatria e Ultrassonografia  
**Local:** Santa Cruz do Sul, RS, Brasil  

### Exames Implementados:
1. **Abdome Total** - Fígado, vesícula, rins, pâncreas, baço
2. **Doppler Carótidas** - NASCET, placas, EMI
3. **Ecodoppler Tireóide** - TI-RADS, nódulos
4. **Ultrassom Mama** - BI-RADS 5ª edição completo
5. **Doppler Venoso** - TVP, insuficiência, CEAP
6. **Doppler Arterial** - Estenose, oclusão, aneurisma poplíteo
7. **US Parede Abdominal** - Hérnias por região

---

## Notas Importantes

- **Branch principal:** `master`
- **Deploy:** Não configurado (desenvolvimento local apenas)
- **Testes:** Não implementados (prioridade futura)
- **Backend API:** Gemini via proxy local `/api/gemini`
- **Autenticação:** Não implementada (uso interno)

---

*Última atualização: 25 de Novembro de 2025*