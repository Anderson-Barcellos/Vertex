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
│   └── VenousExamModern.tsx
├── components/
│   ├── original/          # Componentes core
│   │   ├── OrganSection.tsx        # Seção de achados (estado persistente)
│   │   ├── Sidebar.tsx            # Navegação lateral
│   │   └── ReportCanvas.tsx       # Canvas do laudo
│   ├── shared/           # Componentes compartilhados
│   │   └── FloatingOrganPanelModern.tsx  # Painel flutuante
│   └── ui/              # Componentes UI base (Radix)
├── services/
│   ├── geminiStreamService.ts    # Streaming Gemini (backend)
│   ├── openaiStreamService.ts    # Streaming OpenAI
│   ├── unifiedAIService.ts      # Interface unificada
│   └── promptBuilder.ts         # Construção de prompts
└── data/
    ├── organs.ts                 # Abdome total
    ├── carotidOrgans.ts         # Carótidas
    ├── thyroidOrgans.ts         # Tireóide
    ├── breastUltrasoundOrgans.ts # Mama (BI-RADS)
    └── venousOrgans.ts          # Doppler venoso
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

### CORS na API
**Solução:** Usar proxy `/api/gemini` ao invés de URL direta

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

---

## Notas Importantes

- **Branch principal:** `master`
- **Deploy:** Não configurado (desenvolvimento local apenas)
- **Testes:** Não implementados (prioridade futura)
- **Backend API:** Gemini via proxy local `/api/gemini`
- **Autenticação:** Não implementada (uso interno)

---

*Última atualização: 18 de Novembro de 2025*